import React, { useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import { useNavigate } from "react-router-dom";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error

    try {
      const response = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("inSys", token);

      // Redirect to dashboard or home page
      navigate("/dashboard");
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="sign">
      <div className="app-name">App Name</div>

      <div className="sign-container">
        <div className="sign-info">
          <h2>Sign In</h2>
          <p>Enter your email and password to sign in for this app</p>
        </div>

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="email@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        <p>
          Don't have an account?{" "}
          <a href="/signup" style={{ color: "blue" }}>
            Sign Up
          </a>
        </p>
        
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </div>
    </div>
  );
};

export default SignIn;
