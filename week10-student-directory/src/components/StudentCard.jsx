function StudentCard({ id, name, major, score, onDelete }) {
  return (
    <div className="card">
      <h3>{name}</h3>
      <p>{major}</p>
      <p>{score} · <span className={score >= 60 ? "passed" : "failed"}>{score >= 60 ? "Passed" : "Failed"}</span></p>
      <button onClick={() => onDelete(id)}>
        Delete
      </button>
    </div>
  );
}

export default StudentCard;
