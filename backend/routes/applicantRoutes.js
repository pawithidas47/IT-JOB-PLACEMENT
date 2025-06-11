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


// ✅ ดึงโปรไฟล์ผู้สมัครทั้งหมด (รวม bio, skills, portfolios)
router.get("/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [user] = await db.promise().query(
            "SELECT * FROM applicants WHERE applicant_id = ?",
            [id]
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
        console.error("❌ Error:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
    }
});


// ✅ อัปโหลดรูปโปรไฟล์
router.post("/:id/upload", upload.single("image"), async (req, res) => {
    const { id } = req.params;
    const imageUrl = `/uploads/${req.file.filename}`;
    await db.promise().query(
        "UPDATE applicants SET profile_img_url = ? WHERE applicant_id = ?",
        [imageUrl, id]
    );
    res.json({ url: imageUrl });
});


// ✅ อัปเดต bio
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
        console.error("❌ อัปเดต Bio ล้มเหลว:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
    }
});


// ✅ เพิ่มผลงาน portfolio ใหม่
router.post("/:id/portfolio", async (req, res) => {
    const { id } = req.params;
    const { portfolio_url } = req.body;

    try {
        await db.promise().query(
            "INSERT INTO portfolios (applicant_id, portfolio_url) VALUES (?, ?)",
            [id, portfolio_url]
        );
        res.json({ message: "เพิ่มผลงานเรียบร้อยแล้ว" });
    } catch (err) {
        console.error("❌ เพิ่ม portfolio ล้มเหลว:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
    }
});

// ✅ เพิ่มผลงาน (Portfolio)
router.post("/:id/portfolio", async (req, res) => {
    const { id } = req.params;
    const { portfolio_url } = req.body;

    try {
        await db.promise().query(
            "INSERT INTO portfolios (applicant_id, portfolio_url) VALUES (?, ?)",
            [id, portfolio_url]
        );
        res.json({ message: "เพิ่มผลงานเรียบร้อยแล้ว" });
    } catch (err) {
        console.error("❌ เพิ่ม portfolio ล้มเหลว:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err });
    }
});

// ✅ เพิ่ม/อัปเดตทักษะของผู้ใช้
router.put("/:id/skills", async (req, res) => {
    const { id } = req.params;
    const { skills } = req.body;

    try {
        if (!Array.isArray(skills)) {
            return res.status(400).json({ message: "ข้อมูลทักษะไม่ถูกต้อง" });
        }

        // เคลียร์ของเก่า
        await db.promise().query("DELETE FROM user_skills WHERE applicant_id = ?", [id]);

        for (const skillName of skills) {
            const trimmed = skillName.trim();
            if (!trimmed) continue;

            // ค้นหาหรือเพิ่ม skill
            let [existing] = await db.promise().query(
                "SELECT skill_id FROM skills WHERE skill_name = ?",
                [trimmed]
            );

            let skillId;
            if (existing.length > 0) {
                skillId = existing[0].skill_id;
            } else {
                const [result] = await db.promise().query(
                    "INSERT INTO skills (skill_name) VALUES (?)",
                    [trimmed]
                );
                skillId = result.insertId;
            }

            // ผูก skill กับ applicant
            await db.promise().query(
                "INSERT INTO user_skills (applicant_id, skill_id) VALUES (?, ?)",
                [id, skillId]
            );
        }

        res.json({ message: "อัปเดตทักษะเรียบร้อยแล้ว" });
    } catch (err) {
        console.error("❌ updateSkills error:", err);
        res.status(500).json({ message: "เกิดข้อผิดพลาด", error: err.message });
    }
});


module.exports = router;
