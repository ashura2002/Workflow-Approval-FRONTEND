import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";

interface UserProfileFormData {
  firstname: string;
  lastname: string;
  age: number | "";
  address: string;
  contactNumber: string;
}

export const AdminProfilepage: React.FC = () => {
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
  const [role, _] = useState<string | null>(localStorage.getItem("role"));

  const getProfile = async () => {
    try {
      setIsLoadingProfile(true);
      const res = await axiosInstance.get("/profile/current-profile");
      setProfile(res.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status !== 404) {
        toast.error(error?.response?.data?.message || "Failed to load profile");
      }
      setProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

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

  const handleDeleteProfile = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your profile? This action cannot be undone.",
    );
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete("/profile");
      toast.success("Profile deleted successfully");
      setProfile(null);
      resetForm();
      setIsEditing(false);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Deletion failed");
      } else {
        toast.error("An unexpected error occurred");
      }
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

  // Loading state
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-500 font-medium">
            Loading {role} profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/40 to-purple-50/30 p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Animated Header - Light Admin Theme */}
        <div className="mb-10 text-center md:text-left animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 backdrop-blur-sm text-indigo-700 text-xs font-semibold mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {role} Portal
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent tracking-tight">
            {profile && !isEditing
              ? `${role} Profile`
              : isEditing
                ? "Edit Profile"
                : `Complete Your ${role} Profile`}
          </h1>
          <p className="text-slate-500 mt-3 max-w-md mx-auto md:mx-0">
            {profile && !isEditing
              ? "Manage and review your personal details"
              : isEditing
                ? "Update your information below"
                : "Tell us about yourself to get started"}
          </p>
        </div>

        {/* Main Card */}
        <div className="group relative animate-fade-in">
          {/* Decorative linear orbs - light theme */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

          <div className="relative bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden transition-all duration-300 hover:shadow-indigo-100/20">
            {!profile || isEditing ? (
              // Form for Create or Edit
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-7">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
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
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white/90 text-slate-800 transition-all duration-200 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 hover:border-indigo-300"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
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
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white/90 text-slate-800 transition-all duration-200 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 hover:border-indigo-300"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>

                {/* Age & Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
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
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white/90 text-slate-800 transition-all duration-200 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 hover:border-indigo-300"
                      placeholder="Your age"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
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
                      className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white/90 text-slate-800 transition-all duration-200 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 hover:border-indigo-300"
                      placeholder="+63 912 345 6789"
                      required
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
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
                    className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white/90 text-slate-800 transition-all duration-200 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 hover:border-indigo-300 resize-none"
                    placeholder="Enter your complete address"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3.5 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 text-white font-semibold text-lg shadow-lg transition-all duration-300 hover:shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-3">
                        <svg
                          className="w-5 h-5 animate-spin"
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
                      className="px-6 py-3.5 rounded-xl border-2 border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition-all duration-200"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            ) : (
              // Profile Display with Edit & Delete Buttons
              <div className="p-6 md:p-8">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200/80">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      Admin Profile Details
                    </h2>
                    <p className="text-slate-500 text-sm mt-1">
                      Your personal information is securely stored
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={startEditing}
                      className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition flex items-center gap-2 text-sm font-medium"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={handleDeleteProfile}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition flex items-center gap-2 text-sm font-medium"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50/80 rounded-xl p-4 transition-all duration-200 hover:bg-white hover:shadow-md">
                      <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                        First Name
                      </label>
                      <p className="text-lg font-medium text-slate-800 mt-1">
                        {profile.firstname}
                      </p>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-4 transition-all duration-200 hover:bg-white hover:shadow-md">
                      <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                        Last Name
                      </label>
                      <p className="text-lg font-medium text-slate-800 mt-1">
                        {profile.lastname}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50/80 rounded-xl p-4 transition-all duration-200 hover:bg-white hover:shadow-md">
                      <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                        Age
                      </label>
                      <p className="text-lg font-medium text-slate-800 mt-1">
                        {profile.age} years
                      </p>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-4 transition-all duration-200 hover:bg-white hover:shadow-md">
                      <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                        Contact Number
                      </label>
                      <p className="text-lg font-medium text-slate-800 mt-1">
                        {profile.contactNumber}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 rounded-xl p-4 transition-all duration-200 hover:bg-white hover:shadow-md">
                    <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                      Address
                    </label>
                    <p className="text-lg font-medium text-slate-800 mt-1">
                      {profile.address || "Not provided"}
                    </p>
                  </div>
                </div>

                {/* Action hint */}
                <div className="mt-8 pt-4 text-center text-sm text-slate-400 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
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

      {/* Custom Animations */}
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fade-in-up 0.5s ease-out forwards;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};
