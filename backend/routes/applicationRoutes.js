const express = require("express");
const router = express.Router();
const appCtrl = require("../controllers/applicationController");

router.post("/", appCtrl.apply);
router.get("/check", appCtrl.checkApplied); // ✅ เส้นทางที่ขาดไป

module.exports = router;
