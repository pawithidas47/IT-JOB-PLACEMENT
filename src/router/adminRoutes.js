const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

function adminAuth(req, res, next) {
  const token = req.headers.authorization;
  if (token === "admin_dummy_token") return next();
  return res.status(403).json({ message: "Unauthorized" });
}


// ✅ ผู้ใช้
router.get("/users", adminAuth, adminController.getUsers);           // ดูผู้ใช้ทั้งหมด
router.delete("/users/:id", adminAuth, adminController.deleteUser);   // ลบผู้ใช้
router.put("/users/ban/:id", adminAuth, adminController.banUser);     // แบนผู้ใช้

// ✅ งานทั้งหมด
router.get("/jobs", adminAuth, adminController.getAllJobs);           // ดูงานทั้งหมด
router.delete("/jobs/:id", adminAuth, adminController.deleteJob);     // ลบงาน

// ✅ รายการไฟล์ที่อัปโหลด (เช่นรูป, resume, portfolio)
router.get("/uploads", adminAuth, adminController.getUploadedFiles);  // ดูรายชื่อไฟล์ที่ถูกอัปโหลด

module.exports = router;
