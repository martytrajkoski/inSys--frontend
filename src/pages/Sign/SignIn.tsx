import React, { useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import bgImage from '../../../public/Logo/Asset_2.png';

const SignIn: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [resetEmail, setResetEmail] = useState<string>("");
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axiosClient.post("/auth/login", {
        email,
        password,
      });
      const token = response.data.token;
      const role = response.data.user.role_id;
      localStorage.setItem("inSys", JSON.stringify({ token,  role}));
      navigate("/");
    } catch (err: any) {
      if (err.response && err.response.status === 401) {
        setError("Invalid email or password.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleForgotPassword = async () => {
    setResetMessage(null);
    try {
      const response = await axiosClient.get("/auth/reset-password", {
        params: { email: resetEmail },
      });
      console.log(response);
      setResetMessage("Password reset instructions sent to your email.");
    } catch (err: any) {
      setResetMessage("Failed to send reset instructions. Please try again.");
    }
  };

  return (
    <div className="sign"
    style={{
    backgroundImage: `url(${bgImage})`,
  }}>
      <div className="app-name">inSys</div>

      <div className="sign-container">
        <div className="sign-info">
          <h2>Sign In</h2>
          <p>Enter your email and password to sign in</p>
        </div>

        <form onSubmit={login}>
          <input
            type="email"
            placeholder="email@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </button>
          </div>

          <button type="submit">Login</button>
          <button type="button" onClick={() => setShowModal(true)}>
            Forgot Password
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <a href="/signup" style={{ color: "#e45830" }}>
            Sign Up
          </a>
        </p>

        {error && <p className="error-message">{error}</p>}
      </div>

      {showModal && (
        <div className="forgot-password-modal-overlay">
          <div className="forgot-password-modal-content">
            <h3>Forgot Password</h3>
            <input
              type="email"
              placeholder="Enter your email"
              value={resetEmail}
              onChange={(e) => setResetEmail(e.target.value)}
            />

            <button onClick={handleForgotPassword} className="submit-button">
              Send Reset Link
            </button>
            <button
              onClick={() => {
                setShowModal(false);
                setResetMessage(null);
              }}
              className="cancel-button"
            >
              Cancel
            </button>

            {resetMessage && (
              <p
                className={`message ${
                  resetMessage.includes("instructions") ? "success" : "error"
                }`}
              >
                {resetMessage}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SignIn;
