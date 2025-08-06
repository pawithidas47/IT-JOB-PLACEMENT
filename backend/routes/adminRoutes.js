const express = require("express");
const router = express.Router();
const db = require("../models/db");

const adminAuthCtrl = require("../controllers/adminAuthController");
const adminCtrl = require("../controllers/adminController");

// ✅ Login
router.post("/login", adminAuthCtrl.loginAdmin);

// ✅ ดึงผู้ใช้ทั้งหมด (รวม applicant + employer)
router.get("/users", async (req, res) => {
  try {
    const [applicants] = await db.promise().query(`
      SELECT 
        applicant_id AS id,
        CONCAT(a_firstname, ' ', a_lastname) AS name,
        a_email AS email,
        a_phone AS phone,
        a_status AS status,
        'applicant' AS role
      FROM applicants
    `);

    const [employers] = await db.promise().query(`
      SELECT 
        employer_id AS id,
        e_company_name AS name,
        e_email AS email,
        e_phone AS phone,
        e_status AS status,
        'employer' AS role
      FROM employers
    `);

    const users = [...applicants, ...employers];
    res.json(users);
  } catch (err) {
    console.error("❌ โหลด users ไม่สำเร็จ:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการโหลดผู้ใช้" });
  }
});

// ✅ ดึงงาน/ไฟล์ (ตามเดิม)
router.get("/jobs", adminCtrl.getAllJobs);
router.get("/uploads", adminCtrl.getAllUploads);

// ✅ แก้สถานะผู้ใช้ (แบน / ยกเลิกแบน)
router.put('/users/:id/status', async (req, res) => {
  const { status, role } = req.body;
  const { id } = req.params;

  let table, key;
  if (role === "applicant") {
    table = "applicants";
    key = "applicant_id";
  } else if (role === "employer") {
    table = "employers";
    key = "employer_id";
  } else {
    return res.status(400).json({ message: "role ไม่ถูกต้อง" });
  }

  try {
    await db.promise().execute(
      `UPDATE ${table} SET ${table === "applicants" ? "a_status" : "e_status"} = ? WHERE ${key} = ?`,
      [status, id]
    );
    res.json({ message: "เปลี่ยนสถานะสำเร็จ" });
  } catch (err) {
    console.error("❌ เปลี่ยนสถานะล้มเหลว:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

// ✅ ลบผู้ใช้ (ลบทั้งจาก 2 ตาราง)
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.promise().query(`DELETE FROM applicants WHERE applicant_id = ?`, [id]);
    await db.promise().query(`DELETE FROM employers WHERE employer_id = ?`, [id]);
    res.json({ message: "ลบผู้ใช้สำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบผู้ใช้" });
  }
});

module.exports = router;
