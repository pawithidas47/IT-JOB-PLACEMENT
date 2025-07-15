const express = require("express");
const router = express.Router();
const appCtrl = require("../controllers/applicationController");
const db = require("../models/db");
const connection = db.promise();
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
router.get("/:id", async (req, res) => {
  const applicant_id = req.params.id;

const sql = `
  SELECT 
    a.application_id,
    a.app_date AS applied_at,
    a.app_status AS status,
    a.app_portfolio_url,
    j.j_title AS job_name,
    j.j_type AS job_type,
    j.j_amount AS job_wage,
    e.e_company_name AS employer_name
  FROM applications a
  JOIN jobs j ON a.job_id = j.job_id
  JOIN employers e ON j.employer_id = e.employer_id
  WHERE a.applicant_id = ?
  ORDER BY a.app_date DESC
`;



  try {
    const [rows] = await connection.query(sql, [applicant_id]); // ✅ ใช้ promise
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching applications:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;
