const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const db = require("../models/db");
const jobCtrl = require("../controllers/jobController");

// ✅ POST: เพิ่มงานใหม่ (อัปโหลดไฟล์รองรับ formData)
router.post('/', upload.none(), async (req, res) => {
  try {
   const {
  employer_id,
  j_title,
  j_description,
  j_type,
  j_salary,
  j_amount,
  j_duration,
  j_worktime,
  j_location,
  j_welfare,
  j_deliverable,
  j_contact,
  j_appdeadline,
  j_qualification // ✅ เพิ่มตรงนี้
} = req.body;

const sql = `
  INSERT INTO jobs (
    employer_id, j_title, j_description, j_type, j_salary, j_amount,
    j_duration, j_worktime, j_location, j_welfare, j_deliverable,
    j_contact, j_appdeadline, j_qualification  -- ✅ เพิ่มตรงนี้
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const values = [
  employer_id,
  j_title,
  j_description,
  j_type,
  j_salary,
  j_amount,
  j_duration,
  j_worktime,
  j_location,
  j_welfare,
  j_deliverable,
  j_contact,
  j_appdeadline,
  j_qualification // ✅ เพิ่มตรงนี้
];

await db.execute(sql, values);


    res.status(200).json({ message: 'โพสต์งานสำเร็จ' });
  } catch (err) {
    console.error('❌ เพิ่มงานล้มเหลว:', err);
    res.status(500).json({ error: 'โพสต์ไม่สำเร็จ', detail: err.message });
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
