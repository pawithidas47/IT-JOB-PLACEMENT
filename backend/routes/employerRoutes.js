const express = require("express");
const router = express.Router();
const db = require("../models/db");
const multer = require("multer");
const path = require("path");

// ✅ ตั้งค่าการอัปโหลดรูปโปรไฟล์ (ใช้ multer)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // โฟลเดอร์เป้าหมาย
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9) + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ GET: ผู้สมัครที่สมัครงานของ employer ID นั้น
router.get("/:id/applicants", async (req, res) => {
  const employerId = req.params.id;

  try {
    const [rows] = await db.promise().query(
      `SELECT a.application_id, a.app_status AS status, a.app_date AS applied_at,
              j.j_title,
              u.applicant_id, u.a_firstname, u.a_lastname,
              u.a_email, u.a_phone, u.profile_img_url
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

// ✅ PUT: เปลี่ยนสถานะของผู้สมัคร
router.put("/applications/:id/status", async (req, res) => {
  // เช็คว่า body ส่ง status มาหรือไม่
  if (!req.body || !req.body.status) {
    return res.status(400).json({ error: "Missing status in request body" });
  }

  const applicationId = req.params.id;
  const { status } = req.body;

  try {
    await db.promise().query(
      "UPDATE applications SET app_status = ? WHERE application_id = ?",
      [status, applicationId]
    );
    res.json({ message: "อัปเดตสถานะสำเร็จ" });
  } catch (err) {
    console.error("❌ อัปเดตสถานะผิดพลาด:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ GET: โปรไฟล์ผู้ว่าจ้าง
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

// ✅ PUT: แก้ไขโปรไฟล์ผู้ว่าจ้าง
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

// ✅ POST: อัปโหลดรูปโปรไฟล์ของผู้ว่าจ้าง
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

module.exports = router;
