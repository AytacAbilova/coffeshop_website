import { useState } from "react";
import { Link } from "react-router-dom";
import "./Register.css"
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCoffee,
} from "react-icons/fa";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const passwordStrength = () => {
    const p = formData.password;
    if (!p) return 0;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = passwordStrength();
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "#e05c5c", "#e0a03c", "#8bc48a", "#5aaa7a"];

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-overlay" />
        <div className="auth-bg-pattern" />
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <FaCoffee className="auth-logo-icon" />
          <span className="auth-logo-text">Caffé</span>
        </div>

        <div className="auth-divider">
          <span>Create Account</span>
        </div>

        <p className="auth-subtitle">
          Join us for an unforgettable coffee experience
        </p>

        <div className="auth-form">
          {/* Name */}
          <div className="auth-field">
            <FaUser className="auth-field-icon" />
            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              className="auth-input"
              autoComplete="name"
            />
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <div className="auth-field">
              <FaLock className="auth-field-icon" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {/* Strength bar */}
            {formData.password && (
              <div className="strength-wrap">
                <div className="strength-bars">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="strength-bar"
                      style={{
                        background:
                          i <= strength
                            ? strengthColors[strength]
                            : "rgba(255,255,255,0.08)",
                        transition: "background 0.3s",
                      }}
                    />
                  ))}
                </div>
                <span
                  className="strength-label"
                  style={{ color: strengthColors[strength] }}
                >
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="auth-field">
            <FaLock className="auth-field-icon" />
            <input
              type={showConfirm ? "text" : "password"}
              name="confirm"
              placeholder="Confirm password"
              value={formData.confirm}
              onChange={handleChange}
              className={`auth-input ${
                formData.confirm && formData.password !== formData.confirm
                  ? "input-error"
                  : formData.confirm && formData.password === formData.confirm
                    ? "input-success"
                    : ""
              }`}
              autoComplete="new-password"
            />
            <button
              type="button"
              className="auth-eye-btn"
              onClick={() => setShowConfirm(!showConfirm)}
              aria-label="Toggle confirm password"
            >
              {showConfirm ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {formData.confirm && formData.password !== formData.confirm && (
            <p className="field-error">Passwords do not match</p>
          )}

          {/* Terms */}
          <label className="auth-terms">
            <input type="checkbox" />
            <span>
              I agree to the{" "}
              <a href="#" className="auth-link">
                Terms of Service
              </a>{" "}
              &amp;{" "}
              <a href="#" className="auth-link">
                Privacy Policy
              </a>
            </span>
          </label>

          <button type="button" className="auth-btn">
            Create Account
          </button>
        </div>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in
          </Link>
        </p>

        <Link to="/" className="auth-back">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Register;
