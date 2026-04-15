import React, { useEffect, useState } from "react";
import type { RequestData } from "../../types/RequestData.types";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { axiosInstance } from "../../utils/axiosInstance";
import toast from "react-hot-toast";

export const EmployeeRequestHistory: React.FC = () => {
  const [requests, setRequests] = useState<RequestData[]>([]);
  const navigate = useNavigate();

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axiosInstance.delete(`/requests/${id}`);
      setRequests((prev) => prev.filter((req) => req.id !== id));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        let message = error?.response?.data;
        toast.error(message);
      }
    }
  };

  const handleDeleteAll = async () => {
    try {
      const res = await axiosInstance.delete("/requests/delete-all");
      toast.success(res.data.message);
      setRequests([]);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        let message = error?.response?.data?.message;
        toast.error(message);
      }
    }
  };

  useEffect(() => {
    const getAllMyRequest = async () => {
      try {
        const res = await axiosInstance.get("/requests/my-records");
        setRequests(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const errorMessage = error?.response?.data.message;
          toast.error(errorMessage);
        }
      }
    };
    getAllMyRequest();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "Pending":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "Rejected":
        return "bg-rose-100 text-rose-700 border border-rose-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Rejected":
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 11-2 0 1 1 0 012 0z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
              Request History
            </h1>
            <p className="text-slate-500 mt-1">
              Track your leave and request submissions
            </p>
          </div>

          <button
            onClick={handleDeleteAll}
            disabled={requests.length === 0}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all duration-200 font-medium text-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete all requests"
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
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete All
          </button>
        </div>

        {/* Card Grid Layout */}
        {requests.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {requests.map((request) => (
              <div
                key={request.id}
                onClick={() => navigate(`/employee-request-details/${request.id}`)}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-indigo-200 overflow-hidden cursor-pointer"
              >
                <div className="p-5">
                  {/* Header: ID and Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded">
                      #{request.id}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}
                    >
                      {getStatusIcon(request.status)}
                      <span>{request.status}</span>
                    </span>
                  </div>

                  {/* Leave Type */}
                  <div className="mb-3">
                    <h3 className="font-bold text-slate-800 text-lg">
                      {request.leaveType}
                    </h3>
                  </div>

                  {/* Date Range */}
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(request.startDate)}</span>
                    </div>
                    <span className="text-slate-300">→</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(request.endDate)}</span>
                    </div>
                  </div>

                  {/* Reason (truncated) */}
                  <div className="mb-3">
                    <p className="text-sm text-slate-500 line-clamp-2 bg-slate-50 p-2 rounded-lg">
                      {request.reason}
                    </p>
                  </div>

                  {/* View To */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span className="font-medium">Assigned to:</span>
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                      {request.viewTo === null ? "Completed" : request.viewTo}
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end pt-2 border-t border-slate-100">
                    <button
                      onClick={(e) => handleDelete(request.id, e)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-all duration-200 text-xs font-medium"
                      title="Delete this request"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-indigo-600"
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
              <p className="text-xl font-semibold text-slate-700 mb-2">
                No requests found
              </p>
              <p className="text-slate-500 mb-6">
                You haven't submitted any leave requests yet.
              </p>
              <button
                onClick={() => navigate("/employee-homepage")}
                className="px-5 py-2.5 rounded-xl bg-linear-to-r from-indigo-600 to-indigo-500 text-white hover:shadow-lg transition-all duration-200 font-medium"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};