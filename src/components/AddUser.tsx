import React, { useState, useEffect, useRef, useContext } from "react";
import {
  X,
  User,
  Mail,
  Key,
  Check,
  Eye,
  EyeOff,
  UserPlus,
  Info,
  ChevronDown,
} from "lucide-react";
import { axiosInstance } from "../utils/axiosInstance";
import toast from "react-hot-toast";
import { userContext } from "../context/UserContext";
import axios from "axios";

interface AddUserProps {
  isOpen: boolean;
  onClose: () => void;
}

type Role = "Employee" | "DepartmentHead" | "HR";

const ROLE_LABELS: Record<Role, string> = {
  Employee: "Employee",
  DepartmentHead: "Department Head",
  HR: "HR",
};

const ROLE_ENDPOINTS: Record<Role, string> = {
  Employee: "/auth/register-employee",
  DepartmentHead: "/auth/register-departmentHead",
  HR: "/auth/register-hr",
};

interface RegisterUserDTO {
  username: string;
  email: string;
  password: string;
}

export const AddUser: React.FC<AddUserProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState<RegisterUserDTO>({
    username: "",
    email: "",
    password: "",
  });
  const context = useContext(userContext);
  if (!context) return <div>Loading...</div>;
  const { setUsers } = context;
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<Role>("Employee");

  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstInput =
        modalRef.current.querySelector<HTMLElement>("input, select");
      firstInput?.focus();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
      if (errors.confirmPassword)
        setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name as keyof typeof errors])
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (submitSuccess) setSubmitSuccess(false);
    if (submitError) setSubmitError("");
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    const { username, email, password } = formData;

    if (!username.trim()) newErrors.username = "Required";
    else if (username.length < 3) newErrors.username = "Min 3 characters";
    else if (username.length > 20) newErrors.username = "Max 20 characters";

    if (!email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Invalid email";

    if (!password) newErrors.password = "Required";
    else if (password.length < 6) newErrors.password = "Min 6 characters";
    else if (password.length > 50) newErrors.password = "Max 50 characters";

    if (!confirmPassword) newErrors.confirmPassword = "Required";
    else if (password !== confirmPassword)
      newErrors.confirmPassword = "Passwords don't match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const endpoint = ROLE_ENDPOINTS[selectedRole];
      const response = await axiosInstance.post(endpoint, formData);
      const newUser = response.data.data;
      console.log("newUser", newUser);
      setUsers((prev) => [...prev, newUser]);
      toast.success(response.data.message);
      setSubmitSuccess(true);
      setFormData({ username: "", email: "", password: "" });
      setConfirmPassword("");
      setSelectedRole("Employee");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        let message = err?.response?.data?.message;
        toast.error(message);
        setSubmitError(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const fieldClass = (name: string) =>
    [
      "flex items-center gap-2 h-9 px-3 rounded-lg border transition-all duration-150 bg-white",
      errors[name as keyof typeof errors]
        ? "border-red-300 ring-2 ring-red-100"
        : focusedField === name
          ? "border-zinc-400 ring-2 ring-zinc-100"
          : "border-zinc-200 hover:border-zinc-300",
    ].join(" ");

  const iconClass = (name: string) =>
    errors[name as keyof typeof errors]
      ? "text-red-400"
      : focusedField === name
        ? "text-zinc-600"
        : "text-zinc-400";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div
          ref={modalRef}
          className="relative w-full max-w-110  bg-white rounded-2xl border border-zinc-200 shadow-xl"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          {/* Header */}
          <div className="flex items-start gap-3 px-5 pt-5 pb-4">
            <div className="w-9 h-9 rounded-lg border border-zinc-200 bg-zinc-50 flex items-center justify-center shrink-0">
              <UserPlus size={16} className="text-zinc-500" />
            </div>
            <div className="flex-1 min-w-0">
              <h2
                id="modal-title"
                className="text-[15px] font-semibold text-zinc-900 leading-snug"
              >
                Add team member
              </h2>
              <p className="text-[13px] text-zinc-500 mt-0.5">
                Create a new account for your workspace
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-zinc-200 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-50 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-300"
              aria-label="Close"
            >
              <X size={14} />
            </button>
          </div>

          <div className="h-px bg-zinc-100 mx-5" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-5 pt-4 pb-4 space-y-3">
            {/* Role selector — controls endpoint only, not included in DTO */}
            <div className="space-y-1.5">
              <label className="block text-[12px] font-medium text-zinc-600">
                Role
              </label>
              <div
                className={[
                  "flex items-center gap-2 h-9 px-3 rounded-lg border transition-all duration-150 bg-white",
                  focusedField === "role"
                    ? "border-zinc-400 ring-2 ring-zinc-100"
                    : "border-zinc-200 hover:border-zinc-300",
                ].join(" ")}
              >
                <ChevronDown size={14} className="text-zinc-400 shrink-0" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as Role)}
                  onFocus={() => setFocusedField("role")}
                  onBlur={() => setFocusedField(null)}
                  className="w-full text-[13px] text-zinc-800 bg-transparent outline-none appearance-none cursor-pointer"
                >
                  {(Object.keys(ROLE_LABELS) as Role[]).map((role) => (
                    <option key={role} value={role}>
                      {ROLE_LABELS[role]}
                    </option>
                  ))}
                </select>
              </div>
              <p className="text-[11px] text-zinc-400">
                Selects the registration endpoint — not sent in the request
                body.
              </p>
            </div>

            <div className="h-px bg-zinc-100" />

            {/* Row: Username + Email */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[12px] font-medium text-zinc-600">
                  Username
                </label>
                <div className={fieldClass("username")}>
                  <User
                    size={14}
                    className={`shrink-0 ${iconClass("username")}`}
                  />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="johndoe"
                    className="w-full text-[13px] text-zinc-800 placeholder-zinc-300 bg-transparent outline-none"
                    aria-invalid={!!errors.username}
                  />
                </div>
                {errors.username && (
                  <p className="text-[11px] text-red-500">{errors.username}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[12px] font-medium text-zinc-600">
                  Email address
                </label>
                <div className={fieldClass("email")}>
                  <Mail
                    size={14}
                    className={`shrink-0 ${iconClass("email")}`}
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="hello@example.com"
                    className="w-full text-[13px] text-zinc-800 placeholder-zinc-300 bg-transparent outline-none"
                    aria-invalid={!!errors.email}
                  />
                </div>
                {errors.email && (
                  <p className="text-[11px] text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Row: Password + Confirm */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-[12px] font-medium text-zinc-600">
                  Password
                </label>
                <div className={fieldClass("password")}>
                  <Key
                    size={14}
                    className={`shrink-0 ${iconClass("password")}`}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••"
                    className="w-full text-[13px] text-zinc-800 placeholder-zinc-300 bg-transparent outline-none"
                    aria-invalid={!!errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="shrink-0 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[11px] text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="block text-[12px] font-medium text-zinc-600">
                  Confirm password
                </label>
                <div className={fieldClass("confirmPassword")}>
                  <Check
                    size={14}
                    className={`shrink-0 ${iconClass("confirmPassword")}`}
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="••••••"
                    className="w-full text-[13px] text-zinc-800 placeholder-zinc-300 bg-transparent outline-none"
                    aria-invalid={!!errors.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="shrink-0 text-zinc-400 hover:text-zinc-600 transition-colors focus:outline-none"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={13} />
                    ) : (
                      <Eye size={13} />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-[11px] text-red-500">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>

            {/* Hint */}
            <div className="flex items-start gap-2 px-3 py-2.5 bg-zinc-50 rounded-lg border border-zinc-100">
              <Info size={13} className="text-zinc-400 mt-0.5 shrink-0" />
              <p className="text-[12px] text-zinc-500 leading-relaxed">
                Password must be 6–50 characters. The new user will receive an
                invite email upon registration.
              </p>
            </div>

            {/* Feedback */}
            {submitSuccess && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <Check size={13} className="text-emerald-600 shrink-0" />
                <p className="text-[12px] text-emerald-700 font-medium">
                  Account created successfully!
                </p>
              </div>
            )}
            {submitError && (
              <div className="px-3 py-2.5 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-[12px] text-red-600">{submitError}</p>
              </div>
            )}
          </form>

          <div className="h-px bg-zinc-100 mx-5" />

          {/* Footer */}
          <div className="flex items-center justify-between px-5 py-3.5">
            <p className="text-[11px] text-zinc-400">
              <button
                type="button"
                className="hover:text-zinc-600 hover:underline focus:outline-none transition-colors"
              >
                Terms
              </button>{" "}
              ·{" "}
              <button
                type="button"
                className="hover:text-zinc-600 hover:underline focus:outline-none transition-colors"
              >
                Privacy
              </button>
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-8 px-3.5 text-[13px] text-zinc-600 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-8 px-4 text-[13px] font-medium text-white bg-zinc-900 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-1"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-1.5">
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating…
                  </span>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// STUDY how it works and types, Record Object
