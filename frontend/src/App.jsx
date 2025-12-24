import { useEffect, useState } from "react";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    // When running via docker-compose, "backend" is the service name
    // and is resolvable as a hostname on the Docker network.
    fetch("http://backend:5000/api/sample")
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
