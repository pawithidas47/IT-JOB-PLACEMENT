const express = require("express");
const router = express.Router();
const adminAuthCtrl = require("../controllers/adminAuthController"); // ✅
const adminCtrl = require("../controllers/adminController");         // ✅

router.post("/login", adminAuthCtrl.loginAdmin); // ✅

router.get("/users", adminCtrl.getAllUsers);
router.get("/jobs", adminCtrl.getAllJobs);
router.get("/uploads", adminCtrl.getAllUploads);

module.exports = router;
