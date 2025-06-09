const db = require("../models/db");

// ✅ POST /api/jobs - โพสต์งานใหม่
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
        console.error("❌ Post Job Error:", err);
        return res.status(500).json({ message: "เพิ่มงานไม่สำเร็จ" });
      }
      res.status(200).json({ message: "เพิ่มงานสำเร็จ", job_id: result.insertId });
    }
  );
};

// ✅ GET /api/jobs - ดึงข้อมูลงานทั้งหมด
exports.getJobs = (req, res) => {
  const q = `
SELECT jobs.*, employers.e_type AS employer_type
FROM jobs
JOIN employers ON jobs.employer_id = employers.employer_id;
`;

  db.query(q, (err, results) => {
    if (err) {
      console.error("❌ Get Jobs Error:", err);
      return res.status(500).json({ message: "ดึงข้อมูลงานล้มเหลว" });
    }
    console.log("✅ Jobs Response:", results); // ตรวจสอบว่ามี employer_type หรือไม่
    res.json(results); // ❗ อย่าใช้ res.json(results[0]) เด็ดขาด
  });
};




// ✅ GET /api/jobs/employer/:id - ดึงงานของผู้ว่าจ้าง
exports.getJobsByEmployer = (req, res) => {
  const employerId = req.params.id;
  const q = `SELECT * FROM jobs WHERE employer_id = ? ORDER BY j_posted_at DESC`;

  db.query(q, [employerId], (err, results) => {
    if (err) {
      console.error("❌ Get Jobs Error:", err);
      return res.status(500).json({ message: "ดึงข้อมูลงานล้มเหลว" });
    }
    res.json(results);
  });
};

// ✅ DELETE /api/jobs/:id - ลบงานตาม ID
exports.deleteJob = (req, res) => {
  const jobId = req.params.id;
  const q = "DELETE FROM jobs WHERE job_id = ?";

  db.query(q, [jobId], (err, result) => {
    if (err) {
      console.error("❌ Delete Job Error:", err);
      return res.status(500).json({ message: "ลบงานไม่สำเร็จ" });
    }
    res.status(200).json({ message: "ลบงานสำเร็จ" });
  });
};

// ✅ PUT /api/jobs/:id - อัปเดตงานตาม ID
exports.updateJob = (req, res) => {
  const jobId = req.params.id;
  const d = req.body;
  const q = `
    UPDATE jobs SET 
      j_title = ?, j_description = ?, j_type = ?, 
      j_salary = ?, j_appdeadline = ? 
    WHERE job_id = ?`;

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
        console.error("❌ Update Job Error:", err);
        return res.status(500).json({ message: "แก้ไขงานไม่สำเร็จ" });
      }
      res.status(200).json({ message: "แก้ไขงานสำเร็จ" });
    }
  );
};

// ✅ GET /api/jobs/:id - ดึงงานตาม ID
// ✅ GET /api/jobs/:id - ดึงงานตาม ID (พร้อม employer_type)
exports.getJobById = (req, res) => {
  const jobId = req.params.id;

  const q = `
    SELECT jobs.*, employers.e_type AS employer_type
    FROM jobs
    JOIN employers ON jobs.employer_id = employers.employer_id
    WHERE jobs.job_id = ?
  `;

  db.query(q, [jobId], (err, results) => {
    if (err) {
      console.error("❌ Get Job Error:", err);
      return res.status(500).json({ message: "ไม่พบงานที่ต้องการ" });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: "ไม่พบงานนี้" });
    }
    res.json(results[0]); // ✅ ส่งกลับ job + employer_type
  });
};

