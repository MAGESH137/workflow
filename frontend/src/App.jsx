import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/sample")
      .then((res) => res.json())
      .then((data) => setMessage(data.message));
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h1>React + Node.js Fullstack App</h1>
      <h3>Backend says: {message}</h3>
    </div>
  );
}

export default App;
