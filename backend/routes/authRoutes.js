// ===== BACKEND: routes/authRoutes.js =====
const express = require("express");
const router = express.Router();
const db = require("../models/db");

// ✅ สมัครสมาชิกผู้สมัครงาน
router.post("/register/applicant", async (req, res) => {
  const f = req.body;
  try {
    const [exist] = await db.promise().query(
      "SELECT * FROM applicants WHERE a_username = ?",
      [f.a_username]
    );
    if (exist.length > 0) {
      return res.status(400).json({ message: "ชื่อผู้ใช้นี้ถูกใช้แล้ว" });
    }

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

    // ✅ ดึงข้อมูลจาก DB จริง ๆ กลับไป
    const [newUserRows] = await db.promise().query(
      "SELECT * FROM applicants WHERE applicant_id = ?",
      [applicant_id]
    );
    const newUser = newUserRows[0];

    res.status(200).json({ message: "สมัครสมาชิกสำเร็จ", user: newUser });
  } catch (err) {
    console.error("❌ REGISTER ERROR:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

// ✅ สมัครสมาชิกผู้ว่าจ้าง (ยังไม่เปิดใช้)
router.post("/register/employer", (req, res) => {
  res.status(501).json({ message: "ยังไม่ได้พัฒนา" });
});

// ✅ Login ด้วย username + password
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.promise().query(
      "SELECT * FROM applicants WHERE a_username = ? AND a_password = ?",
      [username, password]
    );

    if (users.length === 0) {
      return res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    const user = users[0];
    res.status(200).json({ message: "เข้าสู่ระบบสำเร็จ", user });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

module.exports = router;
