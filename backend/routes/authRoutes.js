const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router.post("/register/applicant", auth.registerApplicant);
router.post("/register/employer", auth.registerEmployer);
router.post("/login", auth.login);

module.exports = router;
