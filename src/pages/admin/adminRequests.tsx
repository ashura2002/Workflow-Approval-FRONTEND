import React, { useEffect, useState } from "react";
import type { Request } from "../../types/Request.types";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";

export const AdminRequests: React.FC = () => {
  const [requests, setRequests] = useState<Request[]>([]);

  const handleApprove = async (id: number) => {
    try {
      const approveRequest = await axiosInstance.patch(
        `/requests/approved/${id}`,
      );
      toast.success(approveRequest.data.message);
      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        let message = error?.response?.data?.message;
        toast.error(message);
      }
    }
  };

  const handleReject = async (id: number) => {
    try {
      const rejectRequest = await axiosInstance.patch(`/requests/reject/${id}`);
      toast.success(rejectRequest.data.message);
      setRequests((prev) => prev.filter((request) => request.id !== id));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        let message = error?.response?.data?.message;
        toast.error(message);
      }
    }
  };

  useEffect(() => {
    const getAllPendingRequests = async () => {
      try {
        const res = await axiosInstance.get("/requests/pending-requests");
        setRequests(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          let message = error?.response?.data?.message;
          toast.error(message);
        }
      }
    };
    getAllPendingRequests();
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with stats */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
              Leave Requests
            </h1>
            <p className="text-slate-500 mt-1">
              Manage and review employee leave requests
            </p>
          </div>
          {requests.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="px-4 py-2 bg-indigo-100 rounded-full shadow-sm">
                <span className="text-indigo-700 font-semibold">
                  {requests.length} pending
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Card-based layout */}
        {requests.length > 0 ? (
          <div className="grid gap-5">
            {requests.map((request) => (
              <div
                key={request.id}
                className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-indigo-200 overflow-hidden"
              >
                <div className="p-5 md:p-6">
                  {/* User info header */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md">
                          {request.user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 text-lg">
                            {request.user.username}
                          </h3>
                          <p className="text-slate-500 text-sm">
                            {request.user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 cursor-pointer text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-300 transform hover:scale-105"
                      >
                        ✓ Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="px-5 py-2.5 bg-rose-500 hover:bg-rose-600 cursor-pointer text-white rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-rose-300 transform hover:scale-105"
                      >
                        ✗ Reject
                      </button>
                    </div>
                  </div>

                  {/* Request details grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Start Date
                      </span>
                      <span className="text-slate-700 font-medium mt-1">
                        {new Date(request.startDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        End Date
                      </span>
                      <span className="text-slate-700 font-medium mt-1">
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
                    <div className="flex flex-col md:col-span-2 lg:col-span-3">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Reason
                      </span>
                      <span className="text-slate-600 mt-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                        {request.reason}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Empty state
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xl font-semibold text-slate-700">No pending requests</p>
              <p className="text-slate-500 mt-1">All leave requests have been processed.</p>
            </div>
          </div>
        )}

        {/* Summary footer */}
        {requests.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-indigo-600">{requests.length}</span> pending request
              {requests.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};