import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Register from "./Register";
import Login from "./Login";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "20px", backgroundColor: "#f0f0f0" }}>
        <Link to="/register" style={{ marginRight: "20px" }}>Register</Link>
        <Link to="/login">Login</Link>
      </nav>
      <div style={{ padding: "20px" }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<h2>Welcome! Please Register or Login</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;