const db = require("../models/db");

exports.apply = (req, res) => {
  const { job_id, applicant_id, app_portfolio_url } = req.body;
  if (!job_id || !applicant_id) {
    return res.status(400).json({ message: 'ข้อมูลไม่ครบถ้วน' });
  }
  const sql = `INSERT INTO applications (job_id, applicant_id, app_date, app_status, app_portfolio_url)
               VALUES (?, ?, NOW(), 'pending', ?)`;
  db.query(sql, [job_id, applicant_id, app_portfolio_url], (err) => {
    if (err) {
      console.error('❌ Database insert error:', err);
      return res.status(500).json({ message: 'ไม่สามารถสมัครงานได้' });
    }
    res.status(200).json({ message: 'สมัครงานสำเร็จ' });
  });
};

// ✅ เพิ่มฟังก์ชันนี้ไว้ด้านล่าง
exports.checkApplied = (req, res) => {
  const { job_id, applicant_id } = req.query;
  const sql = `SELECT * FROM applications WHERE job_id = ? AND applicant_id = ?`;
  db.query(sql, [job_id, applicant_id], (err, results) => {
    if (err) {
      console.error('❌ DB check error:', err);
      return res.status(500).json({ message: 'ตรวจสอบไม่สำเร็จ' });
    }
    res.json({ applied: results.length > 0 });
  });
};
