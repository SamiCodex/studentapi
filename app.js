const express = require("express");
const students = require("./students.json");
const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send(`
<h1>Student API in Express</h1>
<p>Welcome to the Student API.</p>
<h3>Available Routes:</h3>
<ul>
<li>GET /api/students</li>
<li>GET /api/students/:id</li>
<li>GET /api/students?major=IT</li>
<li>POST /api/students</li>
<li>PUT /api/students/:id</li>
<li>DELETE /api/students/:id</li>
</ul>
`);
});

app.get("/api/students", (req, res) => {
  const major = req.query.major;

  if (major) {
    const filteredStudents = students.filter(
      (student) => student.major.toLowerCase() === String(major).toLowerCase()
    );
    return res.json(filteredStudents);
  }

  return res.json(students);
});

app.get("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const student = students.find((s) => s.id === id);

  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  return res.json(student);
});

app.post("/api/students", (req, res) => {
  const { name, major } = req.body || {};

  if (!name || !major) {
    return res.status(400).json({ error: "Name and major are required" });
  }

  const newStudent = {
    id: students.length ? Math.max(...students.map((student) => student.id)) + 1 : 1,
    name,
    major,
  };

  students.push(newStudent);
  return res.status(201).json(newStudent);
});

app.put("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((student) => student.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Student not found" });
  }

  const student = students[index];
  const updatedStudent = {
    ...student,
    name: req.body?.name || student.name,
    major: req.body?.major || student.major,
  };

  students[index] = updatedStudent;
  return res.json(updatedStudent);
});

app.delete("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((student) => student.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Student not found" });
  }

  students.splice(index, 1);
  return res.json({ message: "Student deleted successfully" });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Running on http://localhost:${PORT}`);
  });
}

module.exports = app;
