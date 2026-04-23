import React, { useEffect, useState, useCallback } from "react";
import type { RequestData } from "../../types/RequestData.types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosInstance } from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import { RefreshCw, AlertCircle, Trash2, Calendar } from "lucide-react";

// Confirmation Modal Component
const ConfirmModal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}> = ({ isOpen, title, message, confirmText, cancelText, onConfirm, onCancel, isDeleting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all animate-fade-in-up">
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-red-100">
              <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">{title}</h3>
          </div>
          <p className="text-slate-600 text-sm sm:text-base mb-5 sm:mb-6">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={onCancel}
              disabled={isDeleting}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:opacity-50"
            >
              {cancelText}
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
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Card Component
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden animate-pulse">
    <div className="p-5">
      <div className="flex justify-between mb-3">
        <div className="h-5 bg-slate-200 rounded w-16"></div>
        <div className="h-5 bg-slate-200 rounded w-20"></div>
      </div>
      <div className="h-6 bg-slate-200 rounded w-32 mb-3"></div>
      <div className="flex justify-between mb-3">
        <div className="h-4 bg-slate-200 rounded w-24"></div>
        <div className="h-4 bg-slate-200 rounded w-24"></div>
      </div>
      <div className="h-16 bg-slate-200 rounded-lg mb-3"></div>
      <div className="flex justify-between items-center mb-4">
        <div className="h-3 bg-slate-200 rounded w-24"></div>
        <div className="h-5 bg-slate-200 rounded w-20"></div>
      </div>
      <div className="flex justify-end pt-2">
        <div className="h-8 bg-slate-200 rounded-lg w-20"></div>
      </div>
    </div>
  </div>
);

export const EmployeeRequestHistory: React.FC = () => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: number | null }>({
    isOpen: false,
    id: null,
  });
  const [deleteAllModal, setDeleteAllModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  const fetchRequests = useCallback(async (showToast = false) => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/requests/my-records");
      setRequests(res.data);
      if (showToast) toast.success("History refreshed");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message || "Failed to load requests";
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
    fetchRequests();
  }, [fetchRequests]);

  const refreshData = async () => {
    setRefreshing(true);
    await fetchRequests(true);
    setRefreshing(false);
  };

  const openDeleteModal = (id: number) => {
    setDeleteModal({ isOpen: true, id });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, id: null });
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`/requests/${deleteModal.id}`);
      setRequests((prev) => prev.filter((req) => req.id !== deleteModal.id));
      toast.success("Request deleted successfully");
      closeDeleteModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message || "Delete failed";
        toast.error(msg);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteAllModal = () => {
    setDeleteAllModal(true);
  };

  const closeDeleteAllModal = () => {
    setDeleteAllModal(false);
  };

  const handleDeleteAll = async () => {
    if (requests.length === 0) return;
    setIsDeleting(true);
    try {
      const res = await axiosInstance.delete("/requests/delete-all");
      toast.success(res.data.message || "All requests deleted");
      setRequests([]);
      closeDeleteAllModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message || "Delete all failed";
        toast.error(msg);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusColor = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "approved") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (s === "pending") return "bg-amber-100 text-amber-700 border-amber-200";
    if (s === "rejected") return "bg-rose-100 text-rose-700 border-rose-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getStatusIcon = (status: string) => {
    const s = status?.toLowerCase();
    if (s === "approved") {
      return (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    if (s === "rejected") {
      return (
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
        </svg>
      );
    }
    return (
      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 sm:mb-8">
            <div className="h-8 w-40 bg-slate-200 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-48 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-red-200 p-6 sm:p-8 text-center max-w-md w-full">
          <AlertCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold text-slate-800 mb-2">
            Failed to Load History
          </h3>
          <p className="text-slate-500 text-sm sm:text-base mb-6">{error}</p>
          <button
            onClick={() => fetchRequests(true)}
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with refresh and delete all buttons */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
              Request History
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Track your leave and request submissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              disabled={refreshing}
              className="p-2 rounded-full bg-white/80 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
              aria-label="Refresh history"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            {requests.length > 0 && (
              <button
                onClick={openDeleteAllModal}
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all duration-200 font-medium text-xs sm:text-sm hover:shadow-md"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Delete All
              </button>
            )}
          </div>
        </div>

        {/* Request Cards Grid - Responsive */}
        {requests.length > 0 ? (
          <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <div
                key={request.id}
                onClick={() => navigate(`/employee-request-details/${request.id}`)}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-indigo-200 overflow-hidden cursor-pointer"
              >
                <div className="p-4 sm:p-5">
                  {/* Header: ID and Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] sm:text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                      #{request.id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${getStatusColor(request.status)}`}
                    >
                      {getStatusIcon(request.status)}
                      <span className="hidden xs:inline">{request.status}</span>
                    </span>
                  </div>

                  {/* Leave Type */}
                  <div className="mb-2 sm:mb-3">
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg wrap-break-word">
                      {request.leaveType}
                    </h3>
                  </div>

                  {/* Date Range */}
                  <div className="flex flex-wrap items-center justify-between gap-1 text-xs sm:text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{formatDate(request.startDate)}</span>
                    </div>
                    <span className="text-slate-300 text-xs">→</span>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{formatDate(request.endDate)}</span>
                    </div>
                  </div>

                  {/* Reason (truncated) */}
                  <div className="mb-3">
                    <p className="text-xs sm:text-sm text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-lg wrap-break-word">
                      {request.reason}
                    </p>
                  </div>

                  {/* View To */}
                  <div className="flex items-center justify-between text-[10px] sm:text-xs text-slate-500 mb-3 sm:mb-4">
                    <span className="font-medium">Assigned to:</span>
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                      {request.viewTo === null ? "Completed" : request.viewTo}
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteModal(request.id);
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all duration-200 text-[11px] sm:text-xs font-medium"
                    >
                      <Trash2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 sm:p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-lg sm:text-xl font-semibold text-slate-700 mb-2">
                No requests found
              </p>
              <p className="text-slate-500 text-sm sm:text-base mb-6">
                You haven't submitted any leave requests yet.
              </p>
              <button
                onClick={() => navigate("/employee-homepage")}
                className="px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 text-white hover:shadow-lg transition-all duration-200 font-medium text-sm"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Single Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Delete Request"
        message="Are you sure you want to delete this request? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={closeDeleteModal}
        isDeleting={isDeleting}
      />

      {/* Delete All Confirmation Modal */}
      <ConfirmModal
        isOpen={deleteAllModal}
        title="Delete All Requests"
        message={`Are you sure you want to delete all ${requests.length} request(s)? This action cannot be undone.`}
        confirmText="Yes, Delete All"
        cancelText="Cancel"
        onConfirm={handleDeleteAll}
        onCancel={closeDeleteAllModal}
        isDeleting={isDeleting}
      />

      {/* Custom keyframe for modal animation */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
        @media (min-width: 480px) {
          .xs\\:inline { display: inline; }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in-up { animation: none; opacity: 1; transform: none; }
        }
      `}</style>
    </div>
  );
};