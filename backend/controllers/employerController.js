// controllers/employerController.js
exports.getJobsByEmployer = async (req, res) => {
  const employerId = req.params.id;
  const [rows] = await db.promise().query('SELECT * FROM jobs WHERE employer_id = ?', [employerId]);
  res.json(rows);
};