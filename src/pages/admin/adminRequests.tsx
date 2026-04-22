import React, { useEffect, useState } from "react";
import type { Request } from "../../types/Request.types";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiCheckCircle,
  FiXCircle,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";

// Confirmation Modal Component
const ConfirmModal: React.FC<{
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
  type: "approve" | "reject";
}> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type,
}) => {
  if (!isOpen) return null;

  const colors = {
    approve: "from-emerald-500 to-emerald-600",
    reject: "from-rose-500 to-rose-600",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all animate-fade-in-up">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div
              className={`p-2 rounded-full bg-linear-to-r ${colors[type]} bg-opacity-10`}
            >
              {type === "approve" ? (
                <FiCheckCircle className="w-6 h-6 text-emerald-600" />
              ) : (
                <FiXCircle className="w-6 h-6 text-rose-600" />
              )}
            </div>
            <h3 className="text-xl font-bold text-slate-800">{title}</h3>
          </div>
          <p className="text-slate-600 mb-6">{message}</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-xl text-white font-medium transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 ${
                type === "approve"
                  ? "bg-linear-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 focus:ring-emerald-300"
                  : "bg-linear-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 focus:ring-rose-300"
              }`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loader for Request Card
const RequestSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden animate-pulse">
    <div className="p-5 md:p-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-200"></div>
          <div>
            <div className="h-5 bg-slate-200 rounded w-28 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-40"></div>
          </div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
          <div className="h-10 w-24 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="h-12 bg-slate-200 rounded"></div>
        <div className="h-12 bg-slate-200 rounded"></div>
        <div className="h-12 bg-slate-200 rounded"></div>
        <div className="md:col-span-2 lg:col-span-3 h-20 bg-slate-200 rounded"></div>
      </div>
    </div>
  </div>
);

export const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    requestId: number | null;
    type: "approve" | "reject" | null;
  }>({ isOpen: false, requestId: null, type: null });

  const fetchPendingRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/requests/pending-requests");
      setRequests(res.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          error?.response?.data?.message || "Failed to load requests";
        setError(message);
        toast.error(message);
      } else {
        setError("Something went wrong");
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      const approveRequest = await axiosInstance.patch(
        `/requests/approved/${id}`,
      );
      toast.success(approveRequest.data.message || "Request approved");
      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error?.response?.data?.message || "Approval failed";
        toast.error(message);
      }
    }
  };

  const handleReject = async (id: number) => {
    try {
      const rejectRequest = await axiosInstance.patch(`/requests/reject/${id}`);
      toast.success(rejectRequest.data.message || "Request rejected");
      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error?.response?.data?.message || "Rejection failed";
        toast.error(message);
      }
    }
  };

  const openConfirmModal = (id: number, type: "approve" | "reject") => {
    setModalState({ isOpen: true, requestId: id, type });
  };

  const closeConfirmModal = () => {
    setModalState({ isOpen: false, requestId: null, type: null });
  };

  const confirmAction = () => {
    if (modalState.requestId && modalState.type) {
      if (modalState.type === "approve") {
        handleApprove(modalState.requestId);
      } else {
        handleReject(modalState.requestId);
      }
    }
    closeConfirmModal();
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchPendingRequests();
    setRefreshing(false);
    toast.success("Requests refreshed");
  };

  useEffect(() => {
    fetchPendingRequests();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with stats and refresh button */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
              Leave Requests
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Manage and review employee leave requests
            </p>
          </div>
          <div className="flex items-center gap-3">
            {requests.length > 0 && !loading && (
              <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-100 rounded-full shadow-sm">
                <span className="text-indigo-700 font-semibold text-sm sm:text-base">
                  {requests.length} pending
                </span>
              </div>
            )}
            <button
              onClick={refreshData}
              disabled={refreshing || loading}
              className="p-2 rounded-full bg-white/80 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
              aria-label="Refresh requests"
            >
              <FiRefreshCw
                className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <FiAlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm flex-1">{error}</p>
            <button
              onClick={fetchPendingRequests}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid gap-5">
            {[1, 2, 3].map((i) => (
              <RequestSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Request cards */}
        {!loading && !error && requests.length > 0 && (
          <div className="grid gap-5">
            {requests.map((request) => (
              <div
                key={request.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-indigo-200 overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  {/* User info header - responsive */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md shrink-0">
                        {request.user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-800 text-base sm:text-lg">
                          {request.user.username}
                        </h3>
                        <p className="text-slate-500 text-xs sm:text-sm break-all">
                          {request.user.email}
                        </p>
                      </div>
                    </div>
                    {/* Action buttons - stacked on mobile, row on larger */}
                    <div className="flex flex-col xs:flex-row gap-2 sm:gap-3">
                      <button
                        onClick={() => openConfirmModal(request.id, "approve")}
                        className="px-4 py-2 sm:px-5 sm:py-2.5 bg-emerald-500 hover:bg-emerald-600 cursor-pointer text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-300 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <FiCheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => openConfirmModal(request.id, "reject")}
                        className="px-4 py-2 sm:px-5 sm:py-2.5 bg-rose-500 hover:bg-rose-600 cursor-pointer text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-300 transform hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <FiXCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>

                  {/* Request details grid - fully responsive */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Start Date
                      </span>
                      <span className="text-slate-700 font-medium mt-1 text-sm sm:text-base">
                        {new Date(request.startDate).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          },
                        )}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        End Date
                      </span>
                      <span className="text-slate-700 font-medium mt-1 text-sm sm:text-base">
                        {new Date(request.endDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Leave Type
                      </span>
                      <div className="mt-1">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                          {request.leaveType}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col xs:col-span-2 lg:col-span-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Reason
                      </span>
                      <div className="text-slate-600 mt-1 bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm sm:text-base wrap-break-words">
                        {request.reason}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && requests.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 sm:p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <p className="text-lg sm:text-xl font-semibold text-slate-700">
                No pending requests
              </p>
              <p className="text-slate-500 text-sm sm:text-base mt-1">
                All leave requests have been processed.
              </p>
            </div>
          </div>
        )}

        {/* Summary footer */}
        {!loading && !error && requests.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-indigo-600">
                {requests.length}
              </span>{" "}
              pending request
              {requests.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {modalState.isOpen && modalState.type && (
        <ConfirmModal
          isOpen={modalState.isOpen}
          title={
            modalState.type === "approve" ? "Approve Request" : "Reject Request"
          }
          message={
            modalState.type === "approve"
              ? "Are you sure you want to approve this leave request? This action cannot be undone."
              : "Are you sure you want to reject this leave request? The employee will be notified."
          }
          confirmText={
            modalState.type === "approve" ? "Yes, Approve" : "Yes, Reject"
          }
          cancelText="Cancel"
          onConfirm={confirmAction}
          onCancel={closeConfirmModal}
          type={modalState.type}
        />
      )}

      {/* Custom keyframe animation for modal */}
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
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
        /* Extra small breakpoint for buttons */
        @media (min-width: 480px) {
          .xs\\:flex-row {
            flex-direction: row;
          }
          .xs\\:col-span-2 {
            grid-column: span 2 / span 2;
          }
        }
      `}</style>
    </div>
  );
};
