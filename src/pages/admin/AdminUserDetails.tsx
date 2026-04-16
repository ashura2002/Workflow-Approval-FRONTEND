import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";
import { useParams } from "react-router-dom";

interface Profile {
  id: number;
  firstname: string;
  lastname: string;
  age: number;
  address: string;
  contactNumber: string;
  userId: number;
}

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  companyId: number;
  isActive: boolean;
  profile: Profile | null;
}

interface AdminUserDetailsProps {
  userId?: number; // optionally fetch by ID, or pass user object directly
  user?: User;
}

export const AdminUserDetails: React.FC<AdminUserDetailsProps> = ({
  userId,
  user: propUser,
}) => {
  const [user, setUser] = useState<User | null>(propUser || null);
  const [isLoading, setIsLoading] = useState(!propUser);
  const [error, setError] = useState<string | null>(null);
  const param = useParams();
  const { id } = param;

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
      setIsLoading(false);
      return;
    }
    // Fetch from route param (id) or from userId prop
    if (id || userId) {
      fetchUserDetails();
    } else {
      setIsLoading(false);
    }
  }, [id, userId, propUser]);

  const fetchUserDetails = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/users/details/${id}`);
      setUser(response.data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Failed to load user details");
        toast.error("Failed to load user details");
      } else {
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-4 text-slate-500 font-medium">
            Loading user details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-red-200 p-8 text-center max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            User Not Found
          </h3>
          <p className="text-slate-500">{error || "No user data available"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/40 to-purple-50/30 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 backdrop-blur-sm text-indigo-700 text-xs font-semibold mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            User Management
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent tracking-tight">
            User Details
          </h1>
          <p className="text-slate-500 mt-2">
            View complete information about {user.username}
          </p>
        </div>

        <div className="space-y-6">
          {/* User Information Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Account Information
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Basic user details and status
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${user.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50/80 rounded-xl p-4">
                  <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                    Username
                  </label>
                  <p className="text-lg font-medium text-slate-800 mt-1">
                    {user.username}
                  </p>
                </div>
                <div className="bg-slate-50/80 rounded-xl p-4">
                  <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                    Email
                  </label>
                  <p className="text-lg font-medium text-slate-800 mt-1">
                    {user.email}
                  </p>
                </div>
                <div className="bg-slate-50/80 rounded-xl p-4">
                  <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                    Role
                  </label>
                  <p className="text-lg font-medium text-slate-800 mt-1">
                    <span className="inline-flex items-center gap-1">
                      {user.role === "Admin" ? "👑" : "👤"} {user.role}
                    </span>
                  </p>
                </div>
                <div className="bg-slate-50/80 rounded-xl p-4">
                  <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                    Company ID
                  </label>
                  <p className="text-lg font-medium text-slate-800 mt-1">
                    {user.companyId}
                  </p>
                </div>
                <div className="bg-slate-50/80 rounded-xl p-4">
                  <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                    User ID
                  </label>
                  <p className="text-lg font-medium text-slate-800 mt-1">
                    #{user.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Profile Information
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Personal details of the user
                  </p>
                </div>
                {!user.profile && (
                  <div className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                    Profile Missing
                  </div>
                )}
              </div>

              {user.profile ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50/80 rounded-xl p-4">
                      <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                        First Name
                      </label>
                      <p className="text-lg font-medium text-slate-800 mt-1">
                        {user.profile.firstname}
                      </p>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-4">
                      <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                        Last Name
                      </label>
                      <p className="text-lg font-medium text-slate-800 mt-1">
                        {user.profile.lastname}
                      </p>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-4">
                      <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                        Age
                      </label>
                      <p className="text-lg font-medium text-slate-800 mt-1">
                        {user.profile.age} years
                      </p>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-4">
                      <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                        Contact Number
                      </label>
                      <p className="text-lg font-medium text-slate-800 mt-1">
                        {user.profile.contactNumber}
                      </p>
                    </div>
                    <div className="md:col-span-2 bg-slate-50/80 rounded-xl p-4">
                      <label className="text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                        Address
                      </label>
                      <p className="text-lg font-medium text-slate-800 mt-1">
                        {user.profile.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pt-2 text-xs text-slate-400 border-t border-slate-100">
                    Profile ID: {user.profile.id} • Linked to User ID:{" "}
                    {user.profile.userId}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-5xl mb-4">📝</div>
                  <h3 className="text-xl font-semibold text-slate-700 mb-2">
                    No Profile Created Yet
                  </h3>
                  <p className="text-slate-500 max-w-md mx-auto">
                    This user hasn't completed their profile information. They
                    can fill in their personal details from their account
                    settings.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};
