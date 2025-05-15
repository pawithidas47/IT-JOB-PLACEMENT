const db = require("../models/db");
exports.apply = (req, res) => {
  const { job_id, applicant_id, app_portfolio_url } = req.body;
  const sql = `INSERT INTO applications (job_id, applicant_id, app_date, app_status, app_portfolio_url) VALUES (?, ?, NOW(), 'pending', ?)`;
  db.query(sql, [job_id, applicant_id, app_portfolio_url], (err) => {
    if (err) return res.status(500).json({ message: "ไม่สามารถสมัครงานได้" });
    res.status(200).json({ message: "สมัครงานสำเร็จ" });
  });
};