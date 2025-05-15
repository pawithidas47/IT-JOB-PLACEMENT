const express = require("express");
const router = express.Router();
const appCtrl = require("../controllers/applicationController");

router.post("/", appCtrl.apply);

module.exports = router;
