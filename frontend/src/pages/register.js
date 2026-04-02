import React, { useState } from "react";
import axios from "axios";

function Register({ setUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    if (!name || !email || !password) {
      alert("Fill all fields");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/register",
        { name, email, password }
      );

      alert("Registered successfully!");

      // auto login after register
      setUser(res.data);

    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Register</h2>

      <input
        placeholder="Username"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <button onClick={register}>Register</button>
    </div>
  );
}

export default Register;