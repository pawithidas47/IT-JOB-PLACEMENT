const express = require("express");
const router = express.Router();
const appCtrl = require("../controllers/applicationController");
const db = require("../models/db");

router.delete("/:id", (req, res) => {
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
    res.json({ message: "ลบเรียบร้อยแล้ว" });
  });
});
// ✅ ตรวจสอบสถานะผ่าน query param (เช่น /check?job_id=15&applicant_id=1)
router.get("/check", appCtrl.checkApplied);

// ✅ สมัครงาน
router.post("/", appCtrl.apply);

// ✅ ยกเลิกการสมัคร
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

// ✅ ตรวจสอบสถานะจาก path param (เช่น /check-status/15/1)
router.get("/check-status/:job_id/:applicant_id", (req, res) => {
  req.query = {
    job_id: req.params.job_id,
    applicant_id: req.params.applicant_id,
  };
  appCtrl.checkApplied(req, res);
});

// ✅ ดึงรายการสมัครงานทั้งหมดของผู้สมัคร
router.get("/:applicant_id", (req, res) => {
  const applicantId = req.params.applicant_id;

  const sql = `
    SELECT 
      applications.application_id AS application_id,
      jobs.j_title AS job_name,
      jobs.j_type AS job_type,
      jobs.j_salary AS job_wage,
      CONCAT(employers.e_firstname, ' ', employers.e_lastname) AS employer_name,
      applications.app_date AS applied_at,
      applications.app_status AS status
    FROM applications
    JOIN jobs ON applications.job_id = jobs.job_id
    JOIN employers ON jobs.employer_id = employers.employer_id
    WHERE applications.applicant_id = ?
    ORDER BY applications.app_date DESC
  `;

  db.query(sql, [applicantId], (err, results) => {
    if (err) {
      console.error("❌ ดึงข้อมูลการสมัครล้มเหลว:", err);
      return res.status(500).json({ message: "ดึงข้อมูลไม่สำเร็จ" });
    }

    res.json(results);
  });
});

module.exports = router;
