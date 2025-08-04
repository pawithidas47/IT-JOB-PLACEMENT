const express = require("express");
const router = express.Router();
const db = require("../models/db");
const multer = require("multer");

//  ตั้งค่าการอัปโหลดไฟล์ภาพ
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/**  ดึงผู้สมัครทั้งหมด */
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM applicants");
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ FETCH APPLICANTS ERROR:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลผู้สมัครได้", error: err });
  }
});

/**  ดึงข้อมูลโปรไฟล์ผู้สมัคร */
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
    const [educations] = await db.promise().query(
      "SELECT * FROM educations WHERE applicant_id = ?", [id]
    );
    const [experiences] = await db.promise().query(
      "SELECT * FROM experiences WHERE applicant_id = ?", [id]
    );

    if (!user.length) return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    res.json({ user: user[0], skills, portfolios, education: educations, experience: experiences });
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

/** ✅ อัปเดตข้อมูลผู้สมัคร */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    a_firstname, a_lastname, a_faculty, a_gender,
    a_birthdate, a_contact, a_phone, a_email,
    a_position, a_salary, a_computer_stars, a_interest,
    a_nationality, a_studentid, a_bio,
    portfolios = [], education = [], experience = []
  } = req.body;

  const formattedBirthdate = a_birthdate ? a_birthdate.split("T")[0] : null;

  try {
    await db.promise().query(
      `UPDATE applicants SET 
        a_firstname = ?, a_lastname = ?, a_faculty = ?, a_gender = ?, 
        a_birthdate = ?, a_contact = ?, a_phone = ?, a_email = ?, 
        a_position = ?, a_salary = ?, a_computer_stars = ?, a_interest = ?, 
        a_nationality = ?, a_studentid = ?, a_bio = ? 
      WHERE applicant_id = ?`,
      [
        a_firstname, a_lastname, a_faculty, a_gender,
        formattedBirthdate, a_contact, a_phone, a_email,
        a_position, a_salary, a_computer_stars, a_interest,
        a_nationality, a_studentid, a_bio,
        id
      ]
    );

    await db.promise().query("DELETE FROM portfolios WHERE applicant_id = ?", [id]);
    for (const url of portfolios) {
      await db.promise().query(
        "INSERT INTO portfolios (applicant_id, portfolio_url) VALUES (?, ?)", [id, url]
      );
    }

    await db.promise().query("DELETE FROM educations WHERE applicant_id = ?", [id]);
    for (const edu of education) {
      await db.promise().query(
        `INSERT INTO educations (applicant_id, start_year, university, level, degree, major, gpa) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [id, edu.start_year, edu.university, edu.level, edu.degree, edu.major, edu.gpa]
      );
    }

    await db.promise().query("DELETE FROM experiences WHERE applicant_id = ?", [id]);
    for (const exp of experience) {
      await db.promise().query(
        `INSERT INTO experiences (applicant_id, title, start_date, end_date, duration, description) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [id, exp.title, exp.start_date, exp.end_date, exp.duration, exp.description]
      );
    }

    res.json({ message: "✅ อัปเดตข้อมูลผู้ใช้และ portfolio, education, experience สำเร็จ" });
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

/** ✅ เพิ่ม Portfolio ใหม่แยก */
router.post("/:id/portfolio", async (req, res) => {
  const { id } = req.params;
  const { portfolio_url } = req.body;

  if (!portfolio_url) {
    return res.status(400).json({ message: "ต้องระบุ portfolio_url" });
  }

  try {
    await db.promise().query(
      "INSERT INTO portfolios (applicant_id, portfolio_url) VALUES (?, ?)", [id, portfolio_url]
    );
    res.json({ message: "เพิ่ม portfolio สำเร็จ" });
  } catch (err) {
    console.error("❌ เพิ่ม portfolio ล้มเหลว:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

/** ✅ ลบ portfolio ทั้งหมด */
router.delete("/:id/portfolio/all", async (req, res) => {
  const { id } = req.params;
  try {
    await db.promise().query("DELETE FROM portfolios WHERE applicant_id = ?", [id]);
    res.json({ message: "ลบ portfolio ทั้งหมดเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("❌ ลบ portfolio ล้มเหลว:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

module.exports = router;
