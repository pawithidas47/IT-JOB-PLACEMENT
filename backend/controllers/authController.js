const db = require("../models/db");

// ✅ สมัครสมาชิกผู้สมัครงาน
exports.registerApplicant = (req, res) => {
  const d = req.body;

  const q = `
    INSERT INTO applicants (
      a_username, a_password, a_firstname, a_lastname,
      a_studentid, a_faculty, a_birthdate, a_gender,
      a_email, a_phone, a_created, a_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

  db.query(
    q,
    [
      d.a_username,
      d.a_password,
      d.a_firstname,
      d.a_lastname,
      d.a_studentid,
      d.a_faculty,
      d.a_birthdate,
      d.a_gender,
      d.a_email,
      d.a_phone
    ],
    (err) => {
      if (err) {
        console.error("❌ Register Applicant Error:", err.sqlMessage || err);
        return res.status(500).json({ message: "สมัครไม่สำเร็จ" });
      }
      res.status(200).json({ message: "✅ สมัครสมาชิกนิสิตสำเร็จ" });
    }
  );
};

// ✅ สมัครสมาชิกผู้ว่าจ้าง
exports.registerEmployer = (req, res) => {
  const d = req.body;

  const q = `
    INSERT INTO employers (
      e_username, e_password, e_firstname, e_lastname,
      e_email, e_phone, e_type, e_created, e_updated
    ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`;

  db.query(
    q,
    [
      d.e_username,
      d.e_password,
      d.e_firstname,
      d.e_lastname,
      d.e_email,
      d.e_phone,
      d.e_type
    ],
    (err) => {
      if (err) {
        console.error("❌ Register Employer Error:", err.sqlMessage || err);
        return res.status(500).json({ message: "สมัครผู้ว่าจ้างล้มเหลว" });
      }
      res.status(200).json({ message: "✅ สมัครผู้ว่าจ้างสำเร็จ" });
    }
  );
};

// ✅ เข้าสู่ระบบ
exports.login = (req, res) => {
  const { username, password, role } = req.body;

  const table =
    role === "applicant"
      ? "applicants"
      : role === "employer"
      ? "employers"
      : "admins";

  const userCol =
    role === "applicant"
      ? "a_username"
      : role === "employer"
      ? "e_username"
      : "ad_username";

  const passCol =
    role === "applicant"
      ? "a_password"
      : role === "employer"
      ? "e_password"
      : "ad_password";

  const sql = `SELECT * FROM ${table} WHERE ${userCol} = ? AND ${passCol} = ?`;

  db.query(sql, [username, password], (err, results) => {
    if (err || results.length === 0) {
      console.error("❌ Login Error:", err?.sqlMessage || "Not found");
      return res.status(401).json({ message: "เข้าสู่ระบบล้มเหลว" });
    }

res.status(200).json({
  message: "✅ เข้าสู่ระบบสำเร็จ",
  user: {
    id:
      role === "applicant"
        ? results[0].applicant_id // ✅ ใช้ field จริง
        : role === "employer"
        ? results[0].e_id
        : results[0].ad_id,
    ...results[0],
  }
});



  });
};
