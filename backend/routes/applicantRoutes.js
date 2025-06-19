const express = require("express");
const router = express.Router();
const db = require("../models/db");
const multer = require("multer");

// 📦 ตั้งค่าการอัปโหลดไฟล์ภาพ
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/** ✅ ดึงข้อมูลโปรไฟล์ผู้สมัคร */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await db.promise().query(
      "SELECT * FROM applicants WHERE applicant_id = ?", [id]
    );
    const [skills] = await db.promise().query(
      `SELECT s.skill_id, s.skill_name FROM skills s
       JOIN user_skills us ON s.skill_id = us.skill_id
       WHERE us.applicant_id = ?`, [id]
    );
    const [portfolios] = await db.promise().query(
      "SELECT * FROM portfolios WHERE applicant_id = ?", [id]
    );

    if (!user.length) return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    res.json({ user: user[0], skills, portfolios });
  } catch (err) {
    console.error("❌ fetchProfile error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

/** ✅ อัปโหลดรูปภาพ */
router.post("/:id/upload", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const imageUrl = `/uploads/${req.file.filename}`;
  try {
    await db.promise().query(
      "UPDATE applicants SET profile_img_url = ? WHERE applicant_id = ?",
      [imageUrl, id]
    );
    res.json({ url: imageUrl });
  } catch (err) {
    console.error("❌ Upload image failed:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

/** ✅ อัปเดต Bio */
router.put("/:id/bio", async (req, res) => {
  const { id } = req.params;
  const { a_bio } = req.body;
  try {
    await db.promise().query(
      "UPDATE applicants SET a_bio = ? WHERE applicant_id = ?",
      [a_bio, id]
    );
    res.json({ message: "อัปเดต Bio สำเร็จ" });
  } catch (err) {
    console.error("❌ Update bio failed:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

/** ✅ อัปเดตข้อมูลทั่วไป + ลบ/เพิ่ม Portfolio ใหม่ */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    a_firstname,
    a_lastname,
    a_faculty,
    a_gender,
    a_birthdate,
    a_contact,
    a_phone,
    a_email,
    portfolios = [] // ✅ fallback ถ้าไม่ได้ส่งมา
  } = req.body;

  try {
    // ✅ อัปเดตข้อมูลทั่วไป
    await db.promise().query(
      `UPDATE applicants SET 
        a_firstname = ?, a_lastname = ?, a_faculty = ?, 
        a_gender = ?, a_birthdate = ?, 
        a_contact = ?, a_phone = ?, a_email = ?
       WHERE applicant_id = ?`,
      [a_firstname, a_lastname, a_faculty, a_gender, a_birthdate, a_contact, a_phone, a_email, id]
    );

    // ✅ ลบ portfolio เดิมทั้งหมด
    await db.promise().query("DELETE FROM portfolios WHERE applicant_id = ?", [id]);

    // ✅ เพิ่มใหม่
    for (const url of portfolios) {
      await db.promise().query(
        "INSERT INTO portfolios (applicant_id, portfolio_url) VALUES (?, ?)",
        [id, url]
      );
    }

    res.json({ message: "✅ อัปเดตข้อมูลผู้ใช้และ portfolio สำเร็จ" });
  } catch (err) {
    console.error("❌ Update applicant failed:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

/** ✅ อัปเดต Skills */
router.put("/:id/skills", async (req, res) => {
  const { id } = req.params;
  const { skills } = req.body;

  if (!Array.isArray(skills)) {
    return res.status(400).json({ message: "ข้อมูลทักษะไม่ถูกต้อง" });
  }

  try {
    await db.promise().query("DELETE FROM user_skills WHERE applicant_id = ?", [id]);

    for (const skillName of skills.map(s => s.trim()).filter(Boolean)) {
      let [existing] = await db.promise().query(
        "SELECT skill_id FROM skills WHERE skill_name = ?", [skillName]
      );

      let skillId;
      if (existing.length > 0) {
        skillId = existing[0].skill_id;
      } else {
        const [result] = await db.promise().query(
          "INSERT INTO skills (skill_name) VALUES (?)", [skillName]
        );
        skillId = result.insertId;
      }

      await db.promise().query(
        "INSERT INTO user_skills (applicant_id, skill_id) VALUES (?, ?)", [id, skillId]
      );
    }

    res.json({ message: "✅ อัปเดตทักษะเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("❌ updateSkills error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});
// เพิ่ม route นี้ไว้ใน applicantRoutes.js (หลัง require และ router = express.Router())
router.post("/:id/portfolio", async (req, res) => {
  const { id } = req.params;
  const { portfolio_url } = req.body;

  if (!portfolio_url) {
    return res.status(400).json({ message: "ต้องระบุ portfolio_url" });
  }

  try {
    await db.promise().query(
      "INSERT INTO portfolios (applicant_id, portfolio_url) VALUES (?, ?)",
      [id, portfolio_url]
    );
    res.json({ message: "เพิ่ม portfolio สำเร็จ" });
  } catch (err) {
    console.error("❌ เพิ่ม portfolio ล้มเหลว:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

// ✅ ลบ portfolio ทั้งหมดของผู้ใช้
router.delete("/:id/portfolio/all", async (req, res) => {
  const { id } = req.params;
  try {
    await db.promise().query(
      "DELETE FROM portfolios WHERE applicant_id = ?",
      [id]
    );
    res.json({ message: "ลบ portfolio ทั้งหมดเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("❌ ลบ portfolio ล้มเหลว:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});


module.exports = router;
