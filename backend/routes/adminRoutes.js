const express = require("express");
const router = express.Router();
const db = require("../models/db");

/* =====================  Auth ===================== */
const adminAuthCtrl = require("../controllers/adminAuthController");
router.post("/login", adminAuthCtrl.loginAdmin);

/* =====================  Helpers ===================== */
async function tableExists(name) {
  const [rows] = await db.promise().query(`SHOW TABLES LIKE ?`, [name]);
  return rows.length > 0;
}

// ใช้โต๊ะ Jobs หรือ jobs (ถ้าไม่มีจะสร้าง jobs ให้)
async function resolveJobsTable() {
  if (await tableExists("Jobs")) return "`Jobs`";
  if (await tableExists("jobs")) return "`jobs`";
  await db.promise().query(`
    CREATE TABLE IF NOT EXISTS jobs (
      job_id INT AUTO_INCREMENT PRIMARY KEY,
      employer_id INT NULL,
      j_title VARCHAR(255) NOT NULL,
      j_description TEXT NULL,
      j_type VARCHAR(120) NOT NULL,
      j_salary INT NULL,
      j_amount INT NULL,
      j_location VARCHAR(255) NULL,
      j_contact VARCHAR(255) NULL,
      j_status VARCHAR(30) DEFAULT 'open',
      j_posted_at DATETIME DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
  return "`jobs`";
}

/* =====================  Users (ของเดิม) ===================== */
router.get("/users", async (_req, res) => {
  try {
    const [applicants] = await db.promise().query(`
      SELECT applicant_id AS id,
             CONCAT(COALESCE(a_firstname,''),' ',COALESCE(a_lastname,'')) AS name,
             a_email AS email, a_phone AS phone, a_status AS status, 'applicant' AS role
      FROM applicants
    `);
    const [employers] = await db.promise().query(`
      SELECT employer_id AS id, COALESCE(e_company_name,'') AS name,
             e_email AS email, e_phone AS phone, e_status AS status, 'employer' AS role
      FROM employers
    `);
    res.json([...applicants, ...employers]);
  } catch (err) {
    console.error("❌ โหลด users ไม่สำเร็จ:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการโหลดผู้ใช้" });
  }
});

router.post("/users", async (req, res) => {
  try {
    const { name, email, phone, role, status, password } = req.body;
    if (!name || !email || !role || !status || !password) {
      return res.status(400).send("กรอกข้อมูลให้ครบ");
    }
    if (role === "applicant") {
      const [first, ...rest] = String(name).trim().split(" "); const last = rest.join(" ");
      const [ins] = await db.promise().execute(
        `INSERT INTO applicants
         (a_firstname,a_lastname,a_email,a_phone,a_status,a_created,a_updated,a_password)
         VALUES (?,?,?,?,?,NOW(),NOW(),?)`,
        [first||"", last||"", email, phone||null, status, password]
      );
      return res.status(201).json({ id: ins.insertId, name, email, phone, role, status });
    }
    if (role === "employer") {
      const [ins] = await db.promise().execute(
        `INSERT INTO employers
         (e_company_name,e_email,e_phone,e_status,e_created,e_updated,e_password)
         VALUES (?,?,?,?,NOW(),NOW(),?)`,
        [name, email, phone||null, status, password]
      );
      return res.status(201).json({ id: ins.insertId, name, email, phone, role, status });
    }
    return res.status(400).send("role ไม่รองรับ");
  } catch (e) {
    console.error(e);
    return res.status(500).send("เพิ่มผู้ใช้ไม่สำเร็จ");
  }
});

router.put("/users/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phone, role, status } = req.body;
    if (!name || !email || !role || !status) {
      return res.status(400).send("กรอกข้อมูลให้ครบ");
    }
    let result;
    if (role === "applicant") {
      const [first, ...rest] = String(name).trim().split(" "); const last = rest.join(" ");
      [result] = await db.promise().execute(
        `UPDATE applicants
           SET a_firstname=?,a_lastname=?,a_email=?,a_phone=?,a_status=?,a_updated=NOW()
         WHERE applicant_id=?`,
        [first||"", last||"", email, phone||null, status, id]
      );
    } else if (role === "employer") {
      [result] = await db.promise().execute(
        `UPDATE employers
           SET e_company_name=?,e_email=?,e_phone=?,e_status=?,e_updated=NOW()
         WHERE employer_id=?`,
        [name, email, phone||null, status, id]
      );
    } else {
      return res.status(400).send("role ไม่ถูกต้อง");
    }
    if (result.affectedRows === 0) return res.status(404).send("ไม่พบผู้ใช้");
    res.status(200).json({ id:Number(id), name, email, phone, role, status });
  } catch (err) {
    console.error("❌ admin PUT /users/:id failed:", err);
    return res.status(500).send("แก้ไขไม่สำเร็จ");
  }
});

router.put("/users/:id/status", async (req, res) => {
  const { status, role } = req.body;
  const { id } = req.params;
  try {
    if (role === "applicant") {
      await db.promise().execute(
        `UPDATE applicants SET a_status=?,a_updated=NOW() WHERE applicant_id=?`,
        [status, id]
      );
    } else if (role === "employer") {
      await db.promise().execute(
        `UPDATE employers SET e_status=?,e_updated=NOW() WHERE employer_id=?`,
        [status, id]
      );
    } else {
      return res.status(400).json({ message: "role ไม่ถูกต้อง" });
    }
    res.json({ message: "เปลี่ยนสถานะสำเร็จ" });
  } catch (err) {
    console.error("❌ เปลี่ยนสถานะล้มเหลว:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาด" });
  }
});

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.promise().execute(`DELETE FROM applicants WHERE applicant_id=?`, [id]);
    await db.promise().execute(`DELETE FROM employers  WHERE employer_id=?`, [id]);
    res.json({ message: "ลบผู้ใช้สำเร็จ" });
  } catch (err) {
    console.error("❌ ลบผู้ใช้ล้มเหลว:", err);
    res.status(500).json({ message: "เกิดข้อผิดพลาดในการลบผู้ใช้" });
  }
});

/* =====================  Jobs CRUD (Admin) ===================== */

// GET: ดึงงานทั้งหมด (ส่ง employer_id กลับไปด้วย)
router.get("/jobs", async (_req, res) => {
  try {
    const JT = await resolveJobsTable();
    const hasEmployer = await tableExists("employers");

    const sql = hasEmployer
      ? `SELECT j.job_id, j.j_title, j.j_type, j.j_location, j.j_description, j.j_status,
               COALESCE(j.j_salary, j.j_amount) AS j_salary,
               COALESCE(e.e_company_name, j.j_contact) AS employer_name,
               j.employer_id
          FROM ${JT} j
     LEFT JOIN employers e ON j.employer_id = e.employer_id
      ORDER BY j.job_id DESC`
      : `SELECT j.job_id, j.j_title, j.j_type, j.j_location, j.j_description, j.j_status,
               COALESCE(j.j_salary, j.j_amount) AS j_salary,
               j.j_contact AS employer_name,
               j.employer_id
          FROM ${JT} j
      ORDER BY j.job_id DESC`;

    const [rows] = await db.promise().query(sql);
    res.json(rows.map(r => ({
      id: r.job_id,
      j_title: r.j_title || "",
      j_type: r.j_type || "",
      j_salary: r.j_salary,
      j_location: r.j_location || "",
      j_description: r.j_description || "",
      j_status: r.j_status || "open",
      employer_name: r.employer_name || "",
      employer_id: r.employer_id ?? null,
    })));
  } catch (err) {
    console.error("❌ GET /jobs fail:", err);
    res.status(500).send("โหลดงานไม่สำเร็จ");
  }
});

// POST: เพิ่มงาน (เขียนทั้ง j_salary และ j_amount)
router.post("/jobs", async (req, res) => {
  try {
    const JT = await resolveJobsTable();
    const { j_title, j_type, j_salary, j_location, j_description, employer_name, employer_id } = req.body;

    if (!j_title || !j_type || j_salary === undefined || j_salary === null) {
      return res.status(400).send("กรอกข้อมูลให้ครบ");
    }
    const pay = Number(j_salary);
    if (!Number.isFinite(pay)) return res.status(400).send("รูปแบบค่าจ้างไม่ถูกต้อง");

    const [ins] = await db.promise().execute(
      `INSERT INTO ${JT}
       (employer_id, j_title, j_description, j_type, j_salary, j_amount, j_location, j_contact)
       VALUES (?,?,?,?,?,?,?,?)`,
      [employer_id || null, j_title, j_description || null, j_type, pay, pay, j_location || null, employer_name || null]
    );

    res.status(201).json({
      id: ins.insertId,
      j_title, j_type, j_salary: pay, j_location, j_description, employer_name
    });
  } catch (err) {
    console.error("❌ POST /jobs fail:", err);
    res.status(500).send(err?.sqlMessage || "เพิ่มงานไม่สำเร็จ");
  }
});

// PUT: แก้ไขงาน (กันเขียนทับ employer_id เป็น NULL)
router.put("/jobs/:id", async (req, res) => {
  try {
    const JT = await resolveJobsTable();
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) return res.status(400).send("id ไม่ถูกต้อง");

    const { j_title, j_type, j_salary, j_location, j_description, employer_name, employer_id } = req.body;
    const pay = (j_salary === "" || j_salary == null) ? null : Number(j_salary);
    if (pay != null && !Number.isFinite(pay)) {
      return res.status(400).send("รูปแบบค่าจ้างไม่ถูกต้อง");
    }

    const [upd] = await db.promise().execute(
      `UPDATE ${JT}
          SET employer_id=COALESCE(?, employer_id),
              j_title=?,
              j_type=?,
              j_salary=?,
              j_amount=?,
              j_location=?,
              j_description=?,
              j_contact=?
        WHERE job_id=?`,
      [
        employer_id ?? null,      // ถ้า null -> ใช้ค่าเดิม (COALESCE)
        j_title || "",
        j_type || "",
        pay,
        pay,
        j_location || null,
        j_description || null,
        employer_name || null,
        id
      ]
    );

    if (upd.affectedRows === 0) return res.status(404).send("ไม่พบนงาน");
    res.json({ id, j_title, j_type, j_salary: pay, j_location, j_description, employer_name });
  } catch (err) {
    console.error("❌ PUT /jobs/:id fail:", err);
    res.status(500).send(err?.sqlMessage || "แก้งานไม่สำเร็จ");
  }
});

// DELETE: ลบงาน
router.delete("/jobs/:id", async (req, res) => {
  try {
    const JT = await resolveJobsTable();
    const id = parseInt(req.params.id, 10);
    if (!Number.isInteger(id)) return res.status(400).send("id ไม่ถูกต้อง");

    const [del] = await db.promise().execute(`DELETE FROM ${JT} WHERE job_id=?`, [id]);
    if (del.affectedRows === 0) return res.status(404).send("ไม่พบนงาน");
    res.json({ message: "ลบงานสำเร็จ" });
  } catch (err) {
    console.error("❌ DELETE /jobs/:id fail:", err);
    res.status(500).send("ลบงานไม่สำเร็จ");
  }
});

module.exports = router;
