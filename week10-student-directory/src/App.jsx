import { useState } from "react";
import Header from "./components/Header";
import StudentCard from "./components/StudentCard";
import AddStudentForm from "./components/AddStudentForm";
import Footer from "./components/Footer";

function App() {
  const [students, setStudents] = useState([
    { id: 1, name: "Ana", major: "IT", score: 82 },
    { id: 2, name: "Boon", major: "CS", score: 58 },
    { id: 3, name: "Chai", major: "IT", score: 74 },
    { id: 4, name: "Dara", major: "CS", score: 91 },
    { id: 5, name: "Eve", major: "IT", score: 55 }
  ]);

  const [showPassedOnly, setShowPassedOnly] = useState(false);

  function handleAddStudent(newStudent) {
    setStudents([...students, newStudent]);
  }

  function handleDeleteStudent(id) {
    setStudents(students.filter((student) => student.id !== id));
  }

  const visibleStudents = showPassedOnly
    ? students.filter((student) => student.score >= 60)
    : students;

  return (
    <div className="page">
      <Header />
      <AddStudentForm onAdd={handleAddStudent} />
      
      <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <p style={{ margin: 0 }}>Current number of students: {students.length}</p>
        <button onClick={() => setShowPassedOnly(!showPassedOnly)}>
          {showPassedOnly ? "Show All" : "Show Passed Only"}
        </button>
      </div>

      <main className="student-grid">
        {visibleStudents.map((student) => (
          <StudentCard
            key={student.id}
            id={student.id}
            name={student.name}
            major={student.major}
            score={student.score}
            onDelete={handleDeleteStudent}
          />
        ))}
      </main>

      <Footer count={students.length} />
    </div>
  );
}

export default App;
