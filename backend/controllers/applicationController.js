const db = require("../models/db");

// ✅ ฟังก์ชันสมัครงาน พร้อมตรวจสอบก่อน insert
exports.apply = (req, res) => {
  const { job_id, applicant_id, app_portfolio_url } = req.body;

  if (!job_id || !applicant_id) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  }

  // 1. ตรวจสอบว่าผู้ใช้เคยสมัครงานนี้อยู่แล้ว (แต่ยังไม่ยกเลิก/ไม่ถูกปฏิเสธ)
  const checkSql = `
    SELECT * FROM applications
    WHERE job_id = ? AND applicant_id = ?
    AND app_status NOT IN ('cancelled', 'rejected')
    LIMIT 1
  `;

  db.query(checkSql, [job_id, applicant_id], (err, results) => {
    if (err) {
      console.error("❌ ตรวจสอบการสมัครล้มเหลว:", err);
      return res.status(500).json({ message: "ไม่สามารถตรวจสอบการสมัครได้" });
    }

    if (results.length > 0) {
      // เคยสมัครแล้ว และยังไม่ถูกยกเลิกหรือปฏิเสธ
      return res.status(409).json({ message: "คุณได้สมัครงานนี้ไปแล้ว" });
    }

    // 2. สมัครงานใหม่
    const insertSql = `
      INSERT INTO applications (job_id, applicant_id, app_date, app_status, app_portfolio_url)
      VALUES (?, ?, NOW(), 'pending', ?)
    `;

    db.query(insertSql, [job_id, applicant_id, app_portfolio_url], (err2) => {
      if (err2) {
        console.error('❌ สมัครไม่สำเร็จ:', err2);
        return res.status(500).json({ message: 'ไม่สามารถสมัครงานได้' });
      }

      res.status(200).json({ message: 'สมัครงานสำเร็จ' });
    });
  });
};

// ✅ ฟังก์ชันเช็คว่าเคยสมัครแล้วหรือยัง (สำหรับใช้ใน frontend ก่อนแสดงปุ่ม)
exports.checkApplied = (req, res) => {
  const { job_id, applicant_id } = req.query;

  const sql = `
    SELECT * FROM applications
    WHERE job_id = ? AND applicant_id = ?
    AND app_status NOT IN ('cancelled', 'rejected')
    LIMIT 1
  `;

  db.query(sql, [job_id, applicant_id], (err, results) => {
    if (err) {
      console.error("❌ ตรวจสอบการสมัครล้มเหลว:", err);
      return res.status(500).json({ message: "ไม่สามารถตรวจสอบการสมัครได้" });
    }

    res.json({ applied: results.length > 0 });
  });
};
