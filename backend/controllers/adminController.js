
const db = require("../models/db");

// ✅ ดึงผู้ใช้ทั้งหมด (รวม applicant + employer)
exports.getAllUsers = async (req, res) => {
  try {
    const [applicants] = await db.promise().query(`
      SELECT 
        applicant_id AS id, 
        a_firstname AS name, 
        a_email AS email, 
        a_phone AS phone, 
        'applicant' AS role,
        'ใช้งาน' AS status
      FROM applicants
    `);

    const [employers] = await db.promise().query(`
      SELECT 
        employer_id AS id, 
        e_company_name AS name, 
        e_email AS email, 
        e_phone AS phone, 
        'employer' AS role,
        'ใช้งาน' AS status
      FROM employers
    `);

    const users = [...applicants, ...employers];
    res.json(users);
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" });
  }
};

// ✅ ดึงข้อมูลงานทั้งหมด
exports.getAllJobs = async (req, res) => {
  try {
    const [jobs] = await db.promise().query(`
      SELECT 
        jobs.*, 
        employers.e_company_name 
      FROM jobs
      LEFT JOIN employers ON jobs.employer_id = employers.employer_id
    `);
    res.json(jobs);
  } catch (err) {
    console.error("❌ Error fetching jobs:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงข้อมูลงาน" });
  }
};

// ✅ ดึงข้อมูลไฟล์ที่อัปโหลด
exports.getAllUploads = async (req, res) => {
  try {
    const [uploads] = await db.promise().query(`
      SELECT * FROM uploads ORDER BY uploaded_at DESC
    `);
    res.json(uploads);
  } catch (err) {
    console.error("❌ Error fetching uploads:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการดึงไฟล์อัปโหลด" });
  }
};
