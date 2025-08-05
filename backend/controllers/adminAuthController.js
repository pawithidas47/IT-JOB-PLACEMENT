const db = require("../models/db");

// ✅ loginAdmin: เข้าสู่ระบบแอดมิน
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
      token: "admin_dummy_token", // ในอนาคตอาจเปลี่ยนเป็น JWT
    });
  } catch (error) {
    console.error("❌ Error during admin login:", error);
    return res.status(500).json({ message: "เกิดข้อผิดพลาดในระบบ", error });
  }
};
