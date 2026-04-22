import React, { useEffect, useState } from "react";
import type { RequestData } from "../../types/RequestData.types";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { RefreshCw, AlertCircle, Archive, CheckCircle, XCircle } from "lucide-react";

// Skeleton loader for stats cards
const StatsSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 animate-pulse">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-3 bg-slate-200 rounded w-20 mb-2"></div>
            <div className="h-8 bg-slate-200 rounded w-16"></div>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    ))}
  </div>
);

// Skeleton loader for table rows
const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 md:px-6 py-4"><div className="h-3 bg-slate-200 rounded w-10"></div></th>
            <th className="px-4 md:px-6 py-4"><div className="h-3 bg-slate-200 rounded w-20"></div></th>
            <th className="px-4 md:px-6 py-4 hidden sm:table-cell"><div className="h-3 bg-slate-200 rounded w-24"></div></th>
            <th className="px-4 md:px-6 py-4 hidden lg:table-cell"><div className="h-3 bg-slate-200 rounded w-20"></div></th>
            <th className="px-4 md:px-6 py-4 hidden md:table-cell"><div className="h-3 bg-slate-200 rounded w-28"></div></th>
            <th className="px-4 md:px-6 py-4 hidden lg:table-cell"><div className="h-3 bg-slate-200 rounded w-24"></div></th>
            <th className="px-4 md:px-6 py-4"><div className="h-3 bg-slate-200 rounded w-16"></div></th>
            <th className="px-4 md:px-6 py-4 hidden md:table-cell"><div className="h-3 bg-slate-200 rounded w-20"></div></th>
          </tr>
        </thead>
        <tbody>
          {[1, 2, 3].map((i) => (
            <tr key={i} className="border-t border-slate-100">
              <td className="px-4 md:px-6 py-4"><div className="h-4 bg-slate-200 rounded w-12"></div></td>
              <td className="px-4 md:px-6 py-4"><div className="h-5 bg-slate-200 rounded w-24"></div></td>
              <td className="px-4 md:px-6 py-4 hidden sm:table-cell"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
              <td className="px-4 md:px-6 py-4 hidden lg:table-cell"><div className="h-4 bg-slate-200 rounded w-28"></div></td>
              <td className="px-4 md:px-6 py-4 hidden md:table-cell"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
              <td className="px-4 md:px-6 py-4 hidden lg:table-cell"><div className="h-5 bg-slate-200 rounded w-24"></div></td>
              <td className="px-4 md:px-6 py-4"><div className="h-5 bg-slate-200 rounded w-20"></div></td>
              <td className="px-4 md:px-6 py-4 hidden md:table-cell"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export const AdminArchivesRequest: React.FC = () => {
  const [archivedRequests, setArchiveRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();

  const fetchArchivedRequests = async (showToast = false) => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/requests/archive-requests");
      setArchiveRequests(res.data);
      if (showToast) toast.success("Archives refreshed");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message || "Failed to load archived requests";
        setError(msg);
        toast.error(msg);
      } else {
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedRequests();
  }, []);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchArchivedRequests(true);
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-200/50";
      case "Rejected":
        return "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-200/50";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle size={14} className="text-emerald-600" />;
      case "Rejected":
        return <XCircle size={14} className="text-red-600" />;
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

  const approvedCount = archivedRequests.filter(
    (req) => req.status === "Approved",
  ).length;
  const rejectedCount = archivedRequests.filter(
    (req) => req.status === "Rejected",
  ).length;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <StatsSkeleton />
          <TableSkeleton />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-red-200 p-6 sm:p-8 text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">
            Failed to Load Archives
          </h3>
          <p className="text-slate-500 text-sm sm:text-base mb-6">{error}</p>
          <button
            onClick={() => fetchArchivedRequests()}
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with refresh button */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Archived Requests
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              View all completed (approved or rejected) requests
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={refreshing}
            className="self-start sm:self-center p-2 rounded-full bg-white/80 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
            aria-label="Refresh archives"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Stats Cards - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Archives */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Archives
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-800 mt-1">
                  {archivedRequests.length}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-slate-100 rounded-xl">
                <Archive className="w-5 h-5 sm:w-6 sm:h-6 text-slate-600" />
              </div>
            </div>
          </div>

          {/* Approved */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Approved
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-emerald-600 mt-1">
                  {approvedCount}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-emerald-50 rounded-xl">
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Rejected
                </p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1">
                  {rejectedCount}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-red-50 rounded-xl">
                <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Table Container - Responsive with horizontal scroll on small screens */}
        {archivedRequests.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-160">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                      Start Date
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                      End Date
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                      Reason
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                      View To
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                      Completed Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {archivedRequests.map((request) => (
                    <tr
                      key={request.id}
                      onClick={() => navigate(`/admin-request-details/${request.id}`)}
                      className={`cursor-pointer transition-all duration-150 hover:bg-slate-50 ${
                        request.status === "Approved"
                          ? "hover:bg-emerald-50/30"
                          : "hover:bg-red-50/30"
                      }`}
                    >
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm font-semibold text-slate-800">
                        #{request.id}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {request.leaveType}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600 hidden sm:table-cell">
                        {formatDate(request.startDate)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600 hidden lg:table-cell">
                        {formatDate(request.endDate)}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-600 hidden md:table-cell max-w-xs truncate">
                        {request.reason}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 hidden lg:table-cell">
                        <span className="inline-flex items-center px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                          {request.viewTo ? request.viewTo : "Completed"}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-medium border ${getStatusColor(
                            request.status,
                          )}`}
                        >
                          {getStatusIcon(request.status)}
                          <span className="hidden sm:inline">
                            {request.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-xs sm:text-sm text-slate-500 hidden md:table-cell">
                        {formatDate(request.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State - Responsive */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12 text-center">
            <div className="mb-4">
              <Archive className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-slate-300" />
            </div>
            <p className="text-slate-700 text-base sm:text-lg font-semibold mb-1">
              No archived requests yet
            </p>
            <p className="text-slate-500 text-xs sm:text-sm">
              Requests will appear here once they are approved or rejected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};