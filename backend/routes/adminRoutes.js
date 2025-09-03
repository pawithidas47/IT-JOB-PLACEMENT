// server/routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../models/db");

/* ---------- LOGIN แอดมินเดิม (ถ้ามีใช้งาน) ---------- */
const adminAuthCtrl = require("../controllers/adminAuthController");
const adminCtrl = require("../controllers/adminController");
router.post("/login", adminAuthCtrl.loginAdmin);

/* ---------- ดึงผู้ใช้ทั้งหมด (applicant + employer) ---------- */
router.get("/users", async (_req, res) => {
  try {
    const [applicants] = await db.promise().query(`
      SELECT 
        applicant_id AS id,
        CONCAT(COALESCE(a_firstname,''),' ',COALESCE(a_lastname,'')) AS name,
        a_email  AS email,
        a_phone  AS phone,
        a_status AS status,
        'applicant' AS role
      FROM applicants
    `);

    const [employers] = await db.promise().query(`
      SELECT 
        employer_id AS id,
        COALESCE(e_company_name,'') AS name,
        e_email  AS email,
        e_phone  AS phone,
        e_status AS status,
        'employer' AS role
      FROM employers
    `);

    res.json([...applicants, ...employers]);
  } catch (err) {
    console.error("❌ โหลด users ไม่สำเร็จ:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการโหลดผู้ใช้" });
  }
});

/* ---------- เพิ่มผู้ใช้ใหม่ (เฉพาะ applicant / employer) ---------- */
router.post("/users", async (req, res) => {
  try {
    const { name, email, phone, role, status, password } = req.body;
    if (!name || !email || !role || !status || !password) {
      return res.status(400).send("กรอกข้อมูลให้ครบ");
    }

    if (role === "applicant") {
      const [first, ...rest] = String(name).trim().split(" ");
      const last = rest.join(" ");
      const [ins] = await db.promise().execute(
        `INSERT INTO applicants
         (a_firstname, a_lastname, a_email, a_phone, a_status, a_created, a_updated, a_password)
         VALUES (?,?,?,?,?,NOW(),NOW(),?)`,
        [first || "", last || "", email, phone || null, status, password] // *ถ้าจะ hash ใช้ bcrypt ที่ฝั่งนี้
      );
      return res.status(201).json({
        id: ins.insertId, name, email, phone, role: "applicant", status,
      });
    }

    if (role === "employer") {
      const [ins] = await db.promise().execute(
        `INSERT INTO employers
         (e_company_name, e_email, e_phone, e_status, e_created, e_updated, e_password)
         VALUES (?,?,?,?,NOW(),NOW(),?)`,
        [name, email, phone || null, status, password] // *ถ้าจะ hash ใช้ bcrypt ที่ฝั่งนี้
      );
      return res.status(201).json({
        id: ins.insertId, name, email, phone, role: "employer", status,
      });
    }

    return res.status(400).send("role ไม่รองรับ");
  } catch (e) {
    console.error(e);
    return res.status(500).send("เพิ่มผู้ใช้ไม่สำเร็จ");
  }
});

/* ---------- แก้ไขผู้ใช้ ---------- */
router.put("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phone, role, status } = req.body;

    if (!name || !email || !role || !status) {
      return res.status(400).send("กรอกข้อมูลให้ครบ");
    }

    let result;

    if (role === "applicant") {
      const [first, ...rest] = String(name).trim().split(" ");
      const last = rest.join(" ");
      [result] = await db.promise().execute(
        `UPDATE applicants 
           SET a_firstname=?, a_lastname=?, a_email=?, a_phone=?, a_status=?, a_updated=NOW()
         WHERE applicant_id=?`,
        [first || "", last || "", email, phone || null, status, id]
      );
    } else if (role === "employer") {
      [result] = await db.promise().execute(
        `UPDATE employers 
           SET e_company_name=?, e_email=?, e_phone=?, e_status=?, e_updated=NOW()
         WHERE employer_id=?`,
        [name, email, phone || null, status, id]
      );
    } else {
      return res.status(400).send("role ไม่ถูกต้อง");
    }

    if (result.affectedRows === 0) return res.status(404).send("ไม่พบผู้ใช้");
    return res.status(200).json({ id: Number(id), name, email, phone, role, status });
  } catch (err) {
    console.error("❌ admin PUT /users/:id failed:", err);
    return res.status(500).send("แก้ไขไม่สำเร็จ");
  }
});

/* ---------- เปลี่ยนสถานะ (ban/unban) ---------- */
router.put("/users/:id/status", async (req, res) => {
  const { status, role } = req.body;
  const { id } = req.params;

  try {
    if (role === "applicant") {
      await db.promise().execute(
        `UPDATE applicants SET a_status=?, a_updated=NOW() WHERE applicant_id=?`,
        [status, id]
      );
    } else if (role === "employer") {
      await db.promise().execute(
        `UPDATE employers SET e_status=?, e_updated=NOW() WHERE employer_id=?`,
        [status, id]
      );
    } else {
      return res.status(400).json({ message: "role ไม่ถูกต้อง" });
    }
    res.json({ message: "เปลี่ยนสถานะสำเร็จ" });
  } catch (err) {
    console.error("❌ เปลี่ยนสถานะล้มเหลว:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

/* ---------- ลบผู้ใช้ ---------- */
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.promise().execute(`DELETE FROM applicants WHERE applicant_id=?`, [id]);
    await db.promise().execute(`DELETE FROM employers  WHERE employer_id=?`, [id]);
    res.json({ message: "ลบผู้ใช้สำเร็จ" });
  } catch (err) {
    console.error("❌ ลบผู้ใช้ล้มเหลว:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบผู้ใช้" });
  }
});

/* ---------- งานทั้งหมด (ของเดิม) ---------- */
router.get("/jobs", adminCtrl.getAllJobs);

module.exports = router;
