const express = require("express");
const router = express.Router();
const appCtrl = require("../controllers/applicationController");
const db = require("../models/db");
// ✅ ดึงรายการสมัครงานทั้งหมดของผู้สมัครที่ล็อกอินอยู่
router.get("/:applicant_id", (req, res) => {
  const applicantId = req.params.applicant_id;

  const sql = `
   SELECT 
    applications.application_id AS application_id,
    jobs.j_title AS job_name,
    jobs.j_type AS job_type,
    jobs.j_salary AS job_wage,
    applications.app_date AS applied_at,               
    applications.app_status AS status
  FROM applications
  JOIN jobs ON applications.job_id = jobs.job_id
  WHERE applications.applicant_id = ?
  ORDER BY applications.app_date DESC
`;
router.put("/:id/cancel", (req, res) => {
  const appId = req.params.id;

  const sql = `
    UPDATE applications
    SET app_status = 'cancelled'
    WHERE application_id = ?
  `;

  db.query(sql, [appId], (err, result) => {
    if (err) {
      console.error("❌ ยกเลิกการสมัครไม่สำเร็จ:", err);
      return res.status(500).json({ message: "ยกเลิกการสมัครไม่สำเร็จ" });
    }

    res.json({ message: "✅ ยกเลิกการสมัครเรียบร้อยแล้ว" });
  });
});


  db.query(sql, [applicantId], (err, results) => {
    if (err) {
      console.error("❌ ดึงข้อมูลการสมัครล้มเหลว:", err);
      return res.status(500).json({ message: "ดึงข้อมูลไม่สำเร็จ" });
    }

    res.json(results);
  });
});

router.post("/", appCtrl.apply);
router.get("/check", appCtrl.checkApplied); // ✅ เส้นทางที่ขาดไป


module.exports = router;
