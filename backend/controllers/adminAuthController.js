// backend/controllers/adminAuthController.js
const db = require("../models/db");

exports.loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM admins WHERE ad_username = ? AND ad_password = ?",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
    }

    return res.status(200).json({
      message: "เข้าสู่ระบบสำเร็จ",
      token: "admin_dummy_token",
    });
  } catch (error) {
    return res.status(500).json({ message: "เกิดข้อผิดพลาด", error });
  }
};
