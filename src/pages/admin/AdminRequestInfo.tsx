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
      Approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
      Rejected: "bg-red-50 text-red-800 border-red-200",
      Pending: "bg-amber-50 text-amber-800 border-amber-200",
    };
    return styles[status] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getStatusDot = (status: string) => {
    const colors: Record<string, string> = {
      Approved: "bg-emerald-500",
      Rejected: "bg-red-500",
      Pending: "bg-amber-400",
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
    <div className="flex flex-col gap-1">
      <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
        {label}
      </span>
      <div
        className={`text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 ${
          mono ? "font-mono text-xs text-gray-500" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 mx-auto border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin mb-3" />
          <p className="text-sm text-slate-500 font-medium">
            Loading request...
          </p>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-10 text-center max-w-md w-full">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-7 h-7 text-gray-400"
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
          <p className="text-gray-800 font-semibold text-lg mb-1">
            Request not found
          </p>
          <p className="text-gray-500 text-sm mb-6">
            This record may have been removed or you may not have access.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-5 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <button
            onClick={() => navigate(-1)}
            className="hover:text-gray-800 transition-colors"
          >
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
          <span className="text-gray-800 font-medium">
            Review #{request.id}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {request.status === "Pending" && (
            <span className="flex items-center gap-1.5 text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              Awaiting review
            </span>
          )}
          <span
            className={`flex items-center gap-1.5 text-xs font-medium border px-2.5 py-1 rounded-full ${getStatusBadge(request.status)}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${getStatusDot(request.status)}`}
            />
            {request.status}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6 py-6">
        {/* Request header card */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Request #{request.id}
              </h1>
            </div>
            <p className="text-sm text-gray-500">
              Submitted {formatDate(request.createdAt)} &middot;{" "}
              {request.leaveType} &middot;{" "}
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
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => handleDecision("Approved")}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
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
                className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
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

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Main details */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Leave info */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Leave information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
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
              <div className="flex flex-col gap-1">
                <span className="text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                  Reason
                </span>
                <textarea
                  value={request.reason}
                  readOnly
                  rows={4}
                  className="text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none font-medium leading-relaxed"
                />
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Record metadata
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Right: Sidebar */}
          <div className="flex flex-col gap-5">
            {/* Employee snapshot */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Employee
              </h2>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-sm font-semibold text-violet-700 shrink-0">
                  {String(request.userId).slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    User #{request.userId}
                  </p>
                  <p className="text-xs text-gray-500">
                    Company #{request.companyId}
                  </p>
                </div>
              </div>
            </div>

            {/* Admin decision */}
            {request.status === "Pending" && (
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                  Admin decision
                </h2>
                <textarea
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                  placeholder="Add a note or reason for your decision..."
                  className="w-full text-sm text-gray-700 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 resize-none focus:outline-none focus:border-gray-400 transition-colors placeholder-gray-400 mb-3 leading-relaxed"
                />
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleDecision("Approved")}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
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
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-red-50 text-red-600 border border-red-200 text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
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
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-gray-50 text-gray-600 border border-gray-200 text-sm font-medium rounded-lg transition-colors disabled:opacity-60"
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

            {/* Activity log */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
                Activity log
              </h2>
              <ol className="relative border-l border-gray-200 ml-2 space-y-4">
                <li className="ml-4">
                  <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  <p className="text-[11px] text-gray-400">
                    {formatDateTime(request.createdAt)}
                  </p>
                  <p className="text-sm text-gray-700 font-medium mt-0.5">
                    Request submitted
                  </p>
                </li>
                <li className="ml-4">
                  <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
                  <p className="text-[11px] text-gray-400">
                    {formatDateTime(request.createdAt)}
                  </p>
                  <p className="text-sm text-gray-700 font-medium mt-0.5">
                    Assigned to admin
                  </p>
                </li>
                {request.status !== "Pending" ? (
                  <li className="ml-4">
                    <div
                      className={`absolute -left-1.5 w-3 h-3 rounded-full border-2 border-white ${
                        request.status === "Approved"
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }`}
                    />
                    <p className="text-[11px] text-gray-400">
                      {formatDateTime(request.updatedAt)}
                    </p>
                    <p className="text-sm text-gray-700 font-medium mt-0.5">
                      Request {request.status.toLowerCase()}
                    </p>
                  </li>
                ) : (
                  <li className="ml-4">
                    <div className="absolute -left-1.5 w-3 h-3 rounded-full bg-gray-300 border-2 border-white" />
                    <p className="text-[11px] text-gray-400">Pending</p>
                    <p className="text-sm text-gray-400 mt-0.5">
                      Awaiting admin decision
                    </p>
                  </li>
                )}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
