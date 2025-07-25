const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const jobCtrl = require("../controllers/jobController");

// ✅ โพสต์งานใหม่ (แบบ formData)
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
      j_location,
      j_deliverable,
     
      j_qualification
    } = req.body;

    const db = require("../models/db");

    const sql = `
      INSERT INTO jobs (
        employer_id, j_title, j_description, j_type, j_salary,
        j_amount, j_worktime, j_location, j_deliverable,
        j_qualification
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await db.promise().execute(sql, [
      employer_id, j_title, j_description, j_type, j_salary,
      j_amount, j_worktime, j_location, j_deliverable,
      j_contact, j_qualification
    ]);

    res.status(200).json({ message: "โพสต์งานสำเร็จ" });
  } catch (err) {
    console.error("❌ เพิ่มงานล้มเหลว:", err);
    res.status(500).json({ error: "โพสต์ไม่สำเร็จ", detail: err.message });
  }
});
router.put("/:id/close", async (req, res) => {
  const db = require("../models/db");
  const jobId = req.params.id;
  try {
    await db.promise().execute("UPDATE jobs SET j_status = 'closed' WHERE job_id = ?", [jobId]);
    res.status(200).json({ message: "ปิดรับสมัครสำเร็จ" });
  } catch (err) {
    console.error("❌ ปิดรับสมัครล้มเหลว:", err);
    res.status(500).json({ message: "ปิดรับสมัครไม่สำเร็จ" });
  }
});


// ✅ เชื่อม controller อื่น
router.get("/", jobCtrl.getJobs);
router.get("/employer/:id", jobCtrl.getJobsByEmployer);
router.get("/:id", jobCtrl.getJobById);
router.put("/:id", jobCtrl.updateJob);
router.delete("/:id", jobCtrl.deleteJob);
// ใน routes/jobRoutes.js
router.put("/:id/close", jobCtrl.closeJob);        // ✅ OK



module.exports = router;
