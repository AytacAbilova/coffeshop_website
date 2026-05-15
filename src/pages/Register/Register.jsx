import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCoffee,
} from "react-icons/fa";

import { toast } from "react-toastify";

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleChange = (e) =>
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

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

  const strengthLabels = [
    "",
    "Weak",
    "Fair",
    "Good",
    "Strong",
  ];

  const strengthColors = [
    "",
    "#e05c5c",
    "#e0a03c",
    "#8bc48a",
    "#5aaa7a",
  ];

  const handleSubmit = async () => {
    try {
      if (
        formData.password !== formData.confirm
      ) {
        toast.error(
          "Passwords do not match"
        );
        return;
      }

      setLoading(true);

      const response = await axios.post(
        "https://simulation2-production-7983.up.railway.app/api/Auth/register",
        {
          fullName: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      const data = response.data;

      // ACCESS TOKEN
      localStorage.setItem(
        "accessToken",
        data.accessToken
      );

      // REFRESH TOKEN
      localStorage.setItem(
        "refreshToken",
        data.refreshToken
      );

      // USER
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        })
      );

      toast.success(
        "Account created successfully"
      );

      navigate("/");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Register failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-overlay" />
        <div className="auth-bg-pattern" />
      </div>

      <div className="auth-card">
        <div className="auth-logo">
          <FaCoffee className="auth-logo-icon" />

          <span className="auth-logo-text">
            Caffé
          </span>
        </div>

        <div className="auth-divider">
          <span>Create Account</span>
        </div>

        <p className="auth-subtitle">
          Join us for an unforgettable
          coffee experience
        </p>

        <div className="auth-form">
          {/* NAME */}
          <div className="auth-field">
            <FaUser className="auth-field-icon" />

            <input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              className="auth-input"
            />
          </div>

          {/* EMAIL */}
          <div className="auth-field">
            <FaEnvelope className="auth-field-icon" />

            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={formData.email}
              onChange={handleChange}
              className="auth-input"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <div className="auth-field">
              <FaLock className="auth-field-icon" />

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
              />

              <button
                type="button"
                className="auth-eye-btn"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                {showPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>

            {/* STRENGTH */}
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
                            ? strengthColors[
                                strength
                              ]
                            : "rgba(255,255,255,0.08)",
                      }}
                    />
                  ))}
                </div>

                <span
                  className="strength-label"
                  style={{
                    color:
                      strengthColors[
                        strength
                      ],
                  }}
                >
                  {
                    strengthLabels[
                      strength
                    ]
                  }
                </span>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="auth-field">
            <FaLock className="auth-field-icon" />

            <input
              type={
                showConfirm
                  ? "text"
                  : "password"
              }
              name="confirm"
              placeholder="Confirm password"
              value={formData.confirm}
              onChange={handleChange}
              className={`auth-input ${
                formData.confirm &&
                formData.password !==
                  formData.confirm
                  ? "input-error"
                  : formData.confirm &&
                      formData.password ===
                        formData.confirm
                    ? "input-success"
                    : ""
              }`}
            />

            <button
              type="button"
              className="auth-eye-btn"
              onClick={() =>
                setShowConfirm(
                  !showConfirm
                )
              }
            >
              {showConfirm ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>

          {formData.confirm &&
            formData.password !==
              formData.confirm && (
              <p className="field-error">
                Passwords do not match
              </p>
            )}

          {/* TERMS */}
          <label className="auth-terms">
            <input type="checkbox" />

            <span>
              I agree to the{" "}
              <a
                href="#"
                className="auth-link"
              >
                Terms of Service
              </a>{" "}
              &amp;{" "}
              <a
                href="#"
                className="auth-link"
              >
                Privacy Policy
              </a>
            </span>
          </label>

          {/* BUTTON */}
          <button
            type="button"
            className="auth-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Create Account"}
          </button>
        </div>

        <p className="auth-switch">
          Already have an account?{" "}
          <Link
            to="/login"
            className="auth-link"
          >
            Sign in
          </Link>
        </p>

        <Link
          to="/"
          className="auth-back"
        >
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default Register;