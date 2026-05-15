import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCoffee,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        "https://simulation2-production-7983.up.railway.app/api/Auth/login",
        {
          email: formData.email,
          password: formData.password,
        }
      );

      const data = response.data;

      localStorage.setItem(
        "accessToken",
        data.accessToken
      );

      localStorage.setItem(
        "refreshToken",
        data.refreshToken
      );
      localStorage.setItem(
        "user",
        JSON.stringify({
          userId: data.userId,
          fullName: data.fullName,
          email: data.email,
          role: data.role,
        })
      );

      toast.success("Login successful");

      navigate("/");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Login failed"
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
          <span>Welcome Back</span>
        </div>

        <p className="auth-subtitle">
          Sign in to enjoy your perfect brew
        </p>

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
            />
          </div>

          <div className="auth-field">
            <FaLock className="auth-field-icon" />

            <input
              type={
                showPassword ? "text" : "password"
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
                setShowPassword(!showPassword)
              }
            >
              {showPassword ? (
                <FaEyeSlash />
              ) : (
                <FaEye />
              )}
            </button>
          </div>

          <div className="auth-options">
            <label className="auth-remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <a
              href="#"
              className="auth-forgot"
            >
              Forgot password?
            </a>
          </div>

          <button
            type="button"
            className="auth-btn"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : "Sign In"}
          </button>
        </div>

        {/* Footer */}
        <p className="auth-switch">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="auth-link"
          >
            Create one
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

export default Login;