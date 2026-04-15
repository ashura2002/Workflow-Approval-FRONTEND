import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import type { CompanyType } from "../../types/Company.types";
import { Pen, Trash2Icon } from "lucide-react";

export const AdminCompany: React.FC = () => {
  const [usersLength, setUsersLength] = useState<number>();
  const [role, _] = useState<string | null>(localStorage.getItem("role"));
  const [companyId, __] = useState<string | null>(
    localStorage.getItem("companyId"),
  );
  const [company, setCompany] = useState<CompanyType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    tagline: "",
  });

  const handleEdit = () => {
    if (company) {
      setFormData({
        companyName: company.companyName || "",
        description: company.description || "",
        tagline: company.tagline || "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      companyName: "",
      description: "",
      tagline: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.patch(`/company/${companyId}`, formData);
      setCompany((prev) =>
        prev
          ? {
              ...prev,
              companyName: formData.companyName,
              description: formData.description,
              tagline: formData.tagline,
            }
          : prev,
      );
      toast.success("Company updated successfully");
      handleCloseModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this company all users will also deleted?",
      )
    ) {
      alert("Company deleted");
    }
    try {
      const res = await axiosInstance.delete(`/company/${company?.id}`);
      toast.success(res.data.message);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  useEffect(() => {
    const usersOnCompany = async () => {
      try {
        const res = await axiosInstance.get("/users/own-company");
        setUsersLength(res.data.length);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          let message = error?.response?.data?.message;
          toast.error(message);
        }
      }
    };
    usersOnCompany();
  }, []);

  useEffect(() => {
    const getCompany = async () => {
      try {
        const res = await axiosInstance.get("/company");
        setCompany(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          let message = error?.response?.data?.message;
          toast.error(message);
        }
      }
    };

    getCompany();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
            Company Details
          </h1>
          <p className="text-slate-500 mt-1">
            Overview of your company information
          </p>
        </div>

        {/* Company Information Card */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-indigo-200 overflow-hidden">
          <div className="p-6 md:p-8">
            {/* Company Name with icon */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800">
                {company?.companyName}
              </h2>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {company?.description}
              </p>
            </div>

            {/* Tagline */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
                Tagline
              </h3>
              <p className="text-slate-600 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                "{company?.tagline}"
              </p>
            </div>

            {/* Total Users */}
            <div className="border-t border-slate-200 pt-6 mb-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Total Users
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-indigo-600">
                    {usersLength}
                  </span>
                  <span className="text-slate-500 text-sm">employees</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {role === "Admin" && (
              <div className="border-t border-slate-200 pt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 cursor-pointer text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300 transform hover:scale-105"
                >
                  <Pen size={20} /> Edit Company
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 cursor-pointer text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-300 transform hover:scale-105"
                >
                  <Trash2Icon size={20} /> Delete Company
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Edit Company Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto animate-in fade-in zoom-in duration-200">
              {/* Modal Header */}
              <div className="border-b border-slate-200 px-6 py-4">
                <h2 className="text-xl font-bold text-slate-800">
                  Edit Company
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Update your company information
                </p>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter company name"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    placeholder="Enter company description"
                    required
                  />
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="Enter company tagline"
                    required
                  />
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-xl transition-colors font-medium shadow-sm"
                  >
                    {isLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
