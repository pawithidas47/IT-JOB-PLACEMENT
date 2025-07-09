const express = require("express");
const router = express.Router();
const db = require("../models/db");

// ✅ สมัครสมาชิกผู้สมัครงาน
router.post("/register/applicant", async (req, res) => {
  const f = req.body;

  try {
    // ✅ ตรวจสอบว่าอีเมลซ้ำ
    const [exist] = await db.promise().query(
      "SELECT * FROM applicants WHERE a_email = ?",
      [f.a_email]
    );
    if (exist.length > 0) {
      return res.status(400).json({ message: "อีเมลนี้มีอยู่แล้ว" });
    }

    // ✅ บันทึกข้อมูลสมัครสมาชิก (ไม่มี a_username แล้ว)
    const [result] = await db.promise().query(
      `INSERT INTO applicants (
        a_password, a_firstname, a_lastname,
        a_studentid, a_faculty, a_birthdate, a_gender,
        a_email, a_phone, a_created
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        f.a_password,
        f.a_firstname,
        f.a_lastname,
        f.a_studentid,
        f.a_faculty,
        f.a_birthdate,
        f.a_gender,
        f.a_email,
        f.a_phone
      ]
    );

    const applicant_id = result.insertId;

    const [newUserRows] = await db.promise().query(
      "SELECT * FROM applicants WHERE applicant_id = ?",
      [applicant_id]
    );

    res.status(200).json({ message: "สมัครสมาชิกสำเร็จ", user: newUserRows[0] });
  } catch (err) {
    console.error("❌ REGISTER APPLICANT ERROR:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});


// ✅ สมัครสมาชิกผู้ว่าจ้าง
router.post("/register/employer", async (req, res) => {
  const f = req.body;
  try {
    const [exist] = await db.promise().query(
      "SELECT * FROM employers WHERE e_email = ?",
      [f.e_email]
    );
    if (exist.length > 0) {
      return res.status(400).json({ message: "อีเมลนี้มีอยู่แล้ว" });
    }

    const [result] = await db.promise().query(
      `INSERT INTO employers (
        e_password, e_email, e_created
      ) VALUES (?, ?, NOW())`,
      [f.e_password, f.e_email]
    );

    const employer_id = result.insertId;
    const [newUserRows] = await db.promise().query(
      "SELECT * FROM employers WHERE employer_id = ?",
      [employer_id]
    );

    res.status(200).json({ message: "สมัครสมาชิกสำเร็จ", user: newUserRows[0] });
  } catch (err) {
    console.error("❌ REGISTER EMPLOYER ERROR:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

// ✅ Login สำหรับผู้สมัครงาน
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.promise().query(
      "SELECT * FROM applicants WHERE a_email = ? AND a_password = ?",
      [email, password]
    );
    if (users.length === 0) return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

    res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", user: users[0] });
  } catch (err) {
    console.error("❌ LOGIN APPLICANT ERROR:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

// ✅ Login สำหรับผู้ว่าจ้าง
router.post("/employer/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await db.promise().query(
      "SELECT * FROM employers WHERE e_email = ? AND e_password = ?",
      [email, password]
    );
    if (users.length === 0) return res.status(401).json({ message: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });

    res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", user: users[0] });
  } catch (err) {
    console.error("❌ LOGIN EMPLOYER ERROR:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

module.exports = router;
