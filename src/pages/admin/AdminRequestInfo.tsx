import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { RequestData } from "../../types/RequestData.types";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";

export const AdminRequestInfo: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<RequestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminNote, setAdminNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleDecision = async (decision: "Approved" | "Rejected") => {
    if (!request) return;
    setIsSubmitting(true);
    try {
      await axiosInstance.patch(`/requests/${id}/status`, {
        status: decision,
        adminNote,
      });
      toast.success(`Request ${decision.toLowerCase()} successfully`);
      navigate(-1);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error?.response?.data?.message || "Failed to update request";
        toast.error(errorMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Approved:
        "bg-emerald-50 text-emerald-700 border-emerald-200 ring-1 ring-emerald-200/50",
      Rejected: "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-200/50",
      Pending:
        "bg-amber-50 text-amber-700 border-amber-200 ring-1 ring-amber-200/50",
    };
    return styles[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusDot = (status: string) => {
    const colors: Record<string, string> = {
      Approved: "bg-emerald-500",
      Rejected: "bg-red-500",
      Pending: "bg-amber-400 animate-pulse",
    };
    return colors[status] || "bg-gray-400";
  };

  const ReadOnlyField = ({
    label,
    value,
    mono = false,
  }: {
    label: string;
    value: string | number;
    mono?: boolean;
  }) => (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
        {label}
      </span>
      <div
        className={`text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-2.5 transition-all duration-200 ${
          mono ? "font-mono text-xs text-slate-600" : "font-medium"
        }`}
      >
        {value}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 mx-auto border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin mb-4" />
          <p className="text-slate-600 font-medium">
            Loading request details...
          </p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 flex items-center justify-center p-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200 p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <p className="text-slate-800 font-semibold text-xl mb-2">
            Request not found
          </p>
          <p className="text-slate-500 text-sm mb-6">
            This record may have been removed or you may not have access.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-xl hover:bg-slate-700 transition-all duration-200 shadow-sm"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100">
      {/* Modern sticky header */}
      <div className="sticky top-3 left-9 rounded-2xl w-96 bg-white backdrop-blur-md border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <button
              onClick={() => navigate(-1)}
              className="hover:text-slate-900 transition-colors flex items-center gap-1"
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
              Leave Requests
            </button>
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span className="font-semibold text-slate-800">
              Request #{request.id}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {request.status === "Pending" && (
              <span className="flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Awaiting review
              </span>
            )}
            <span
              className={`flex items-center gap-1.5 text-xs font-medium border px-3 py-1.5 rounded-full shadow-sm ${getStatusBadge(
                request.status,
              )}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${getStatusDot(
                  request.status,
                )}`}
              />
              {request.status}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary card with linear accent */}
        <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all hover:shadow-lg">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Request #{request.id}
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              Submitted {formatDate(request.createdAt)} • {request.leaveType} •{" "}
              {Math.ceil(
                (new Date(request.endDate).getTime() -
                  new Date(request.startDate).getTime()) /
                  (1000 * 60 * 60 * 24) +
                  1,
              )}{" "}
              days
            </p>
          </div>
          {request.status === "Pending" && (
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => handleDecision("Approved")}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
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
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Approve
              </button>
              <button
                onClick={() => handleDecision("Rejected")}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                Reject
              </button>
            </div>
          )}
        </div>

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Leave Information Card */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 transition-all hover:shadow-lg">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2">
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
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Leave Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <ReadOnlyField label="Leave type" value={request.leaveType} />
                <ReadOnlyField
                  label="Duration"
                  value={`${Math.ceil(
                    (new Date(request.endDate).getTime() -
                      new Date(request.startDate).getTime()) /
                      (1000 * 60 * 60 * 24) +
                      1,
                  )} days`}
                />
                <ReadOnlyField
                  label="Start date"
                  value={formatDate(request.startDate)}
                />
                <ReadOnlyField
                  label="End date"
                  value={formatDate(request.endDate)}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Reason
                </span>
                <div className="text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 font-medium leading-relaxed">
                  {request.reason}
                </div>
              </div>
            </div>

            {/* Metadata Card */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 transition-all hover:shadow-lg">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2">
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
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Record Metadata
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <ReadOnlyField
                  label="Created at"
                  value={formatDate(request.createdAt)}
                  mono
                />
                <ReadOnlyField
                  label="Last updated"
                  value={formatDate(request.updatedAt)}
                  mono
                />
                <ReadOnlyField
                  label="Company ID"
                  value={request.companyId}
                  mono
                />
                <ReadOnlyField label="User ID" value={request.userId} mono />
                <ReadOnlyField
                  label="View to"
                  value={request.viewTo === null ? "Completed" : request.viewTo}
                  mono
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Employee Snapshot */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 transition-all hover:shadow-lg">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2">
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Employee
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-sm font-bold text-indigo-700 shadow-inner">
                  {String(request.userId).slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    User #{request.userId}
                  </p>
                  <p className="text-xs text-slate-500">
                    Company #{request.companyId}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin Decision Panel (only for pending) */}
            {request.status === "Pending" && (
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 transition-all hover:shadow-lg">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  Admin Decision
                </h2>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  placeholder="Add a note or reason for your decision..."
                  className="w-full text-sm text-slate-700 bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300 transition-all placeholder:text-slate-400 mb-4"
                />
                <div className="space-y-3">
                  <button
                    onClick={() => handleDecision("Approved")}
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-60"
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Approve request
                  </button>
                  <button
                    onClick={() => handleDecision("Rejected")}
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Reject request
                  </button>
                  <button
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 text-sm font-semibold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-60"
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
                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Request more info
                  </button>
                </div>
              </div>
            )}

            {/* Activity Log Timeline */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-6 transition-all hover:shadow-lg">
              <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-5 flex items-center gap-2">
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
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Activity Log
              </h2>
              <div className="flow-root">
                <ul className="-mb-4">
                  <li className="relative pb-6">
                    <div className="absolute left-3 top-0 -ml-px h-full w-0.5 bg-slate-200" />
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className="h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center ring-4 ring-white">
                          <svg
                            className="w-3 h-3 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <p className="text-xs text-slate-400">
                            {formatDateTime(request.createdAt)}
                          </p>
                          <p className="text-sm font-medium text-slate-800 mt-0.5">
                            Request submitted
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                  <li className="relative pb-6">
                    <div className="absolute left-3 top-0 -ml-px h-full w-0.5 bg-slate-200" />
                    <div className="relative flex items-start space-x-3">
                      <div className="relative">
                        <div className="h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center ring-4 ring-white">
                          <svg
                            className="w-3 h-3 text-indigo-600"
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
                      </div>
                      <div className="min-w-0 flex-1">
                        <div>
                          <p className="text-xs text-slate-400">
                            {formatDateTime(request.createdAt)}
                          </p>
                          <p className="text-sm font-medium text-slate-800 mt-0.5">
                            Assigned to admin
                          </p>
                        </div>
                      </div>
                    </div>
                  </li>
                  {request.status !== "Pending" ? (
                    <li className="relative">
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div
                            className={`h-6 w-6 rounded-full flex items-center justify-center ring-4 ring-white ${
                              request.status === "Approved"
                                ? "bg-emerald-100"
                                : "bg-red-100"
                            }`}
                          >
                            <svg
                              className={`w-3 h-3 ${
                                request.status === "Approved"
                                  ? "text-emerald-600"
                                  : "text-red-600"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              {request.status === "Approved" ? (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              ) : (
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"
                                />
                              )}
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <p className="text-xs text-slate-400">
                              {formatDateTime(request.updatedAt)}
                            </p>
                            <p className="text-sm font-medium text-slate-800 mt-0.5">
                              Request {request.status.toLowerCase()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li className="relative">
                      <div className="relative flex items-start space-x-3">
                        <div className="relative">
                          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center ring-4 ring-white">
                            <svg
                              className="w-3 h-3 text-slate-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div>
                            <p className="text-xs text-slate-400">Pending</p>
                            <p className="text-sm text-slate-500 mt-0.5">
                              Awaiting admin decision
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
