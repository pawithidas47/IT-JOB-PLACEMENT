const db = require("../models/db");

// ✅ POST /api/jobs - เพิ่มงานใหม่
exports.postJob = (req, res) => {
  const d = req.body;
  const q = `
    INSERT INTO jobs (
      employer_id, j_title, j_description, j_type, 
      j_salary, j_posted_at, j_appdeadline, j_status
    ) VALUES (?, ?, ?, ?, ?, NOW(), ?, 'open')`;

  db.query(
    q,
    [
      d.employer_id,
      d.j_title,
      d.j_description,
      d.j_type,
      d.j_salary,
      d.j_appdeadline
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Post Job Error:", err.sqlMessage || err);
        return res.status(500).json({ message: "เพิ่มงานไม่สำเร็จ" });
      }
      res.status(200).json({ message: "เพิ่มงานสำเร็จ", job_id: result.insertId });
    }
  );
};
// ✅ GET /api/jobs/employer/:id - ดึงงานของผู้ว่าจ้าง
exports.getJobsByEmployer = (req, res) => {
  const employerId = req.params.id;
  const q = `SELECT * FROM jobs WHERE employer_id = ? ORDER BY j_posted_at DESC`;

  db.query(q, [employerId], (err, results) => {
    if (err) {
      console.error("❌ Get Jobs Error:", err.sqlMessage || err);
      return res.status(500).json({ message: "ดึงข้อมูลงานล้มเหลว" });
    }
    res.json(results);
  });
};

exports.deleteJob = (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM jobs WHERE job_id = ?", [id], (err) => {
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
      j_salary = ?, j_appdeadline = ? 
    WHERE job_id = ?
  `;

  db.query(
    q,
    [
      d.j_title,
      d.j_description,
      d.j_type,
      d.j_salary,
      d.j_appdeadline,
      jobId,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Update Job Error:", err.sqlMessage || err);
        return res.status(500).json({ message: "แก้ไขงานไม่สำเร็จ" });
      }
      res.status(200).json({ message: "แก้ไขงานสำเร็จ" });
    }
  );
};

// ดึงงานตาม ID
exports.getJobById = (req, res) => {
  const jobId = req.params.id;
  const q = "SELECT * FROM jobs WHERE job_id = ?";
  db.query(q, [jobId], (err, results) => {
    if (err) {
      console.error("❌ Get Job Error:", err);
      return res.status(500).json({ message: "ไม่พบงานที่ต้องการ" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "ไม่พบงานนี้" });
    }
    res.json(results[0]);
  });
};

// อัพเดตงานตาม ID
exports.updateJob = (req, res) => {
  const jobId = req.params.id;
  const d = req.body;
  const q = `
    UPDATE jobs SET 
      j_title = ?, j_description = ?, j_type = ?, 
      j_salary = ?, j_appdeadline = ? 
    WHERE job_id = ?
  `;

  db.query(
    q,
    [
      d.j_title,
      d.j_description,
      d.j_type,
      d.j_salary,
      d.j_appdeadline,
      jobId,
    ],
    (err, result) => {
      if (err) {
        console.error("❌ Update Job Error:", err.sqlMessage || err);
        return res.status(500).json({ message: "แก้ไขงานไม่สำเร็จ" });
      }
      res.status(200).json({ message: "แก้ไขงานสำเร็จ" });
    }
  );
};

// ลบงานตาม ID
exports.deleteJob = (req, res) => {
  const jobId = req.params.id;
  const q = "DELETE FROM jobs WHERE job_id = ?";

  db.query(q, [jobId], (err, result) => {
    if (err) {
      console.error("❌ Delete Job Error:", err.sqlMessage || err);
      return res.status(500).json({ message: "ลบงานไม่สำเร็จ" });
    }
    res.status(200).json({ message: "ลบงานสำเร็จ" });
  });
};
