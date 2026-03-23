import React, { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { axiosInstance } from "../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import { jwtDecode } from "jwt-decode";
import type { JwtTypes } from "../types/jwt.types";
import type { Role } from "../types/role.enums";

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [_, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const decoded = jwtDecode<JwtTypes>(token);
      localStorage.setItem("userId", String(decoded.userId));
      localStorage.setItem("email", decoded.email);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("companyId", String(decoded.companyId));
      localStorage.setItem("username", decoded.username);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Login Failed";
        toast.error(message);
      } else {
        setMessage("Something unexpected happened");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
          <p className="text-gray-500 mt-2">Please sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2
               focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Enter your username"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg
                 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition pr-10"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-600 focus:outline-none"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold
             py-2 px-4 rounded-lg transition duration-200 transform hover:scale-[1.02]"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to={"/register"}
            className="text-indigo-600 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};
