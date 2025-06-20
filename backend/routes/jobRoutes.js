const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const db = require("../models/db");
const jobCtrl = require("../controllers/jobController");

// ✅ POST: เพิ่มงานใหม่ (อัปโหลดไฟล์รองรับ formData)
router.post("/", upload.any(), async (req, res) => {
  const {
    j_title,
    j_description,
    j_type,
    j_salary,
    j_appdeadline,
    employer_id
  } = req.body;

  try {
    await db.promise().query(
      `INSERT INTO jobs (j_title, j_description, j_type, j_salary, j_appdeadline, employer_id)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [j_title, j_description, j_type, j_salary, j_appdeadline, employer_id]
    );
    res.json({ message: "โพสต์สำเร็จ" });
  } catch (err) {
    console.error("❌ เพิ่มงานล้มเหลว:", err);
    res.status(500).json({ error: "ไม่สามารถเพิ่มงานได้" });
  }
});

// ✅ GET: ดึงข้อมูลงานทั้งหมด
router.get("/", jobCtrl.getJobs);

// ✅ GET: ดึงงานตามผู้ว่าจ้าง
router.get("/employer/:id", jobCtrl.getJobsByEmployer);

// ✅ GET: ดึงงานตาม ID
router.get("/:id", jobCtrl.getJobById);

// ✅ PUT: แก้ไขงาน
router.put("/:id", jobCtrl.updateJob);

// ✅ DELETE: ลบงาน
router.delete("/:id", jobCtrl.deleteJob);

module.exports = router;
