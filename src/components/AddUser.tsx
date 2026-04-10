import React, { useState } from "react";
import {
  X,
  User,
  Mail,
  Briefcase,
  Key,
  Check,
  Eye,
  EyeOff,
} from "lucide-react";

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddUser: React.FC<AddUserProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Employee",
  });

  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    role?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (submitSuccess) setSubmitSuccess(false);
    if (submitError) setSubmitError("");
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const { username, email, password, confirmPassword, role } = formData;

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!role) {
      newErrors.role = "Please select a role";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };
      console.log("User registered:", userData);
      setSubmitSuccess(true);
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "Employee",
      });
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
      }, 1500);
    } catch (err) {
      setSubmitError("Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>

          {/* Header with linera accent */}
          <div className="relative overflow-hidden rounded-t-2xl">
            <div className="absolute top-0 left-0 w-full h-1 bg-linera-to-r from-blue-500 to-indigo-600" />
            <div className="px-6 pt-6 pb-2 text-center">
              <h2 className="text-2xl font-bold bg-linera-to-r from-gray-800 to-gray-700 bg-clip-text text-transparent">
                Create new account
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Fill in the details to add a team member
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 pt-2 space-y-5">
            {/* Username field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Username
              </label>
              <div
                className={`flex items-center bg-gray-50 border rounded-xl transition-all duration-200 focus-within:ring-2 ${
                  errors.username
                    ? "border-red-300 focus-within:ring-red-100"
                    : "border-gray-200 focus-within:border-blue-400 focus-within:ring-blue-100"
                }`}
              >
                <User size={18} className="ml-3 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="johndoe"
                  className="w-full py-2.5 px-3 bg-transparent text-gray-800 text-sm outline-none"
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                  {errors.username}
                </p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Email address
              </label>
              <div
                className={`flex items-center bg-gray-50 border rounded-xl transition-all duration-200 focus-within:ring-2 ${
                  errors.email
                    ? "border-red-300 focus-within:ring-red-100"
                    : "border-gray-200 focus-within:border-blue-400 focus-within:ring-blue-100"
                }`}
              >
                <Mail size={18} className="ml-3 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="hello@example.com"
                  className="w-full py-2.5 px-3 bg-transparent text-gray-800 text-sm outline-none"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Role dropdown */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Role
              </label>
              <div
                className={`flex items-center bg-gray-50 border rounded-xl transition-all duration-200 focus-within:ring-2 ${
                  errors.role
                    ? "border-red-300 focus-within:ring-red-100"
                    : "border-gray-200 focus-within:border-blue-400 focus-within:ring-blue-100"
                }`}
              >
                <Briefcase size={18} className="ml-3 text-gray-400" />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full py-2.5 px-3 bg-transparent text-gray-800 text-sm outline-none appearance-none"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%239CA3AF' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                    backgroundPosition: "right 0.75rem center",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "1.25rem",
                  }}
                >
                  <option value="HR">HR</option>
                  <option value="DepartmentHead">Department Head</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              {errors.role && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                  {errors.role}
                </p>
              )}
            </div>

            {/* Password field with toggle */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <div
                className={`flex items-center bg-gray-50 border rounded-xl transition-all duration-200 focus-within:ring-2 ${
                  errors.password
                    ? "border-red-300 focus-within:ring-red-100"
                    : "border-gray-200 focus-within:border-blue-400 focus-within:ring-blue-100"
                }`}
              >
                <Key size={18} className="ml-3 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full py-2.5 px-3 bg-transparent text-gray-800 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm password field */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Confirm password
              </label>
              <div
                className={`flex items-center bg-gray-50 border rounded-xl transition-all duration-200 focus-within:ring-2 ${
                  errors.confirmPassword
                    ? "border-red-300 focus-within:ring-red-100"
                    : "border-gray-200 focus-within:border-blue-400 focus-within:ring-blue-100"
                }`}
              >
                <Check size={18} className="ml-3 text-gray-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full py-2.5 px-3 bg-transparent text-gray-800 text-sm outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span className="inline-block w-1 h-1 bg-red-500 rounded-full" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Submit button with loading state */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-2 bg-linera-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transform active:scale-[0.98]"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </div>
              ) : (
                "Register"
              )}
            </button>

            {/* Success / error messages */}
            {submitSuccess && (
              <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-center text-sm font-medium border border-emerald-200">
                <span className="inline-flex items-center gap-2">
                  <Check size={16} />
                  Account created successfully! Redirecting...
                </span>
              </div>
            )}
            {submitError && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-xl text-center text-sm font-medium border border-red-200">
                {submitError}
              </div>
            )}
          </form>

          {/* Footer with terms */}
          <div className="px-6 pb-6 pt-2 text-center">
            <p className="text-xs text-gray-400">
              By registering, you agree to our{" "}
              <button
                type="button"
                className="text-blue-500 hover:underline focus:outline-none"
              >
                Terms of Service
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-blue-500 hover:underline focus:outline-none"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
