const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes); // ✅ route นี้ใช้จากไฟล์ applicationRoutes.js ที่ถูกต้อง
app.use("/api/applications", require("./routes/applicationRoutes"));

app.listen(3001, () => {
  console.log("🚀 Server running at http://localhost:3001");
});
