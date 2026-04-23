import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";
import {
  RefreshCw,
  AlertCircle,
  Trash2,
  Edit,
  User,
  Phone,
  MapPin,
  Calendar,
} from "lucide-react";

interface UserProfileFormData {
  firstname: string;
  lastname: string;
  age: number | "";
  address: string;
  contactNumber: string;
}

// Confirmation Modal Component
const ConfirmDeleteModal: React.FC<{
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}> = ({ isOpen, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all animate-fade-in-up">
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-red-100">
              <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">
              Delete Profile
            </h3>
          </div>
          <p className="text-slate-600 text-sm sm:text-base mb-2">
            Are you sure you want to delete your profile?
          </p>
          <p className="text-xs sm:text-sm text-red-600 font-medium mb-5 sm:mb-6">
            This action cannot be undone. All your personal information will be
            permanently removed.
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
              className="px-4 py-2 rounded-xl bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isDeleting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                "Yes, Delete Profile"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loader
const ProfileSkeleton: React.FC = () => (
  <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden animate-pulse">
    <div className="p-5 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-200/80">
        <div>
          <div className="h-7 bg-slate-200 rounded w-40 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-64"></div>
        </div>
        <div className="flex gap-3">
          <div className="h-9 w-20 bg-slate-200 rounded-xl"></div>
          <div className="h-9 w-20 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
      <div className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-24 bg-slate-200 rounded-xl"></div>
          <div className="h-24 bg-slate-200 rounded-xl"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-24 bg-slate-200 rounded-xl"></div>
          <div className="h-24 bg-slate-200 rounded-xl"></div>
        </div>
        <div className="h-28 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  </div>
);

export const EmployeeUserProfileForm: React.FC = () => {
  const [formData, setFormData] = useState<UserProfileFormData>({
    firstname: "",
    lastname: "",
    age: "",
    address: "",
    contactNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState<UserProfileFormData | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string>("");

  const getProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true);
      setError("");
      const res = await axiosInstance.get("/profile/current-profile");
      setProfile(res.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status !== 404) {
        const msg = error?.response?.data?.message || "Failed to load profile";
        setError(msg);
        toast.error(msg);
      }
      setProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, []);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const resetForm = () => {
    setFormData({
      firstname: "",
      lastname: "",
      age: "",
      address: "",
      contactNumber: "",
    });
  };

  const startEditing = () => {
    if (profile) {
      setFormData({
        firstname: profile.firstname,
        lastname: profile.lastname,
        age: profile.age,
        address: profile.address,
        contactNumber: profile.contactNumber,
      });
      setIsEditing(true);
    }
  };

  const cancelEditing = () => {
    setIsEditing(false);
    resetForm();
  };

  const handleCreateProfile = async () => {
    const response = await axiosInstance.post("/profile", formData);
    return response;
  };

  const handleUpdateProfile = async () => {
    const response = await axiosInstance.patch("/profile", formData);
    return response;
  };

  const openDeleteModal = () => {
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
  };

  const handleDeleteProfile = async () => {
    setIsDeleting(true);
    try {
      await axiosInstance.delete("/profile");
      toast.success("Profile deleted successfully");
      setProfile(null);
      resetForm();
      setIsEditing(false);
      closeDeleteModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Deletion failed");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (!formData.firstname.trim()) {
      toast.error("First name is required");
      setIsSubmitting(false);
      return;
    }
    if (!formData.lastname.trim()) {
      toast.error("Last name is required");
      setIsSubmitting(false);
      return;
    }
    if (formData.age === "" || formData.age < 18) {
      toast.error("Age must be 18 or older");
      setIsSubmitting(false);
      return;
    }
    if (!formData.contactNumber.trim()) {
      toast.error("Contact number is required");
      setIsSubmitting(false);
      return;
    }

    try {
      if (isEditing) {
        await handleUpdateProfile();
        toast.success("Profile updated successfully");
        setIsEditing(false);
      } else {
        await handleCreateProfile();
        toast.success("Profile saved successfully");
      }
      await getProfile();
      resetForm();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Submission failed";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state with skeleton
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/40 to-purple-50/30 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8 text-center md:text-left">
            <div className="h-6 w-32 bg-slate-200 rounded-full animate-pulse mx-auto md:mx-0 mb-4"></div>
            <div className="h-10 bg-slate-200 rounded w-64 mx-auto md:mx-0 mb-3"></div>
            <div className="h-4 bg-slate-200 rounded w-48 mx-auto md:mx-0"></div>
          </div>
          <ProfileSkeleton />
        </div>
      </div>
    );
  }

  // Error state (only for actual errors, not "profile not found")
  if (error && !profile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/40 to-purple-50/30 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-red-200 p-6 sm:p-8 text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">
            Failed to Load Profile
          </h3>
          <p className="text-slate-500 text-sm sm:text-base mb-6">{error}</p>
          <button
            onClick={() => getProfile()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw size={18} />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/40 to-purple-50/30 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Animated Header */}
        <div className="mb-6 sm:mb-8 md:mb-10 text-center md:text-left animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 backdrop-blur-sm text-indigo-700 text-xs font-semibold mb-3 sm:mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Personal Information
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-linear-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent tracking-tight">
            {profile && !isEditing
              ? "Your Profile"
              : isEditing
                ? "Edit Profile"
                : "Complete Your Profile"}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2 sm:mt-3 max-w-md mx-auto md:mx-0">
            {profile && !isEditing
              ? "Manage and review your personal details"
              : isEditing
                ? "Update your information below"
                : "Tell us about yourself to get started"}
          </p>
        </div>

        {/* Main Card */}
        <div className="group relative animate-fade-in">
          {/* Decorative blobs - hidden on small screens for performance */}
          <div className="hidden sm:block absolute -top-10 -right-10 w-40 h-40 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="hidden sm:block absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-white/50 overflow-hidden transition-all duration-300 hover:shadow-indigo-100/20">
            {!profile || isEditing ? (
              // Form for Create or Edit
              <form
                onSubmit={handleSubmit}
                className="p-5 sm:p-6 md:p-8 space-y-5 sm:space-y-6 md:space-y-7"
              >
                {/* Name Fields - stack on mobile, side by side on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex flex-wrap items-center gap-2">
                      First Name
                      <span className="text-xs font-normal text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    </label>
                    <input
                      type="text"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl border-2 border-slate-200 bg-white/90 text-slate-800 transition-all duration-200 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 hover:border-indigo-300 text-sm sm:text-base"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex flex-wrap items-center gap-2">
                      Last Name
                      <span className="text-xs font-normal text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    </label>
                    <input
                      type="text"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl border-2 border-slate-200 bg-white/90 text-slate-800 transition-all duration-200 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 hover:border-indigo-300 text-sm sm:text-base"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                {/* Age & Contact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex flex-wrap items-center gap-2">
                      Age
                      <span className="text-xs font-normal text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                        18+ Required
                      </span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="18"
                      max="120"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl border-2 border-slate-200 bg-white/90 text-slate-800 transition-all duration-200 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 hover:border-indigo-300 text-sm sm:text-base"
                      placeholder="Your age"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex flex-wrap items-center gap-2">
                      Contact Number
                      <span className="text-xs font-normal text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl border-2 border-slate-200 bg-white/90 text-slate-800 transition-all duration-200 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 hover:border-indigo-300 text-sm sm:text-base"
                      placeholder="+63 912 345 6789"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-1.5 sm:space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex flex-wrap items-center gap-2">
                    Address
                    <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                      Optional
                    </span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl border-2 border-slate-200 bg-white/90 text-slate-800 transition-all duration-200 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 hover:border-indigo-300 resize-none text-sm sm:text-base"
                    placeholder="Enter your complete address"
                  />
                </div>

                {/* Action Buttons - stacked on mobile, row on larger */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-base sm:text-lg shadow-lg transition-all duration-300 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2 sm:gap-3">
                        <svg
                          className="w-4 h-4 sm:w-5 sm:h-5 animate-spin"
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
                        {isEditing ? "Updating..." : "Saving..."}
                      </span>
                    ) : isEditing ? (
                      "Update Profile"
                    ) : (
                      "Create Profile"
                    )}
                  </button>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={cancelEditing}
                      className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3.5 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all duration-200 text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              // Profile Display with Edit & Delete Buttons
              <div className="p-5 sm:p-6 md:p-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-4 border-b border-slate-200/80">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                      Profile Details
                    </h2>
                    <p className="text-slate-500 text-xs sm:text-sm mt-1">
                      Your personal information is securely stored
                    </p>
                  </div>
                  <div className="flex gap-3 self-start sm:self-center">
                    <button
                      onClick={startEditing}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium"
                    >
                      <Edit size={16} />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={openDeleteModal}
                      className="px-3 py-1.5 sm:px-4 sm:py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium"
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:bg-white hover:shadow-md">
                      <label className="text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                        <User size={12} /> First Name
                      </label>
                      <p className="text-base sm:text-lg font-medium text-slate-800 mt-1 wrap-break-word">
                        {profile.firstname}
                      </p>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:bg-white hover:shadow-md">
                      <label className="text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                        <User size={12} /> Last Name
                      </label>
                      <p className="text-base sm:text-lg font-medium text-slate-800 mt-1 wrap-break-word">
                        {profile.lastname}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:bg-white hover:shadow-md">
                      <label className="text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={12} /> Age
                      </label>
                      <p className="text-base sm:text-lg font-medium text-slate-800 mt-1">
                        {profile.age} years
                      </p>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:bg-white hover:shadow-md">
                      <label className="text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                        <Phone size={12} /> Contact Number
                      </label>
                      <p className="text-base sm:text-lg font-medium text-slate-800 mt-1 wrap-break-word">
                        {profile.contactNumber}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4 transition-all duration-200 hover:bg-white hover:shadow-md">
                    <label className="text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                      <MapPin size={12} /> Address
                    </label>
                    <p className="text-base sm:text-lg font-medium text-slate-800 mt-1 wrap-break-word">
                      {profile.address || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Action hint */}
                <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 text-center text-xs sm:text-sm text-slate-400 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1">
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Click Edit to modify your information
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onConfirm={handleDeleteProfile}
        onCancel={closeDeleteModal}
        isDeleting={isDeleting}
      />

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-fade-in { animation: fade-in-up 0.5s ease-out forwards; }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up, .animate-fade-in, .animate-blob {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>
    </div>
  );
};
