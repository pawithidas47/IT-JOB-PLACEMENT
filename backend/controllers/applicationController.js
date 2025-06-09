const db = require("../models/db");

// ✅ ตรวจสอบสถานะการสมัคร
exports.checkApplied = (req, res) => {
  try {
    const job_id_raw = req.query.job_id || req.params.job_id;
    const applicant_id_raw = req.query.applicant_id || req.params.applicant_id;

    console.log("🧾 รับค่าเช็ค:", { job_id_raw, applicant_id_raw });

    const job_id = Number(job_id_raw);
    const applicant_id = Number(applicant_id_raw);

    if (isNaN(job_id) || isNaN(applicant_id)) {
      console.warn("❌ job_id หรือ applicant_id ไม่ถูกต้อง:", { job_id_raw, applicant_id_raw });
      return res.status(400).json({ message: "job_id หรือ applicant_id ไม่ถูกต้อง" });
    }

    const sql = `
      SELECT app_status FROM applications
      WHERE job_id = ? AND applicant_id = ?
      AND app_status NOT IN ('cancelled', 'rejected')
      ORDER BY app_date DESC
      LIMIT 1
    `;

    db.query(sql, [job_id, applicant_id], (err, results) => {
      if (err) {
        console.error("❌ ตรวจสอบสถานะล้มเหลว:", err);
        return res.status(500).json({ message: "ตรวจสอบสถานะล้มเหลว" });
      }

      const app = results[0];
      const status = app?.app_status || null;
      const alreadyApplied = !!app;

      return res.json({ status, alreadyApplied });
    });
  } catch (err) {
    console.error("🔥 Exception:", err);
    return res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
};






// ✅ สมัครงาน
exports.apply = (req, res) => {
  const job_id = Number(req.body.job_id);
  const applicant_id = Number(req.body.applicant_id);
  const app_portfolio_url = req.body.app_portfolio_url || null;

  if (!job_id || !applicant_id) {
    return res.status(400).json({ message: "ข้อมูลไม่ครบถ้วน" });
  }

  const checkSql = `
    SELECT * FROM applications
    WHERE job_id = ? AND applicant_id = ?
    AND app_status NOT IN ('cancelled', 'rejected')
    LIMIT 1
  `;

  db.query(checkSql, [job_id, applicant_id], (err, results) => {
    if (err) {
      console.error("❌ ตรวจสอบการสมัครล้มเหลว:", err);
      return res.status(500).json({ message: "ไม่สามารถตรวจสอบการสมัครได้" });
    }

    if (results.length > 0) {
      return res.status(409).json({ message: "คุณได้สมัครงานนี้ไปแล้ว" });
    }

    const insertSql = `
      INSERT INTO applications (job_id, applicant_id, app_date, app_status, app_portfolio_url)
      VALUES (?, ?, NOW(), 'pending', ?)
    `;

    db.query(insertSql, [job_id, applicant_id, app_portfolio_url], (err2) => {
      if (err2) {
        console.error("❌ บันทึกข้อมูลไม่สำเร็จ:", err2.sqlMessage || err2);
        return res.status(500).json({ message: "ไม่สามารถสมัครงานได้" });
      }

      console.log("✅ สมัครงานสำเร็จ");
      res.status(200).json({ message: "สมัครงานสำเร็จ" });
    });
  });
};
