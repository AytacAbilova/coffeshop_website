import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCoffee,
} from "react-icons/fa";
import "./Login.css";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="auth-page">
      {/* Background */}
      <div className="auth-bg">
        <div className="auth-bg-overlay" />
        <div className="auth-bg-pattern" />
      </div>

      {/* Card */}
      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <FaCoffee className="auth-logo-icon" />
          <span className="auth-logo-text">Caffé</span>
        </div>

        <div className="auth-divider">
          <span>Welcome Back</span>
        </div>

        <p className="auth-subtitle">Sign in to enjoy your perfect brew</p>

        {/* Form */}
        <div className="auth-form">
          <div className="auth-field">
            <FaEnvelope className="auth-field-icon" />
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
              autoComplete="email"
            />
          </div>

          <div className="auth-field">
            <FaLock className="auth-field-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="auth-input"
              autoComplete="current-password"
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <div className="auth-options">
            <label className="auth-remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#" className="auth-forgot">
              Forgot password?
            </a>
          </div>

          <button type="button" className="auth-btn">
            Sign In
          </button>
        </div>

        <p className="auth-switch">
          Don't have an account?{" "}
          <Link to="/register" className="auth-link">
            Create one
          </Link>
        </p>

        <Link to="/" className="auth-back">
          ← Back to Home
        </Link>
      </div>

      <style>{`
        
      `}</style>
    </div>
  );
};

export default Login;
