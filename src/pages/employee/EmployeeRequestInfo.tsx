import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { RequestData } from "../../types/RequestData.types";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";

export const EmployeeRequestInfo: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RequestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getRequestDetails = async () => {
      try {
        const res = await axiosInstance.get(`/requests/${id}`);
        setRequest(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const errorMessage =
            error?.response?.data?.message || "Request not found";
          toast.error(errorMessage);
        }
        setRequest(null);
      } finally {
        setIsLoading(false);
      }
    };

    getRequestDetails();
  }, [id]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Rejected":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Pending":
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0 1 1 0 012 0zM9.576 6.474a.75.75 0 00-1.498.058l.026 1.001h-.032a.75.75 0 00-.75.75v.009a.75.75 0 00.75.75h.032l-.026 1a.75.75 0 101.498-.058l.026-1.001h.032a.75.75 0 00.75-.75v-.009a.75.75 0 00-.75-.75h-.032l.026-1z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return null;
    }
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
      <label className="block text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">
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
          className={`w-full ${icon ? "pl-10" : "px-4"} py-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 font-medium cursor-default transition-all duration-200 group-hover:border-indigo-300 group-hover:shadow-sm focus:outline-none`}
        />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <div className="w-12 h-12 mx-auto border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-slate-600 font-medium">
            Loading request details...
          </p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200 p-8 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-slate-500 text-lg mb-6 font-medium">
              Request not found
            </p>
            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 text-white hover:shadow-lg transition-all duration-200 font-medium"
            >
              Go Back
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

  const statuslinear =
    statusColors[request.status as keyof typeof statusColors] ||
    "from-indigo-600 to-purple-600";

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent mb-2">
                Request Details
              </h1>
              <p className="text-slate-500 text-lg">
                Review your leave request submission
              </p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm text-slate-700 hover:bg-white border border-slate-200 transition-all duration-200 font-medium text-sm hover:shadow-md hover:border-indigo-200"
            >
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
          </div>
        </div>

        {/* Main Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200/50 overflow-hidden">
          {/* Status Header Bar */}
          <div
            className={`px-6 md:px-8 py-5 bg-linear-to-r ${statuslinear} text-white flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {getStatusIcon(request.status)}
              </div>
              <div>
                <p className="text-xs font-semibold opacity-90">
                  Current Status
                </p>
                <p className="text-xl md:text-2xl font-bold">
                  {request.status}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-90">Request ID</p>
              <p className="text-xl md:text-2xl font-bold">#{request.id}</p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 md:p-8 space-y-8">
            {/* Section 1: Leave Information */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <div className="w-1 h-6 bg-linear-to-b from-indigo-500 to-indigo-600 rounded"></div>
                Leave Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ReadOnlyField
                  label="Leave Type"
                  value={request.leaveType}
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.3A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                    </svg>
                  }
                />
                <ReadOnlyField
                  label="Reason (short)"
                  value={request.reason.substring(0, 30) + "..."}
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zm-11-1a1 1 0 11-2 0 1 1 0 012 0zM8 7a1 1 0 000 2h6a1 1 0 000-2H8zm0 4a1 1 0 100-2 1 1 0 000 2z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>
            </div>

            <div className="border-t border-slate-100"></div>

            {/* Section 2: Date Range */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <div className="w-1 h-6 bg-linear-to-b from-indigo-500 to-indigo-600 rounded"></div>
                Date Range
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ReadOnlyField
                  label="Start Date"
                  value={formatDate(request.startDate)}
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h12a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
                <ReadOnlyField
                  label="End Date"
                  value={formatDate(request.endDate)}
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h12a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>
            </div>

            <div className="border-t border-slate-100"></div>

            {/* Section 3: Full Reason */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <div className="w-1 h-6 bg-linear-to-b from-indigo-500 to-indigo-600 rounded"></div>
                Additional Details
              </h3>
              <div className="group">
                <label className="block text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">
                  Full Reason
                </label>
                <textarea
                  value={request.reason}
                  readOnly
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm text-slate-700 cursor-default transition-all duration-200 group-hover:border-indigo-300 group-hover:shadow-sm font-medium resize-none"
                />
              </div>
            </div>

            <div className="border-t border-slate-100"></div>

            {/* Section 4: Other Information */}
            <div>
              <h3 className="text-lg font-bold text-slate-800 mb-5 flex items-center gap-2">
                <div className="w-1 h-6 bg-linear-to-b from-indigo-500 to-indigo-600 rounded"></div>
                Other Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <ReadOnlyField
                  label="View To"
                  value={request.viewTo === null ? "Completed" : request.viewTo}
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path
                        fillRule="evenodd"
                        d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
                <ReadOnlyField
                  label="Created Date"
                  value={formatDate(request.createdAt)}
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h12a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <ReadOnlyField
                  label="Updated Date"
                  value={formatDate(request.updatedAt)}
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h12a1 1 0 100-2H6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
                <ReadOnlyField
                  label="Company ID"
                  value={request.companyId}
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2h2v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  }
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                <ReadOnlyField
                  label="User ID"
                  value={request.userId}
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  }
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 px-5 py-3 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-all duration-200 font-semibold hover:shadow-md"
              >
                <span className="flex items-center justify-center gap-2">
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                  Close
                </span>
              </button>
              <button
                type="button"
                onClick={() => navigate("/employee-homepage")}
                className="flex-1 px-5 py-3 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 text-white hover:shadow-lg transition-all duration-200 font-semibold"
              >
                <span className="flex items-center justify-center gap-2">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
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
