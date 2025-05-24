import React, { useEffect, useState } from "react";
import axiosClient from "../../axiosClient/axiosClient";
import type { RoleType } from "../../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const Signup: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [roles, setRoles] = useState<RoleType[]>([]);
  const [role, setRole] = useState<number>();
  const navigate = useNavigate();

  const signup = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axiosClient.post("/register", {
        name: name,
        role_id: role,
        email: email,
        password: password,
        password_confirmation: confirmPassword,
      });

      if (response.status === 201) {
        const token = response.data.token;
        localStorage.setItem("inSys", token);
        console.log("User created and Logged in");
        navigate("/");
      }
    } catch (error: any) {
      console.error("Signup error:", error.response?.data || error.message);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosClient.get("/roles");

      if (response.status === 201) {
        setRoles(response.data.roles);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return (
    <div className="sign">
      <h1 className="app-name">App Name</h1>
      <div className="sign-container">
        <div className="sign-info">
          <h2>Create an account</h2>
          <p>Enter your email to sign up for this app</p>
        </div>
        <form onSubmit={signup}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
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

          <div className="password-input-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password..."
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

          <select
            value={role}
            onChange={(e) => setRole(Number(e.target.value))}
            required
          >
            <option value="" disabled selected>
              Choose your role
            </option>
            {roles.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
