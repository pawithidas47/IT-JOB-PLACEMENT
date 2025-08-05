const express = require("express");
const router = express.Router();
const adminAuthCtrl = require("../controllers/adminAuthController");

router.post("/login", adminAuthCtrl.loginAdmin); // ✅ ใช้แค่บรรทัดนี้

module.exports = router;
