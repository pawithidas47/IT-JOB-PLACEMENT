const express = require("express");
const router = express.Router();
const db = require("../models/db");

// สมัครสมาชิกผู้สมัครงาน
router.post("/register/applicant", async (req, res) => {
  const f = req.body;
  try {
    const [exist] = await db.promise().query("SELECT * FROM applicants WHERE a_username = ?", [f.a_username]);
    if (exist.length > 0) return res.status(400).json({ message: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" });

    const [result] = await db.promise().query(
      `INSERT INTO applicants (
        a_username, a_password, a_firstname, a_lastname,
        a_studentid, a_faculty, a_birthdate, a_gender,
        a_email, a_phone, a_created
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        f.a_username, f.a_password, f.a_firstname, f.a_lastname,
        f.a_studentid, f.a_faculty, f.a_birthdate, f.a_gender,
        f.a_email, f.a_phone
      ]
    );

    const applicant_id = result.insertId;
    const [newUserRows] = await db.promise().query("SELECT * FROM applicants WHERE applicant_id = ?", [applicant_id]);
    res.status(200).json({ message: "สมัครสมาชิกสำเร็จ", user: newUserRows[0] });
  } catch (err) {
    console.error("❌ REGISTER ERROR:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

// ✅ สมัครสมาชิกผู้ว่าจ้าง
router.post("/register/employer", async (req, res) => {
  const f = req.body;

  try {
    const [exist] = await db.promise().query(
      "SELECT * FROM employers WHERE e_username = ?",
      [f.e_username]
    );
    if (exist.length > 0) {
      return res.status(400).json({ message: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" });
    }

    const [result] = await db.promise().query(
  `INSERT INTO employers (
    e_username, e_password, e_type, e_phone, e_email, e_created,
    e_company_name, e_description, e_address,
    e_website, e_contact, e_position,
    e_structure, e_employee_count, e_subdistrict, e_district, e_province
  ) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    f.e_username,
    f.e_password,
    f.e_type,
    f.e_phone,
    f.e_email,
    f.e_company_name,
    f.e_description,
    f.e_address,
    f.e_website,
    f.e_contact,
    f.e_position,
    f.e_structure,
    f.e_employee_count,
    f.e_subdistrict,
    f.e_district,
    f.e_province
  ]
);


    const employer_id = result.insertId;
    const [newUserRows] = await db
      .promise()
      .query("SELECT * FROM employers WHERE employer_id = ?", [employer_id]);

    res.status(200).json({ message: "สมัครสมาชิกสำเร็จ", user: newUserRows[0] });
  } catch (err) {
    console.error("❌ EMPLOYER REGISTER ERROR:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

// ✅ Login สำหรับผู้สมัครงาน
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.promise().query(
      "SELECT * FROM applicants WHERE a_username = ? AND a_password = ?",
      [username, password]
    );
    if (users.length === 0) return res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", user: users[0] });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

// ✅ Login สำหรับผู้ว่าจ้าง
router.post("/employer/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.promise().query(
      "SELECT * FROM employers WHERE e_username = ? AND e_password = ?",
      [username, password]
    );
    if (users.length === 0) return res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", user: users[0] });
  } catch (err) {
    console.error("❌ EMPLOYER LOGIN ERROR:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

module.exports = router;
