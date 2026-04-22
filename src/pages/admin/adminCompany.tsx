import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import type { CompanyType } from "../../types/Company.types";
import { Pen, Trash2Icon, Building2, Users, AlertCircle, X } from "lucide-react";

// Confirmation Modal Component
const ConfirmDeleteModal: React.FC<{
  isOpen: boolean;
  companyName: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}> = ({ isOpen, companyName, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all animate-fade-in-up">
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-rose-100">
              <Trash2Icon className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">Delete Company</h3>
          </div>
          <p className="text-slate-600 text-sm sm:text-base mb-2">
            Are you sure you want to delete <strong>{companyName}</strong>?
          </p>
          <p className="text-xs sm:text-sm text-rose-600 font-medium mb-5 sm:mb-6">
            Warning: All users associated with this company will also be deleted. This action cannot be undone.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl bg-linear-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete Company"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loader for Company Card
const CompanySkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden animate-pulse">
    <div className="p-5 sm:p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
        <div className="h-8 bg-slate-200 rounded w-48"></div>
      </div>
      <div className="mb-6">
        <div className="h-3 bg-slate-200 rounded w-20 mb-2"></div>
        <div className="h-20 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="mb-6">
        <div className="h-3 bg-slate-200 rounded w-16 mb-2"></div>
        <div className="h-12 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="border-t border-slate-200 pt-6">
        <div className="flex justify-between items-center">
          <div className="h-3 bg-slate-200 rounded w-24"></div>
          <div className="h-8 bg-slate-200 rounded w-32"></div>
        </div>
      </div>
    </div>
  </div>
);

export const AdminCompany: React.FC = () => {
  const [usersLength, setUsersLength] = useState<number>(0);
  const [role] = useState<string | null>(localStorage.getItem("role"));
  const [companyId] = useState<string | null>(localStorage.getItem("companyId"));
  const [company, setCompany] = useState<CompanyType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [fetchError, setFetchError] = useState<string>("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
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
        toast.error(error?.response?.data?.message || "Update failed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDelete = async () => {
    if (!company?.id) return;
    setIsDeleting(true);
    try {
      const res = await axiosInstance.delete(`/company/${company.id}`);
      toast.success(res.data.message || "Company deleted successfully");
      // Optionally redirect or clear state
      setCompany(undefined);
      closeDeleteModal();
      // You could navigate away, e.g., to a "no company" page
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message || "Delete failed");
      } else {
        toast.error("Something went wrong");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    const fetchUsersCount = async () => {
      try {
        const res = await axiosInstance.get("/users/own-company");
        setUsersLength(res.data.length);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(error?.response?.data?.message || "Failed to load users count");
        }
      }
    };
    fetchUsersCount();
  }, []);

  useEffect(() => {
    const getCompany = async () => {
      setIsFetching(true);
      setFetchError("");
      try {
        const res = await axiosInstance.get("/company");
        setCompany(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const msg = error?.response?.data?.message || "Failed to load company";
          setFetchError(msg);
          toast.error(msg);
        } else {
          setFetchError("An unexpected error occurred");
          toast.error("An unexpected error occurred");
        }
      } finally {
        setIsFetching(false);
      }
    };
    getCompany();
  }, []);

  // Loading state
  if (isFetching) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="h-8 w-40 bg-slate-200 rounded-lg animate-pulse"></div>
            <div className="h-4 w-48 bg-slate-200 rounded mt-2 animate-pulse"></div>
          </div>
          <CompanySkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (fetchError || !company) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-red-200 p-6 sm:p-8 text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">
            Company Not Found
          </h3>
          <p className="text-slate-500 text-sm sm:text-base">
            {fetchError || "No company data available"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 animate-fade-in-up">
          <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
            Company Details
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1">
            Overview of your company information
          </p>
        </div>

        {/* Company Information Card */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-indigo-200 overflow-hidden">
          <div className="p-5 sm:p-6 md:p-8">
            {/* Company Name with icon */}
            <div className="flex items-center gap-3 mb-5 sm:mb-6 flex-wrap">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md shrink-0">
                <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-800 wrap-break-words">
                {company.companyName}
              </h2>
            </div>

            {/* Description */}
            <div className="mb-5 sm:mb-6">
              <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100 text-sm sm:text-base">
                {company.description}
              </p>
            </div>

            {/* Tagline */}
            <div className="mb-5 sm:mb-6">
              <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-2">
                Tagline
              </h3>
              <p className="text-slate-600 italic bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100 text-sm sm:text-base">
                "{company.tagline}"
              </p>
            </div>

            {/* Total Users */}
            <div className="border-t border-slate-200 pt-5 sm:pt-6 mb-5 sm:mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
                  <Users size={14} /> Total Users
                </h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold text-indigo-600">
                    {usersLength}
                  </span>
                  <span className="text-slate-500 text-xs sm:text-sm">employees</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {role === "Admin" && (
              <div className="border-t border-slate-200 pt-5 sm:pt-6 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleEdit}
                  className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300 transform hover:scale-105"
                >
                  <Pen size={18} /> Edit Company
                </button>
                <button
                  onClick={openDeleteModal}
                  className="flex items-center justify-center gap-2 px-4 py-2 sm:px-6 sm:py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-300 transform hover:scale-105"
                >
                  <Trash2Icon size={18} /> Delete Company
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Edit Company Modal - Responsive */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-auto animate-fade-in-up">
              <div className="border-b border-slate-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-800">
                    Edit Company
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Update your company information
                  </p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1 rounded-full hover:bg-slate-100 transition-colors"
                >
                  <X size={20} className="text-slate-500" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="Enter company name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
                    placeholder="Enter company description"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 sm:px-4 sm:py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm sm:text-base"
                    placeholder="Enter company tagline"
                    required
                  />
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-medium text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-300 text-white rounded-xl transition-colors font-medium shadow-sm text-sm flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={deleteModalOpen}
          companyName={company.companyName}
          onConfirm={handleDelete}
          onCancel={closeDeleteModal}
          isDeleting={isDeleting}
        />
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};