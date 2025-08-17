const express = require("express");
const router = express.Router();
const db = require("../models/db");
const connection = db.promise();
const appCtrl = require("../controllers/applicationController");

/** ลบใบสมัคร */
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

/** สมัครงาน */
router.post("/", appCtrl.apply);

/** ยกเลิกใบสมัคร -> เปลี่ยนเป็น cancelled */
router.put("/:id/cancel", (req, res) => {
  const appId = req.params.id;
  const sql = `UPDATE applications SET app_status = 'cancelled' WHERE application_id = ?`;

  db.query(sql, [appId], (err) => {
    if (err) {
      console.error("❌ ยกเลิกการสมัครไม่สำเร็จ:", err);
      return res.status(500).json({ message: "ยกเลิกการสมัครไม่สำเร็จ" });
    }
    res.json({ message: "✅ ยกเลิกการสมัครเรียบร้อยแล้ว" });
  });
});

/** ตรวจสอบสถานะ (query หรือ path-param) */
router.get("/check", appCtrl.checkApplied);
router.get("/check-status/:job_id/:applicant_id", (req, res) => {
  req.query = { job_id: req.params.job_id, applicant_id: req.params.applicant_id };
  appCtrl.checkApplied(req, res);
});

/** ดึงรายการใบสมัครทั้งหมดของผู้สมัคร */
router.get("/:id", async (req, res) => {
  const applicant_id = req.params.id;

  const sql = `
    SELECT 
      a.job_id,
      a.application_id,
      a.app_date     AS applied_at,
      a.app_status   AS status,
      a.app_portfolio_url,

      j.j_title      AS job_name,
      j.j_type       AS job_type,
      j.j_amount     AS job_amount,   -- จำนวนที่รับ
      j.j_salary     AS job_wage,     -- ค่าจ้าง (บาท)

      e.e_company_name AS employer_name
    FROM applications a
    JOIN jobs j ON a.job_id = j.job_id
    JOIN employers e ON j.employer_id = e.employer_id
    WHERE a.applicant_id = ?
    ORDER BY a.app_date DESC
  `;

  try {
    const [rows] = await connection.query(sql, [applicant_id]);
    res.json(rows);
  } catch (err) {
    console.error("❌ Error fetching applications:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
