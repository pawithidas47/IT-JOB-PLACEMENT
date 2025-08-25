// routes/applicantRoutes.js
const express = require("express");
const router = express.Router();
const db = require("../models/db");
const multer = require("multer");

/* ---------- Multer (อัปโหลดรูปโปรไฟล์) ---------- */
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

/* ---------- ดึงผู้สมัครทั้งหมด ---------- */
router.get("/", async (_req, res) => {
  try {
    const [rows] = await db.promise().query("SELECT * FROM applicants");
    res.status(200).json(rows);
  } catch (err) {
    console.error("❌ FETCH APPLICANTS ERROR:", err);
    res.status(500).json({ message: "ไม่สามารถดึงข้อมูลผู้สมัครได้", error: err });
  }
});

/* ---------- ดึงข้อมูลโปรไฟล์ผู้สมัคร ---------- */
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [user] = await db
      .promise()
      .query("SELECT * FROM applicants WHERE applicant_id = ?", [id]);

    if (!user.length) {
      return res.status(404).json({ message: "ไม่พบผู้ใช้" });
    }

    const [skills] = await db
      .promise()
      .query(
        `SELECT s.skill_id, s.skill_name
           FROM skills s
           JOIN user_skills us ON s.skill_id = us.skill_id
          WHERE us.applicant_id = ?`,
        [id]
      );

    const [portfolios] = await db
      .promise()
      .query("SELECT * FROM portfolios WHERE applicant_id = ?", [id]);

    const [educations] = await db
      .promise()
      .query("SELECT * FROM educations WHERE applicant_id = ?", [id]);

    const [experiences] = await db
      .promise()
      .query("SELECT * FROM experiences WHERE applicant_id = ?", [id]);

    res.json({
      user: user[0],
      skills,
      portfolios,
      education: educations,
      experience: experiences,
    });
  } catch (err) {
    console.error("❌ fetchProfile error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

/* ---------- อัปโหลดรูปโปรไฟล์ (ให้ตรงกับหน้าบ้าน) ---------- */
// หน้าบ้านส่ง: POST /api/upload-profile/:id  (field name: "profile")
router.post("/upload-profile/:id", upload.single("profile"), async (req, res) => {
  const { id } = req.params;
  try {
    if (!req.file) return res.status(400).json({ message: "ไม่พบไฟล์อัปโหลด" });

    const imageUrl = `/uploads/${req.file.filename}`;
    await db
      .promise()
      .query(
        "UPDATE applicants SET profile_img_url = ? WHERE applicant_id = ?",
        [imageUrl, id]
      );
    res.json({ url: imageUrl });
  } catch (err) {
    console.error("❌ Upload image failed:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

/* ---------- อัปเดต Bio ---------- */
router.put("/:id/bio", async (req, res) => {
  const { id } = req.params;
  const { a_bio } = req.body;
  try {
    await db
      .promise()
      .query("UPDATE applicants SET a_bio = ? WHERE applicant_id = ?", [
        a_bio,
        id,
      ]);
    res.json({ message: "อัปเดต Bio สำเร็จ" });
  } catch (err) {
    console.error("❌ Update bio failed:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

/* ---------- อัปเดตข้อมูลผู้สมัคร (กันค่า NULL/ฟอร์แมตผิด) ---------- */
// ---------- อัปเดตข้อมูลผู้สมัคร (กัน a_studentid เป็น NULL และ normalize วันที่) ----------
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const {
    a_firstname, a_lastname, a_faculty, a_gender,
    a_birthdate, a_contact, a_phone, a_email,
    a_position, a_salary, a_interest,
    a_nationality, a_studentid, a_bio,
    portfolios = [], education = [], experience = []
  } = req.body;

  // helper รับได้ทั้ง '2025-10-06' และ '06/10/2025'
  const parseDate = (v) => {
    if (!v) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(v)) return v; // YYYY-MM-DD
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
      const [dd, mm, yyyy] = v.split("/");
      return `${yyyy}-${mm}-${dd}`;
    }
    const d = new Date(v);
    return isNaN(d) ? null : d.toISOString().slice(0, 10);
  };

  const formattedBirthdate = parseDate(a_birthdate);

  // salary: ถ้า “ตามตกลง”/ว่าง -> null
  let salaryForDb = null;
  const salaryRaw = (a_salary ?? "").toString().trim();
  if (salaryRaw !== "" && !isNaN(Number(salaryRaw))) salaryForDb = Number(salaryRaw);

  // duration: เก็บเฉพาะตัวเลข
  const toIntOrNull = (v) => {
    const n = parseInt(String(v ?? "").replace(/\D+/g, ""), 10);
    return Number.isFinite(n) ? n : null;
  };

  const conn = db.promise();
  try {
    // อ่านค่า studentid เดิมไว้ ถ้าส่งมาเป็น null จะคงค่าเดิม
    const [[current]] = await conn.query(
      "SELECT a_studentid FROM applicants WHERE applicant_id = ?",
      [id]
    );
    const keepStudentId = a_studentid ?? current?.a_studentid ?? "";

    await conn.query(
      `UPDATE applicants SET 
         a_firstname = ?, a_lastname = ?, a_faculty = ?, a_gender = ?,
         a_birthdate = ?, a_contact = ?, a_phone = ?, a_email = ?,
         a_position = ?, a_salary = ?, a_interest = ?,
         a_nationality = ?, a_studentid = ?, a_bio = ?
       WHERE applicant_id = ?`,
      [
        a_firstname ?? null,
        a_lastname ?? null,
        a_faculty ?? null,
        a_gender ?? null,
        formattedBirthdate,
        a_contact ?? null,
        a_phone ?? null,
        a_email ?? null,
        a_position ?? null,
        salaryForDb,
        a_interest ?? null,
        a_nationality ?? null,
        keepStudentId, // กัน not-null
        a_bio ?? null,
        id,
      ]
    );

    // portfolios
    await conn.query("DELETE FROM portfolios WHERE applicant_id = ?", [id]);
    for (const url of portfolios.filter(Boolean)) {
      await conn.query(
        "INSERT INTO portfolios (applicant_id, portfolio_url) VALUES (?, ?)",
        [id, url]
      );
    }

    // educations
    await conn.query("DELETE FROM educations WHERE applicant_id = ?", [id]);
    for (const edu of education) {
      await conn.query(
        `INSERT INTO educations (applicant_id, start_year, university, level, degree, major, gpa)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          edu.start_year ?? null,
          edu.university ?? null,
          edu.level ?? null,
          edu.degree ?? null,
          edu.major ?? null,
          edu.gpa === "" || edu.gpa == null ? null : Number(edu.gpa),
        ]
      );
    }

    // experiences
    await conn.query("DELETE FROM experiences WHERE applicant_id = ?", [id]);
    for (const exp of experience) {
      await conn.query(
        `INSERT INTO experiences (applicant_id, title, start_date, end_date, duration, description)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          id,
          exp.title ?? null,
          parseDate(exp.start_date),
          parseDate(exp.end_date),
          toIntOrNull(exp.duration),
          exp.description ?? null,
        ]
      );
    }

    // ส่งข้อมูลล่าสุดกลับ (ให้หน้าโปรไฟล์ใช้ทันทีได้)
    const [[user]] = await conn.query(
      "SELECT * FROM applicants WHERE applicant_id = ?",
      [id]
    );
    const [educations] = await conn.query(
      "SELECT * FROM educations WHERE applicant_id = ?",
      [id]
    );
    const [experiences] = await conn.query(
      "SELECT * FROM experiences WHERE applicant_id = ?",
      [id]
    );

    res.json({
      message: "✅ อัปเดตข้อมูลสำเร็จ",
      user,
      education: educations,
      experience: experiences,
    });
  } catch (err) {
    console.error("❌ Update applicant failed:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }

});

/* ---------- อัปเดต Skills ---------- */
router.put("/:id/skills", async (req, res) => {
  const { id } = req.params;
  const { skills } = req.body;

  if (!Array.isArray(skills)) {
    return res.status(400).json({ message: "ข้อมูลทักษะไม่ถูกต้อง" });
  }

  try {
    await db.promise().query("DELETE FROM user_skills WHERE applicant_id = ?", [
      id,
    ]);

    for (const skillName of skills.map((s) => s.trim()).filter(Boolean)) {
      let [existing] = await db
        .promise()
        .query("SELECT skill_id FROM skills WHERE skill_name = ?", [skillName]);

      let skillId;
      if (existing.length > 0) {
        skillId = existing[0].skill_id;
      } else {
        const [result] = await db
          .promise()
          .query("INSERT INTO skills (skill_name) VALUES (?)", [skillName]);
        skillId = result.insertId;
      }

      await db
        .promise()
        .query(
          "INSERT INTO user_skills (applicant_id, skill_id) VALUES (?, ?)",
          [id, skillId]
        );
    }

    res.json({ message: "✅ อัปเดตทักษะเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("❌ updateSkills error:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

/* ---------- ลบ portfolio ทั้งหมด ---------- */
router.delete("/:id/portfolio/all", async (req, res) => {
  const { id } = req.params;
  try {
    await db
      .promise()
      .query("DELETE FROM portfolios WHERE applicant_id = ?", [id]);
    res.json({ message: "ลบ portfolio ทั้งหมดเรียบร้อยแล้ว" });
  } catch (err) {
    console.error("❌ ลบ portfolio ล้มเหลว:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
  }
});

module.exports = router;
