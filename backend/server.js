const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const db = require("./models/db");
const connection = db.promise(); // ✅ เพิ่มบรรทัดนี้

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const applicantRoutes = require("./routes/applicantRoutes");
const employerRoutes = require("./routes/employerRoutes");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads")); // ให้ frontend เรียกดูรูปได้ผ่าน URL

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/applicant", applicantRoutes);
app.use("/api/employers", employerRoutes);

// ✅ DELETE กรณีจำเป็น (ลบการสมัคร)
app.delete("/api/applications/:id", (req, res) => {
  const applicationId = req.params.id;
  const sql = "DELETE FROM applications WHERE application_id = ?";
  db.query(sql, [applicationId], (err, result) => {
    if (err) {
      console.error("❌ ลบข้อมูลไม่สำเร็จ:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบ" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลการสมัคร" });
    }
    return res.json({ message: "ลบเรียบร้อยแล้ว" });
  });
});

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

// ✅ POST: อัปโหลดรูปโปรไฟล์ผู้สมัคร
app.post("/api/upload-profile/:applicant_id", upload.single("profile"), async (req, res) => {
  const applicantId = req.params.applicant_id;
  const profilePath = "/uploads/" + req.file.filename;

  try {
    await db.promise().query(
      "UPDATE applicants SET profile_img_url = ? WHERE applicant_id = ?",
      [profilePath, applicantId]
    );
    res.json({ message: "อัปโหลดรูปโปรไฟล์สำเร็จ", url: profilePath });
  } catch (err) {
    console.error("❌ อัปโหลดผิดพลาด:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปโหลด" });
  }
});
// ✅ POST: อัปโหลดรูปโปรไฟล์ของผู้ว่าจ้าง
app.post("/api/upload-profile-employer/:employer_id", upload.single("profile"), async (req, res) => {
  const employerId = req.params.employer_id;
  const profilePath = "/uploads/" + req.file.filename;

  try {
    await db.promise().query(
      "UPDATE employers SET profile_img_url = ? WHERE employer_id = ?",
      [profilePath, employerId]
    );
    res.json({ message: "อัปโหลดรูปโปรไฟล์ผู้ว่าจ้างสำเร็จ", url: profilePath });
  } catch (err) {
    console.error("❌ อัปโหลดโปรไฟล์ผู้ว่าจ้างล้มเหลว:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการอัปโหลด" });
  }
});
app.get('/api/applicants/employer/:employerId', async (req, res) => {
  const employerId = req.params.employerId;
  // ตรวจสอบว่า employerId ถูกต้อง และดึงข้อมูลจากฐานข้อมูล
  const applicants = await getApplicantsForEmployer(employerId);
  if (!applicants) {
    return res.status(404).json({ error: "ไม่พบข้อมูลผู้สมัครงาน" });
  }
  res.json(applicants);
});
app.put('/api/employers/:id', async (req, res) => {
  const employerId = req.params.id;

  const {
    e_company_name,
    e_phone,
    e_contact,
    e_position,
    e_website,
    e_description,
    e_type,
    e_address,
    e_map_iframe
  } = req.body;

  const sql = `
    UPDATE employers SET 
      e_company_name = ?, 
      e_phone = ?, 
      e_contact = ?, 
      e_position = ?, 
      e_website = ?, 
      e_description = ?, 
      e_type = ?, 
      e_address = ?, 
      e_map_iframe = ? 
    WHERE employer_id = ?
  `;

  try {
    await connection.execute(sql, [
      e_company_name,
      e_phone,
      e_contact,
      e_position,
      e_website,
      e_description,
      e_type,
      e_address,
      e_map_iframe,
      employerId
    ]);

    res.sendStatus(200);
  } catch (err) {
    console.error("❌ Error updating employer:", err);
    res.status(500).send("เกิดข้อผิดพลาดในการอัปเดตข้อมูล");
  }
});
app.get('/api/employer/:employer_id/applicants', async (req, res) => {
  const employer_id = req.params.employer_id;

  try {
    const [result] = await connection.execute(`
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
    res.status(500).json({ message: "เกิดข้อผิดพลาดในเซิร์ฟเวอร์" });
  }
});



// ✅ Start server
app.listen(3001, () => {
  console.log("🚀 Server running at http://localhost:3001");
});
