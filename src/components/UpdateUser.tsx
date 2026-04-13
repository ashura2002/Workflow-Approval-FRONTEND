import React, { useEffect, useState } from "react";
import { X, User, Lock, ShieldCheck } from "lucide-react";

interface UpdateUserProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    username: string;
    password: string;
    role: string;
  }) => void;
  initialData?: {
    username: string;
    role: string;
  };
}

export const UpdateUser: React.FC<UpdateUserProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    username: initialData?.username || "",
    password: "",
    role: initialData?.role || "",
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        username: initialData.username,
        password: "",
        role: initialData.role,
      });
    }
  }, [initialData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">Update User</h2>
            <p className="text-sm text-gray-500">
              Modify user details and role
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <User size={16} className="text-gray-500" />
              Username
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <User size={16} className="text-gray-400 mr-2" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full text-sm outline-none"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Lock size={16} className="text-gray-500" />
              Password
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <Lock size={16} className="text-gray-400 mr-2" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full text-sm outline-none"
                placeholder="Password"
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <ShieldCheck size={16} className="text-gray-500" />
              Role
            </label>
            <div className="flex items-center border border-gray-200 rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
              <ShieldCheck size={16} className="text-gray-400 mr-2" />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full text-sm bg-transparent outline-none"
                required
              >
                <option value="">Select role</option>
                <option value="Admin">Admin</option>
                <option value="Employee">Employee</option>
                <option value="HR">HR</option>
                <option value="DepartmentHead">Department Head</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition flex items-center gap-2"
            >
              <ShieldCheck size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
