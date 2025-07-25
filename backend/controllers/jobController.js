const db = require("../models/db");

exports.getJobById = (req, res) => {
  const jobId = req.params.id;
  const q = `
    SELECT 
      jobs.*, 
      employers.*
    FROM jobs
    JOIN employers ON jobs.employer_id = employers.employer_id
    WHERE jobs.job_id = ?
  `;

  db.query(q, [jobId], (err, results) => {
    if (err) return res.status(500).json({ message: "ไม่พบงานที่ต้องการ" });
    if (results.length === 0) return res.status(404).json({ message: "ไม่พบงานนี้" });
    res.json(results[0]);
  });
};


exports.getJobs = (req, res) => {
  const q = `
    SELECT jobs.*, employers.e_type AS employer_type
    FROM jobs
    JOIN employers ON jobs.employer_id = employers.employer_id;
  `;
  db.query(q, (err, results) => {
    if (err) return res.status(500).json({ message: "ดึงข้อมูลงานล้มเหลว" });
    res.json(results);
  });
};

exports.getJobsByEmployer = (req, res) => {
  const employerId = req.params.id;
  const q = `SELECT * FROM jobs WHERE employer_id = ? ORDER BY j_posted_at DESC`;
  db.query(q, [employerId], (err, results) => {
    if (err) return res.status(500).json({ message: "ดึงข้อมูลงานล้มเหลว" });
    res.json(results);
  });
};

exports.deleteJob = (req, res) => {
  const jobId = req.params.id;
  const q = "DELETE FROM jobs WHERE job_id = ?";
  db.query(q, [jobId], (err) => {
    if (err) return res.status(500).json({ message: "ลบงานไม่สำเร็จ" });
    res.status(200).json({ message: "ลบงานสำเร็จ" });
  });
};

exports.updateJob = (req, res) => {
  const jobId = req.params.id;
  const d = req.body;
  const q = `
    UPDATE jobs SET 
      j_title = ?, j_description = ?, j_type = ?, 
      j_salary = ?, j_amount = ?, j_worktime = ?, 
      j_location = ?, j_deliverable = ?, j_contact = ?, 
      j_qualification = ?
    WHERE job_id = ?
  `;

  db.query(q, [
    d.j_title,
    d.j_description,
    d.j_type,
    d.j_salary,
    d.j_amount,
    d.j_worktime,
    d.j_location,
    d.j_deliverable,
    d.j_contact,
    d.j_qualification,
    jobId,
  ], (err) => {
    if (err) {
      console.error("❌ แก้ไขงานล้มเหลว:", err);
      return res.status(500).json({ message: "แก้ไขงานไม่สำเร็จ" });
    }
    res.status(200).json({ message: "แก้ไขงานสำเร็จ" });
  });
};
// ใน controllers/jobController.js
exports.closeJob = (req, res) => {
  const jobId = req.params.id;
  const q = `UPDATE jobs SET j_status = 'closed' WHERE job_id = ?`;
  db.query(q, [jobId], (err) => {
    if (err) return res.status(500).json({ message: "ปิดรับสมัครไม่สำเร็จ" });
    res.status(200).json({ message: "ปิดรับสมัครสำเร็จ" });
  });
};

