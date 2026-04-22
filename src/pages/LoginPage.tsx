import React, { useState } from "react";
import { FiEye, FiEyeOff, FiUser, FiLock } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import type { JwtTypes } from "../types/jwt.types";
import { useAuth } from "../context/AuthContext";

export const LoginPage: React.FC = () => {
  const auth = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [_, setMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axiosInstance.post("/auth/login", {
        username: formData.username,
        password: formData.password,
      });
      toast.success(res.data.message || "Login Successfully!");
      setFormData({
        username: "",
        password: "",
      });
      const token = res.data.data;
      auth.login(token);
      const decoded = jwtDecode<JwtTypes>(token);
      if (
        decoded.role === "Admin" ||
        decoded.role === "HR" ||
        decoded.role === "DepartmentHead"
      ) {
        navigate("/admin-homepage");
      } else {
        navigate("/employee-homepage");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Login Failed";
        toast.error(message);
      } else {
        setMessage("Something unexpected happened");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4 sm:p-6">
      {/* Animated background blobs - responsive blur and opacity */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 sm:opacity-30 animate-blob will-change-transform"></div>
        <div className="absolute -bottom-40 -left-40 w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 sm:opacity-30 animate-blob animation-delay-2000 will-change-transform"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 sm:w-80 md:w-96 h-72 sm:h-80 md:h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-2xl sm:blur-3xl opacity-20 sm:opacity-30 animate-blob animation-delay-4000 will-change-transform"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-0 md:gap-8 items-center bg-white/80 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-gray-100/50">
          {/* Left side - Branding (hidden on mobile, shown on md+) */}
          <div className="hidden md:flex flex-col items-center justify-center p-8 lg:p-12 bg-linear-to-br from-indigo-600 to-purple-700 text-white">
            <div className="text-center">
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 lg:w-20 lg:h-20 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <svg
                    className="w-10 h-10 lg:w-12 lg:h-12 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M20 7l-8-4-8 4 8 4 8-4zM4 7v8l8 4 8-4V7"
                    ></path>
                  </svg>
                </div>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold mb-4">
                Welcome Back!
              </h2>
              <p className="text-indigo-100 mb-6 lg:mb-8 text-sm lg:text-base">
                Sign in to access your personalized dashboard and manage your
                workflow efficiently.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-xs lg:text-sm bg-white/10 rounded-lg p-3">
                  <FiUser className="shrink-0" />
                  <span>Secure employee portal</span>
                </div>
                <div className="flex items-center space-x-3 text-xs lg:text-sm bg-white/10 rounded-lg p-3">
                  <FiLock className="shrink-0" />
                  <span>Role‑based access control</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login Form */}
          <div className="p-6 sm:p-8 md:p-10 lg:p-12">
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Sign In
              </h1>
              <p className="text-gray-500 text-sm sm:text-base mt-2">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-3 py-3 sm:py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 text-base"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-10 py-3 sm:py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 text-base"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-indigo-600 focus:outline-none transition-colors"
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 sm:py-2.5 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] focus:ring-2 focus:ring-indigo-500/40 focus:outline-none shadow-md disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 text-base"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Log in"
                )}
              </button>
            </form>

            <p className="text-center text-sm text-gray-500 mt-6 sm:mt-8">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
              >
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Custom keyframes - can be moved to global CSS or tailwind.config.js */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .will-change-transform {
          will-change: transform;
        }
      `}</style>
    </div>
  );
};
