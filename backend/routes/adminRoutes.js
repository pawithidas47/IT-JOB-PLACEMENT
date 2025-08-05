const express = require("express");
const router = express.Router();
const db = require("../models/db"); // ✅ เพิ่มบรรทัดนี้

const adminAuthCtrl = require("../controllers/adminAuthController");
const adminCtrl = require("../controllers/adminController");

// ✅ Login admin
router.post("/login", adminAuthCtrl.loginAdmin);

// ✅ ดึงข้อมูลทั้งหมด
router.get("/users", adminCtrl.getAllUsers);
router.get("/jobs", adminCtrl.getAllJobs);
router.get("/uploads", adminCtrl.getAllUploads);

// ✅ แก้สถานะผู้ใช้ (แบน / ยกเลิกแบน)
router.put("/users/:id/status", async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  try {
    await db.promise().query(`UPDATE applicants SET a_status = ? WHERE applicant_id = ?`, [status, id]);
    await db.promise().query(`UPDATE employers SET e_status = ? WHERE employer_id = ?`, [status, id]);
    res.json({ message: "อัปเดตสถานะสำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการอัปเดตสถานะ" });
  }
});

// ✅ ลบผู้ใช้ (ทั้ง applicants หรือ employers)
router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await db.promise().query(`DELETE FROM applicants WHERE applicant_id = ?`, [id]);
    await db.promise().query(`DELETE FROM employers WHERE employer_id = ?`, [id]);
    res.json({ message: "ลบผู้ใช้สำเร็จ" });
  } catch (err) {
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบผู้ใช้" });
  }
});

module.exports = router;
