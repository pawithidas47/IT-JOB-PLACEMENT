const express = require("express");
const router = express.Router();
const db = require("../models/db");
const multer = require("multer");
const path = require("path");

// ✅ ตั้งค่า multer สำหรับอัปโหลดรูปโปรไฟล์
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

/* -------------------------------
✅ GET ผู้สมัครของ employer
-------------------------------- */
router.get("/:id/applicants", async (req, res) => {
  const employerId = req.params.id;

  try {
    const [rows] = await db.promise().query(
      `SELECT 
        a.application_id, 
        a.app_status AS status,     -- ✅ เปลี่ยนชื่อฟิลด์
        a.app_date AS applied_at,
        j.j_title,
        u.applicant_id, 
        u.a_firstname, 
        u.a_lastname,
        u.a_email, 
        u.a_phone, 
        u.profile_img_url
       FROM applications a
       JOIN jobs j ON a.job_id = j.job_id
       JOIN applicants u ON a.applicant_id = u.applicant_id
       WHERE j.employer_id = ?
       ORDER BY a.app_date DESC`,
      [employerId]
    );
    res.json(rows);
  } catch (err) {
    console.error("❌ [GET /:id/applicants] Failed:", err);
    res.status(500).json({ error: "ไม่สามารถโหลดข้อมูลผู้สมัครได้" });
  }
});
router.post("/:id/upload-gallery", upload.array("gallery", 10), async (req, res) => {
  const employerId = req.params.id;
  const urls = req.files.map((file) => "/uploads/" + file.filename);

  try {
    await db.promise().query(
      "UPDATE employers SET e_gallery = ? WHERE employer_id = ?",
      [JSON.stringify(urls), employerId]
    );
    res.json({ message: "อัปโหลดแกลเลอรี่สำเร็จ", urls });
  } catch (err) {
    console.error("❌ อัปโหลดแกลเลอรี่ล้มเหลว:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปโหลดแกลเลอรี่" });
  }
});
router.post("/:id/upload-gallery", upload.array("gallery", 10), async (req, res) => {
  const employerId = req.params.id;
  const urls = req.files.map((file) => "/uploads/" + file.filename);

  try {
    // อัปเดตแกลเลอรี่แบบ JSON string
    await db.promise().query(
      "UPDATE employers SET e_gallery = ? WHERE employer_id = ?",
      [JSON.stringify(urls), employerId]
    );
    res.json({ message: "อัปโหลดแกลเลอรี่สำเร็จ", urls });
  } catch (err) {
    console.error("❌ อัปโหลดแกลเลอรี่ผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปโหลด" });
  }
});
// Node.js (Express)
router.put('/api/jobs/:id', async (req, res) => {
  const { j_amount } = req.body;
  await db.query("UPDATE jobs SET j_amount = $1 WHERE job_id = $2", [j_amount, req.params.id]);
  res.send({ message: "Updated" });
});

/* -------------------------------
✅ PUT เปลี่ยนสถานะของผู้สมัคร
-------------------------------- */
router.put("/applications/:id/status", async (req, res) => {
  const applicationId = req.params.id;
  const { status } = req.body; // ✅ รับ 'status' (ไม่ใช่ app_status)

  if (!status) {
    return res.status(400).json({ error: "Missing status in request body" });
  }

  try {
    const [result] = await db.promise().query(
      "UPDATE applications SET app_status = ? WHERE application_id = ?",
      [status, applicationId]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "ไม่พบข้อมูลการสมัคร" });
    }
    res.json({ message: "อัปเดตสถานะสำเร็จ" });
  } catch (err) {
    console.error("❌ อัปเดตสถานะผิดพลาด:", err);
    res.status(500).json({ error: err.message });
  }
});

/* -------------------------------
✅ GET โปรไฟล์พื้นฐาน
-------------------------------- */
router.get("/:id/profile", async (req, res) => {
  const employerId = req.params.id;
  try {
    const [rows] = await db.promise().query(
      `SELECT employer_id, e_username, e_firstname, e_lastname, e_email, e_phone, e_type, e_created, e_updated 
       FROM employers 
       WHERE employer_id = ?`,
      [employerId]
    );
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ โหลดโปรไฟล์ผู้ว่าจ้างล้มเหลว:", err);
    res.status(500).json({ error: "ไม่สามารถโหลดข้อมูลผู้ว่าจ้างได้" });
  }
});

/* -------------------------------
✅ PUT โปรไฟล์พื้นฐาน (ชื่อ, เบอร์ ฯลฯ)
-------------------------------- */
router.put("/:id/profile", async (req, res) => {
  const employerId = req.params.id;
  const { e_firstname, e_lastname, e_email, e_phone, e_type } = req.body;

  try {
    await db.promise().query(
      `UPDATE employers 
       SET e_firstname = ?, e_lastname = ?, e_email = ?, e_phone = ?, e_type = ?, e_updated = NOW() 
       WHERE employer_id = ?`,
      [e_firstname, e_lastname, e_email, e_phone, e_type, employerId]
    );
    res.json({ message: "อัปเดตโปรไฟล์สำเร็จ" });
  } catch (err) {
    console.error("❌ แก้ไขโปรไฟล์ล้มเหลว:", err);
    res.status(500).json({ error: "ไม่สามารถแก้ไขโปรไฟล์ได้" });
  }
});

/* -------------------------------
✅ PUT ข้อมูลบริษัท (e_description, e_address, e_map_iframe, e_website)
-------------------------------- */
router.put("/:id", async (req, res) => {
  const employerId = req.params.id;

  const {
    e_company_name,
    e_contact,
    e_position,
    e_description,
    e_address,
    e_map_iframe,
    e_website,
    e_type // ✅ อย่าลืมเพิ่มตรงนี้ด้วย
  } = req.body;

  try {
    await db.promise().query(
      `UPDATE employers
       SET 
         e_company_name = ?, 
         e_contact = ?, 
         e_position = ?, 
         e_description = ?, 
         e_address = ?, 
         e_map_iframe = ?, 
         e_website = ?, 
         e_type = ?,              -- ✅ เพิ่มตรงนี้
         e_updated = NOW()
       WHERE employer_id = ?`,
      [
        e_company_name,
        e_contact,
        e_position,
        e_description,
        e_address,
        e_map_iframe,
        e_website,
        e_type,                  // ✅ และตรงนี้
        employerId
      ]
    );

    res.json({ message: "อัปเดตข้อมูลบริษัทสำเร็จ" });
  } catch (err) {
    console.error("❌ อัปเดตข้อมูลบริษัทล้มเหลว:", err);
    res.status(500).json({ error: "ไม่สามารถอัปเดตข้อมูลบริษัทได้" });
  }
});


/* -------------------------------
✅ POST อัปโหลดรูปโปรไฟล์
-------------------------------- */
// ✅ POST อัปโหลดรูปโปรไฟล์
router.post("/upload-profile-employer/:employer_id", upload.single("profile"), async (req, res) => {
  const employerId = req.params.employer_id;
  const profilePath = "/uploads/" + req.file.filename;

  try {
    await db.promise().query(
      "UPDATE employers SET profile_img_url = ? WHERE employer_id = ?",
      [profilePath, employerId]
    );
    res.json({ message: "อัปโหลดโปรไฟล์ผู้ว่าจ้างสำเร็จ", url: profilePath });
  } catch (err) {
    console.error("❌ อัปโหลดโปรไฟล์ผู้ว่าจ้างล้มเหลว:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปโหลด" });
  }
});

// ✅ GET ข้อมูลผู้ว่าจ้างตาม ID (แก้ที่นี่)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.promise().query("SELECT * FROM employers WHERE employer_id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "ไม่พบผู้ว่าจ้าง" });
    res.json(rows[0]);
  } catch (err) {
    console.error("❌ ดึงข้อมูลผู้ว่าจ้างล้มเหลว:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการโหลดข้อมูล" });
  }
});
// GET /api/employer/:employer_id/applicants
router.get('/employer/:employer_id/applicants', async (req, res) => {
  const { employer_id } = req.params;

  try {
    const [result] = await db.execute(`
      SELECT 
        applications.*,
        applicants.a_firstname,
        applicants.a_lastname,
        applicants.a_email,
        applicants.a_phone,
        applicants.profile_img_url,
        jobs.j_title
      FROM applications
      INNER JOIN applicants ON applications.applicant_id = applicants.applicant_id
      INNER JOIN jobs ON applications.job_id = jobs.job_id
      WHERE jobs.employer_id = ?
    `, [employer_id]);

    res.json(result);
  } catch (err) {
    console.error("❌ ดึงข้อมูลผู้สมัครล้มเหลว:", err);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
