const express = require("express");
const router = express.Router();
const jobCtrl = require("../controllers/jobController");

// ✅ POST /api/jobs - โพสต์งานใหม่
router.post("/", jobCtrl.postJob);
router.get("/employer/:id", jobCtrl.getJobsByEmployer);
router.delete("/:id", jobCtrl.deleteJob);
router.put("/:id", jobCtrl.updateJob);
router.get("/:id", jobCtrl.getJobById);

module.exports = router;
