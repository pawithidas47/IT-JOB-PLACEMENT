const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const db = require("./models/db"); // ✅ อย่าลืมใส่!
const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const applicantRoutes = require("./routes/applicantRoutes");

const app = express();
const employerRoutes = require("./routes/employerRoutes");

app.use(cors());
app.use("/api/employer", employerRoutes);



app.use(bodyParser.json());

// ✅ เสิร์ฟไฟล์รูป
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/applicant", applicantRoutes); // ✅ ต้องอยู่หลัง db

// ✅ DELETE เฉพาะกรณีจำเป็น (คุณมีใน applicationRoutes แล้ว อาจลบทิ้งได้)
app.delete("/api/applications/:id", (req, res) => {
  const applicationId = req.params.id;
  const sql = "DELETE FROM applications WHERE application_id = ?";

  db.query(sql, [applicationId], (err, result) => {
    if (err) {
      console.error("❌ ลบข้อมูลไม่สำเร็จ:", err);
      return res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบ" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลการสมัคร" });
    }
    return res.json({ message: "ลบเรียบร้อยแล้ว" });
  });
});



app.listen(3001, () => {
  console.log("🚀 Server running at http://localhost:3001");
});

