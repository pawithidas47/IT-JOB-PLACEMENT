const express = require("express");
const router = express.Router();
const db = require("../models/db");

// ✅ GET: ผู้สมัครที่สมัครงานของ employer ID นั้น
router.get("/:id/applicants", async (req, res) => {
  const employerId = req.params.id;

  try {
    const [rows] = await db.promise().query(
      `SELECT a.application_id, a.app_status AS status, a.app_date AS applied_at,
              j.j_title,
              u.applicant_id, u.a_firstname, u.a_lastname,
              u.a_email, u.a_phone, u.profile_img_url
       FROM applications a
       JOIN jobs j ON a.job_id = j.job_id
       JOIN applicants u ON a.applicant_id = u.applicant_id
       WHERE j.employer_id = ?
       ORDER BY a.app_date DESC`,
      [employerId]
    );

    res.json(rows);
  } catch (err) {
    console.error("❌ [GET /:id/applicants] Failed:", err);
    res.status(500).json({ error: "ไม่สามารถโหลดข้อมูลผู้สมัครได้" });
  }
});

// ✅ PUT: เปลี่ยนสถานะของผู้สมัคร
router.put("/applications/:id/status", async (req, res) => {
  // เช็คว่า body ส่ง status มาหรือไม่
  if (!req.body || !req.body.status) {
    return res.status(400).json({ error: "Missing status in request body" });
  }

  const applicationId = req.params.id;
  const { status } = req.body;

  try {
    await db.promise().query(
      "UPDATE applications SET app_status = ? WHERE application_id = ?",
      [status, applicationId]
    );
    res.json({ message: "อัปเดตสถานะสำเร็จ" });
  } catch (err) {
    console.error("❌ อัปเดตสถานะผิดพลาด:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
