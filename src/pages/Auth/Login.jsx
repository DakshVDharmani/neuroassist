import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Brain, Mail, Lock } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const { login, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    console.log("Login attempt:", formData);

    const result = await login(formData.email, formData.password);

    console.log("Login result:", result);

    if (!result.success) {
      setErrors({ submit: result.error });
      return;
    }

    // Redirect by role
    navigate("/");
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
            AI-powered platform connecting patients and psychologists securely.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex w-full md:w-1/2 items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800 p-6">
        <motion.form
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg space-y-6"
        >
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sign in
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back to MindBridge
            </p>
          </div>

          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-3 py-2 rounded text-sm">
              {errors.submit}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-sm font-medium">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="input-field pl-10 py-2"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field pl-10 pr-10 py-2"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={authLoading}
            className="w-full btn-primary py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {authLoading ? "Loading..." : "Sign In"}
          </button>

          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="text-primary-600 hover:text-primary-500 dark:text-primary-400 font-medium"
            >
              Sign up
            </Link>
          </div>
        </motion.form>
      </div>
    </div>
  );
};

export default Login;
