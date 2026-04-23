import React, { useEffect, useState, useCallback } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import type { CompanyType } from "../../types/Company.types";
import {
  RefreshCw,
  AlertCircle,
  Building2,
  Info,
  Calendar,
} from "lucide-react";

// Skeleton Loader
const CompanySkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden animate-pulse">
    <div className="flex flex-col md:flex-row">
      {/* Left sidebar skeleton */}
      <div className="md:w-1/3 bg-slate-50 p-6 flex flex-col items-center text-center">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-slate-200 mb-4"></div>
        <div className="w-12 h-0.5 bg-slate-200 my-3"></div>
        <div className="h-3 bg-slate-200 rounded w-16"></div>
      </div>
      {/* Right content skeleton */}
      <div className="md:w-2/3 p-5 sm:p-6 md:p-8 space-y-4">
        <div className="h-7 bg-slate-200 rounded w-40 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-32"></div>
        <div className="space-y-2">
          <div className="h-3 bg-slate-200 rounded w-20"></div>
          <div className="h-20 bg-slate-100 rounded-xl"></div>
        </div>
        <div className="h-4 bg-slate-200 rounded w-32"></div>
      </div>
    </div>
  </div>
);

export const EmployeeCompany: React.FC = () => {
  const [company, setCompany] = useState<CompanyType>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchCompany = useCallback(async (showToast = false) => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/company");
      setCompany(res.data);
      if (showToast) toast.success("Company info refreshed");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg =
          error?.response?.data?.message || "Failed to load company details";
        setError(msg);
        if (showToast) toast.error(msg);
      } else {
        setError("An unexpected error occurred");
        if (showToast) toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompany();
  }, [fetchCompany]);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchCompany(true);
    setRefreshing(false);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 p-4 sm:p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <div className="h-8 w-40 bg-slate-200 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <CompanySkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (error || !company) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-red-200 p-6 sm:p-8 text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">
            Company Not Found
          </h3>
          <p className="text-slate-500 text-sm sm:text-base mb-6">
            {error || "Unable to load company information"}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={refreshData}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <RefreshCw size={16} />
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with refresh button */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
              Company Profile
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              View your organization details
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="self-start sm:self-center p-2 rounded-full bg-white/80 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
            aria-label="Refresh company info"
          >
            <RefreshCw
              className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
            />
          </button>
        </div>

        {/* Company Card - Responsive */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-slate-200">
          <div className="flex flex-col md:flex-row">
            {/* Left sidebar - accent + logo */}
            <div className="md:w-1/3 bg-linear-to-b from-indigo-50 to-white p-5 sm:p-6 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md mb-3 sm:mb-4">
                <span className="text-white text-2xl sm:text-3xl font-bold">
                  {company.companyName?.charAt(0).toUpperCase() || "C"}
                </span>
              </div>
              <div className="w-10 h-0.5 sm:w-12 bg-indigo-200 my-2 sm:my-3"></div>
              <p className="text-[10px] sm:text-xs text-indigo-500 font-medium uppercase tracking-wider">
                Est. {new Date().getFullYear()}
              </p>
            </div>

            {/* Right content - company details */}
            <div className="md:w-2/3 p-5 sm:p-6 md:p-8">
              <div className="mb-4 sm:mb-5">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-800 mb-1 wrap-break-word">
                  {company.companyName}
                </h2>
                {company.tagline && (
                  <p className="text-indigo-500 text-sm italic wrap-break-word">
                    "{company.tagline}"
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {/* Description */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                    <h3 className="text-[10px] sm:text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                      About
                    </h3>
                  </div>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed bg-slate-50 p-3 sm:p-4 rounded-xl border border-slate-100 wrap-break-word">
                    {company.description}
                  </p>
                </div>

                {/* Optional metadata row */}
                <div className="flex flex-wrap gap-3 sm:gap-4 pt-2">
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500">
                    <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                    <span>ID: {company.id || "—"}</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-400" />
                    <span>Founded: {new Date().getFullYear()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
