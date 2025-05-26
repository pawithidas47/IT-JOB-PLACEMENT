const express = require("express");
const router = express.Router();
const jobCtrl = require("../controllers/jobController"); // เช็คว่าการนำเข้าถูกต้องไหม

// เส้นทาง POST สำหรับเพิ่มงานใหม่
router.post("/", jobCtrl.postJob);

// เส้นทาง GET สำหรับดึงข้อมูลงานทั้งหมด
router.get("/", jobCtrl.getJobs); // ใช้ฟังก์ชัน getJobs

// เส้นทาง GET สำหรับดึงงานตามผู้ว่าจ้าง
router.get("/employer/:id", jobCtrl.getJobsByEmployer);

// เส้นทาง DELETE สำหรับลบงาน
router.delete("/:id", jobCtrl.deleteJob);

// เส้นทาง PUT สำหรับแก้ไขงาน
router.put("/:id", jobCtrl.updateJob);

// เส้นทาง GET สำหรับดึงข้อมูลงานตาม ID
router.get("/:id", jobCtrl.getJobById);

module.exports = router;
