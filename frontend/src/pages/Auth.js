import React, { useState } from "react";
import axios from "axios";
import "./Auth.css";

function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    try {
      if (isLogin) {
        const res = await axios.post(
          "http://localhost:5000/api/auth/login",
          { email, password }
        );

        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);

      } else {
        await axios.post(
          "http://localhost:5000/api/auth/register",
          { name, email, password }
        );

        alert("Registered! Please login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data || "Error");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {!isLogin && (
          <input
            placeholder="Username"
            onChange={(e) => setName(e.target.value)}
          />
        )}

        <input
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="auth-btn" onClick={handleAuth}>
          {isLogin ? "Login" : "Register"}
        </button>

        <div className="toggle-text">
          {isLogin ? "Don't have account?" : "Already have account?"}
          <button
            className="toggle-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? " Register" : " Login"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Auth;