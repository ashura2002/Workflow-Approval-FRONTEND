import React, { useEffect, useState } from "react";
import type { RequestData } from "../../types/RequestData.types";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AdminArchivesRequest: React.FC = () => {
  const [archivedRequests, setArchiveRequests] = useState<RequestData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getAllPendingReqs = async () => {
      try {
        const res = await axiosInstance.get("/requests/archive-requests");
        setArchiveRequests(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          let message = error?.response?.data?.message;
          toast.error(message);
        }
      }
    };
    getAllPendingReqs();
  }, []);

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
        return (
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        );
      case "Rejected":
        return (
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
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

  const approvedCount = archivedRequests.filter(
    (req) => req.status === "Approved",
  ).length;
  const rejectedCount = archivedRequests.filter(
    (req) => req.status === "Rejected",
  ).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-linear-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
            Archived Requests
          </h1>
          <p className="text-slate-500 text-base">
            View all completed (approved or rejected) requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Total Archives */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Total Archives
                </p>
                <p className="text-3xl font-bold text-slate-800 mt-1">
                  {archivedRequests.length}
                </p>
              </div>
              <div className="p-3 bg-slate-100 rounded-xl">
                <svg
                  className="w-6 h-6 text-slate-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9-4v4m0 0v4m0-4h4m-4 0H9"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Approved */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Approved
                </p>
                <p className="text-3xl font-bold text-emerald-600 mt-1">
                  {approvedCount}
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl">
                <svg
                  className="w-6 h-6 text-emerald-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Rejected */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 transition-all hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Rejected
                </p>
                <p className="text-3xl font-bold text-red-600 mt-1">
                  {rejectedCount}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-xl">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Table Container */}
        {archivedRequests.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                      Start Date
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                      End Date
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                      Reason
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">
                      View To
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">
                      Completed Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {archivedRequests.map((request) => (
                    <tr
                      key={request.id}
                      onClick={() =>
                        navigate(`/admin-request-details/${request.id}`)
                      }
                      className={`cursor-pointer transition-all duration-150 hover:bg-slate-50 ${
                        request.status === "Approved"
                          ? "hover:bg-emerald-50/30"
                          : "hover:bg-red-50/30"
                      }`}
                    >
                      <td className="px-4 md:px-6 py-4 text-sm font-semibold text-slate-800">
                        #{request.id}
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {request.leaveType}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-slate-600 hidden sm:table-cell">
                        {formatDate(request.startDate)}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-slate-600 hidden lg:table-cell">
                        {formatDate(request.endDate)}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-slate-600 hidden md:table-cell max-w-xs truncate">
                        {request.reason}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-slate-600 hidden lg:table-cell">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700 border border-purple-100">
                          {request.viewTo ? request.viewTo : "Completed"}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            request.status,
                          )}`}
                        >
                          {getStatusIcon(request.status)}
                          <span className="hidden sm:inline">
                            {request.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-slate-500 hidden md:table-cell">
                        {formatDate(request.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-slate-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2-3h2.586a2 2 0 012 2v2h4a2 2 0 012 2v10a2 2 0 01-2 2H5z"
                />
              </svg>
            </div>
            <p className="text-slate-700 text-lg font-semibold mb-1">
              No archived requests yet
            </p>
            <p className="text-slate-500 text-sm">
              Requests will appear here once they are approved or rejected.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
