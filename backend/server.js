const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const db = require("./models/db");
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


// ✅ Start server
app.listen(3001, () => {
  console.log("🚀 Server running at http://localhost:3001");
});
