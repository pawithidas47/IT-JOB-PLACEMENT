const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const jobCtrl = require("../controllers/jobController");

// ✅ โพสต์งานใหม่
router.post("/", upload.none(), async (req, res) => {
  try {
    const {
      employer_id,
      j_title,
      j_description,
      j_type,
      j_salary,
      j_amount,
      j_worktime,
      j_deliverable,
      j_qualification
    } = req.body;

    const db = require("../models/db");

    const sql = `
      INSERT INTO jobs (
        employer_id, j_title, j_description, j_type, j_salary,
        j_amount, j_worktime, j_deliverable, j_qualification
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const vals = [
      employer_id ?? null,
      j_title ?? null,
      j_description ?? null,
      j_type ?? null,
      (typeof j_salary === "undefined" ? null : j_salary),
      j_amount ?? null,
      j_worktime ?? null,
      (typeof j_deliverable === "undefined" ? null : j_deliverable),
      j_qualification ?? null
    ];

    await db.promise().execute(sql, vals);
    res.status(200).json({ message: "โพสต์งานสำเร็จ" });
  } catch (err) {
    console.error("❌ เพิ่มงานล้มเหลว:", err);
    res.status(500).json({ error: "โพสต์ไม่สำเร็จ", detail: err.message });
  }
});

// ✅ ปิดงาน
router.put("/:id/close", async (req, res) => {
  const db = require("../models/db");
  const jobId = req.params.id;
  try {
    await db.promise().execute(
      "UPDATE jobs SET j_status = 'closed' WHERE job_id = ?",
      [jobId]
    );
    res.status(200).json({ message: "ปิดรับสมัครสำเร็จ" });
  } catch (err) {
    console.error("❌ ปิดรับสมัครล้มเหลว:", err);
    res.status(500).json({ message: "ปิดรับสมัครไม่สำเร็จ" });
  }
});

// ✅ routes อื่น
router.get("/", jobCtrl.getJobs);
router.get("/employer/:id", jobCtrl.getJobsByEmployer);
router.get("/:id", jobCtrl.getJobById);
router.put("/:id", jobCtrl.updateJob);
router.delete("/:id", jobCtrl.deleteJob);

// ⚠️ หมายเหตุ: อย่าประกาศ route put("/:id/close") ซ้ำซ้อนอีกครั้งด้านล่าง
module.exports = router;
