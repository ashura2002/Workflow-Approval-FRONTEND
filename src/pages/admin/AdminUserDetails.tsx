import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Mail,
  Briefcase,
  Building,
  IdCard,
  Calendar,
  Phone,
  MapPin,
  AlertCircle,
} from "lucide-react";

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
  userId?: number;
  user?: User;
}

// Skeleton Loader Component
const SkeletonCard: React.FC<{ title: string }> = ({}) => (
  <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden animate-pulse">
    <div className="p-5 sm:p-6 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <div className="h-7 bg-slate-200 rounded w-40 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-32"></div>
        </div>
        <div className="h-6 w-20 bg-slate-200 rounded-full"></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-50/80 rounded-xl p-4">
            <div className="h-3 bg-slate-200 rounded w-20 mb-2"></div>
            <div className="h-6 bg-slate-200 rounded w-32"></div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const AdminUserDetails: React.FC<AdminUserDetailsProps> = ({
  userId,
  user: propUser,
}) => {
  const [user, setUser] = useState<User | null>(propUser || null);
  const [isLoading, setIsLoading] = useState(!propUser);
  const [error, setError] = useState<string | null>(null);
  const param = useParams();
  const { id } = param;
  const navigate = useNavigate();

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
      setIsLoading(false);
      return;
    }
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
        const msg =
          err.response?.data?.message || "Failed to load user details";
        setError(msg);
        toast.error(msg);
      } else {
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/40 to-purple-50/30 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="h-8 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
          </div>
          <div className="space-y-6">
            <SkeletonCard title="Account Information" />
            <SkeletonCard title="Profile Information" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/40 to-purple-50/30 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-red-200 p-6 sm:p-8 text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">
            User Not Found
          </h3>
          <p className="text-slate-500 text-sm sm:text-base">
            {error || "No user data available"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors"
          >
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-100 via-indigo-50/40 to-purple-50/30 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6 sm:mb-8 animate-fade-in-up">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors mb-4 group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-medium">Back</span>
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/50 backdrop-blur-sm text-indigo-700 text-xs font-semibold mb-3 sm:mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            User Management
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-800 via-indigo-800 to-purple-800 bg-clip-text text-transparent tracking-tight">
            User Details
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-1 sm:mt-2">
            View complete information about {user.username}
          </p>
        </div>

        <div className="space-y-5 sm:space-y-6">
          {/* Account Information Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <div className="p-5 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                    Account Information
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Basic user details and status
                  </p>
                </div>
                <div
                  className={`self-start sm:self-center px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                    user.isActive
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-rose-100 text-rose-700"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4">
                  <label className="text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                    <User size={12} /> Username
                  </label>
                  <p className="text-base sm:text-lg font-medium text-slate-800 mt-1 break-all">
                    {user.username}
                  </p>
                </div>
                <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4">
                  <label className="text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                    <Mail size={12} /> Email
                  </label>
                  <p className="text-base sm:text-lg font-medium text-slate-800 mt-1 break-all">
                    {user.email}
                  </p>
                </div>
                <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4">
                  <label className="text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                    <Briefcase size={12} /> Role
                  </label>
                  <p className="text-base sm:text-lg font-medium text-slate-800 mt-1">
                    <span className="inline-flex items-center gap-1">
                      {user.role}
                    </span>
                  </p>
                </div>
                <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4">
                  <label className="text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                    <Building size={12} /> Company ID
                  </label>
                  <p className="text-base sm:text-lg font-medium text-slate-800 mt-1">
                    {user.companyId}
                  </p>
                </div>
                <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4">
                  <label className="text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                    <IdCard size={12} /> User ID
                  </label>
                  <p className="text-base sm:text-lg font-medium text-slate-800 mt-1">
                    #{user.id}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Information Card */}
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <div className="p-5 sm:p-6 md:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-800">
                    Profile Information
                  </h2>
                  <p className="text-slate-500 text-xs sm:text-sm">
                    Personal details of the user
                  </p>
                </div>
                {!user.profile && (
                  <div className="self-start sm:self-center px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs sm:text-sm font-medium">
                    Profile Missing
                  </div>
                )}
              </div>

              {user.profile ? (
                <div className="space-y-5 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4">
                      <label className="text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                        First Name
                      </label>
                      <p className="text-base sm:text-lg font-medium text-slate-800 mt-1 break-all">
                        {user.profile.firstname}
                      </p>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4">
                      <label className="text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider">
                        Last Name
                      </label>
                      <p className="text-base sm:text-lg font-medium text-slate-800 mt-1 break-all">
                        {user.profile.lastname}
                      </p>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4">
                      <label className="text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={12} /> Age
                      </label>
                      <p className="text-base sm:text-lg font-medium text-slate-800 mt-1">
                        {user.profile.age} years
                      </p>
                    </div>
                    <div className="bg-slate-50/80 rounded-xl p-3 sm:p-4">
                      <label className="text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                        <Phone size={12} /> Contact Number
                      </label>
                      <p className="text-base sm:text-lg font-medium text-slate-800 mt-1 break-all">
                        {user.profile.contactNumber}
                      </p>
                    </div>
                    <div className="sm:col-span-2 bg-slate-50/80 rounded-xl p-3 sm:p-4">
                      <label className="text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider flex items-center gap-1">
                        <MapPin size={12} /> Address
                      </label>
                      <p className="text-base sm:text-lg font-medium text-slate-800 mt-1 wrap-break-words">
                        {user.profile.address || "Not provided"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 text-[10px] sm:text-xs text-slate-400 border-t border-slate-100">
                    Profile ID: {user.profile.id} • Linked to User ID:{" "}
                    {user.profile.userId}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">📝</div>
                  <h3 className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
                    No Profile Created Yet
                  </h3>
                  <p className="text-slate-500 text-sm sm:text-base max-w-md mx-auto px-4">
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
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up {
            animation: none;
            opacity: 1;
            transform: none;
          }
          .animate-ping {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};
