const express = require("express");
const router = express.Router();
const db = require("../models/db");

const adminAuthCtrl = require("../controllers/adminAuthController");
const adminCtrl = require("../controllers/adminController");
router.put('/api/admin/users/:id', /*authAdmin,*/ async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phone, role, status } = req.body;

    // ตรวจค่าจำเป็น
    if (!name || !email || !role || !status) {
      return res.status(400).send('กรอกข้อมูลให้ครบ');
    }

    // ตัวอย่างใช้ mysql2/promise
    const [result] = await req.db.execute(
      `UPDATE users 
       SET name=?, email=?, phone=?, role=?, status=?, updated_at=NOW()
       WHERE id=?`,
      [name, email, phone || null, role, status, id]
    );

    if (result.affectedRows === 0) return res.status(404).send('ไม่พบผู้ใช้');

    const [rows] = await req.db.execute(
      `SELECT id, name, email, phone, role, status, created_at, updated_at
       FROM users WHERE id=?`, [id]
    );
    return res.status(200).json(rows[0]); // ส่ง JSON กลับให้ฝั่งหน้าเว็บอัปเดตแถว
  } catch (e) {
    console.error(e);
    return res.status(500).send('แก้ไขไม่สำเร็จ');
  }
});

// สร้างผู้ใช้ใหม่
router.post('/api/admin/users', /*authAdmin,*/ async (req, res) => {
  try {
    const { name, email, phone, role, status, password } = req.body;
    if (!name || !email || !role || !status || !password) {
      return res.status(400).send('กรอกข้อมูลให้ครบ');
    }

    // ตรวจอีเมลซ้ำ (ตัวอย่าง)
    const [dup] = await req.db.execute(`SELECT id FROM users WHERE email=?`, [email]);
    if (dup.length) return res.status(409).send('อีเมลนี้ถูกใช้แล้ว');

    const bcrypt = require('bcryptjs');
    const hash = await bcrypt.hash(password, 10);

    const [ins] = await req.db.execute(
      `INSERT INTO users (name, email, phone, role, status, password_hash, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, email, phone || null, role, status, hash]
    );

    const [rows] = await req.db.execute(
      `SELECT id, name, email, phone, role, status, created_at, updated_at
       FROM users WHERE id=?`, [ins.insertId]
    );
    return res.status(201).json(rows[0]);
  } catch (e) {
    console.error(e);
    return res.status(500).send('เพิ่มผู้ใช้ไม่สำเร็จ');
  }
});
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
