import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { RequestData } from "../../types/RequestData.types";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import { RefreshCw, AlertCircle, ArrowLeft, Calendar, FileText, User, Building, Clock } from "lucide-react";

// Skeleton component
const SkeletonField: React.FC = () => (
  <div className="animate-pulse">
    <div className="h-3 bg-slate-200 rounded w-20 mb-2"></div>
    <div className="h-11 bg-slate-100 rounded-xl"></div>
  </div>
);

export const EmployeeRequestInfo: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RequestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const fetchRequestDetails = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get(`/requests/${id}`);
      setRequest(res.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message || "Request not found";
        setError(msg);
        toast.error(msg);
      } else {
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      }
      setRequest(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchRequestDetails();
  }, [fetchRequestDetails]);

  const getStatusIcon = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "approved") {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    if (s === "rejected") {
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0 1 1 0 012 0zM9.576 6.474a.75.75 0 00-1.498.058l.026 1.001h-.032a.75.75 0 00-.75.75v.009a.75.75 0 00.75.75h.032l-.026 1a.75.75 0 101.498-.058l.026-1.001h.032a.75.75 0 00.75-.75v-.009a.75.75 0 00-.75-.75h-.032l.026-1z" clipRule="evenodd" />
      </svg>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const ReadOnlyField = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
  }) => (
    <div className="group">
      <label className="block text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1.5 sm:mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 group-hover:text-indigo-500 transition-colors">
            {icon}
          </div>
        )}
        <input
          type="text"
          value={value}
          readOnly
          className={`w-full ${icon ? "pl-9 sm:pl-10" : "px-3 sm:px-4"} py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 font-medium cursor-default transition-all duration-200 group-hover:border-indigo-300 group-hover:shadow-sm focus:outline-none text-sm sm:text-base`}
        />
      </div>
    </div>
  );

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 p-4 sm:p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="h-8 w-40 bg-slate-200 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200/50 overflow-hidden animate-pulse">
            <div className="h-24 bg-slate-200"></div>
            <div className="p-5 sm:p-6 md:p-8 space-y-6">
              <div className="space-y-4">
                <div className="h-6 bg-slate-200 rounded w-32"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SkeletonField />
                  <SkeletonField />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-slate-200 rounded w-32"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SkeletonField />
                  <SkeletonField />
                </div>
              </div>
              <div className="space-y-4">
                <div className="h-6 bg-slate-200 rounded w-32"></div>
                <div className="h-24 bg-slate-100 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !request) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-red-200 p-6 sm:p-8 text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">
            Request Not Found
          </h3>
          <p className="text-slate-500 text-sm sm:text-base mb-6">
            {error || "The request you're looking for doesn't exist or you don't have access."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors font-medium text-sm"
            >
              Go Back
            </button>
            <button
              onClick={fetchRequestDetails}
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

  const statusColors = {
    Approved: "from-emerald-500 to-green-500",
    Rejected: "from-rose-500 to-red-500",
    Pending: "from-amber-500 to-yellow-500",
  };
  const statusLinear = statusColors[request.status as keyof typeof statusColors] || "from-indigo-600 to-purple-600";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 p-4 sm:p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
              Request Details
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Review your leave request submission
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="self-start sm:self-center inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white border border-slate-200 transition-all duration-200 font-medium text-sm hover:shadow-md hover:border-indigo-200"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>

        {/* Main Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200/50 overflow-hidden">
          {/* Status Header Bar */}
          <div className={`px-5 sm:px-6 md:px-8 py-4 sm:py-5 bg-linear-to-r ${statusLinear} text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3`}>
            <div className="flex items-center gap-3">
              <div className="p-1.5 sm:p-2 bg-white/20 rounded-lg">
                {getStatusIcon(request.status)}
              </div>
              <div>
                <p className="text-[10px] sm:text-xs font-semibold opacity-90">Current Status</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold">{request.status}</p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-[10px] sm:text-xs opacity-90">Request ID</p>
              <p className="text-lg sm:text-xl md:text-2xl font-bold">#{request.id}</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-5 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
            {/* Section 1: Leave Information */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 sm:h-6 bg-linear-to-b from-indigo-500 to-indigo-600 rounded"></div>
                Leave Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <ReadOnlyField
                  label="Leave Type"
                  value={request.leaveType}
                  icon={<FileText size={16} />}
                />
                <ReadOnlyField
                  label="Reason (short)"
                  value={request.reason.substring(0, 30) + "..."}
                  icon={<FileText size={16} />}
                />
              </div>
            </div>

            <div className="border-t border-slate-100"></div>

            {/* Section 2: Date Range */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 sm:h-6 bg-linear-to-b from-indigo-500 to-indigo-600 rounded"></div>
                Date Range
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <ReadOnlyField
                  label="Start Date"
                  value={formatDate(request.startDate)}
                  icon={<Calendar size={16} />}
                />
                <ReadOnlyField
                  label="End Date"
                  value={formatDate(request.endDate)}
                  icon={<Calendar size={16} />}
                />
              </div>
            </div>

            <div className="border-t border-slate-100"></div>

            {/* Section 3: Full Reason */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 sm:h-6 bg-linear-to-b from-indigo-500 to-indigo-600 rounded"></div>
                Additional Details
              </h3>
              <div className="group">
                <label className="block text-[11px] sm:text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1.5 sm:mb-2">
                  Full Reason
                </label>
                <textarea
                  value={request.reason}
                  readOnly
                  rows={4}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 cursor-default transition-all duration-200 group-hover:border-indigo-300 group-hover:shadow-sm font-medium resize-none text-sm sm:text-base"
                />
              </div>
            </div>

            <div className="border-t border-slate-100"></div>

            {/* Section 4: Other Information */}
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <div className="w-1 h-5 sm:h-6 bg-linear-to-b from-indigo-500 to-indigo-600 rounded"></div>
                Other Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <ReadOnlyField
                  label="View To"
                  value={request.viewTo === null ? "Completed" : request.viewTo}
                  icon={<User size={16} />}
                />
                <ReadOnlyField
                  label="Created Date"
                  value={formatDate(request.createdAt)}
                  icon={<Calendar size={16} />}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4 sm:mt-5">
                <ReadOnlyField
                  label="Updated Date"
                  value={formatDate(request.updatedAt)}
                  icon={<Clock size={16} />}
                />
                <ReadOnlyField
                  label="Company ID"
                  value={request.companyId}
                  icon={<Building size={16} />}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mt-4 sm:mt-5">
                <ReadOnlyField
                  label="User ID"
                  value={request.userId}
                  icon={<User size={16} />}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 sm:pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all duration-200 font-semibold text-sm hover:shadow-md"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Close
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/employee-homepage")}
                className="w-full sm:flex-1 px-4 py-2.5 sm:py-3 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 text-white hover:shadow-lg transition-all duration-200 font-semibold text-sm"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Back to Dashboard
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};