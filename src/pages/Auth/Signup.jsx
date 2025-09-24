import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Brain, Mail, Lock, User, UserCheck } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Signup = () => {
  const { signup, authLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    const result = await signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    });
    if (!result.success) {
      setErrors({ submit: result.error });
      return;
    }
    navigate("/login");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row">
      {/* Left branding */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-primary-600 to-accent-600 text-white p-8">
        <div className="max-w-sm text-center">
          <Brain className="w-20 h-20 mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-3">MindBridge</h2>
          <p className="text-base opacity-90">
            Empowering patients and psychologists with AI mental health tools.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6 space-y-4"
        >
          <h1 className="text-2xl md:text-3xl font-bold">Create your account</h1>

          {errors.submit && (
            <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm">
              {errors.submit}
            </div>
          )}

          <input
            name="name"
            type="text"
            placeholder="Full Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="input-field w-full"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="input-field w-full"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="input-field w-full"
          >
            <option value="patient">Patient</option>
            <option value="psychologist">Psychologist</option>
          </select>

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
              className="input-field w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <div className="relative">
            <input
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field w-full pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 text-gray-400"
            >
              {showConfirmPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
          )}

          <button
            type="submit"
            disabled={authLoading}
            className="btn-primary w-full py-2 disabled:opacity-50"
          >
            {authLoading ? "Creating..." : "Sign Up"}
          </button>

          <div className="text-sm text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-primary-600 font-medium">
              Sign in
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Signup;
