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
        return "bg-green-100 text-green-800 border border-green-300";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border border-yellow-300";
      case "Rejected":
        return "bg-red-100 text-red-800 border border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
              Request History
            </h1>
            <p className="text-gray-600 text-lg">
              Track your leave and request submissions
            </p>
          </div>

          <button
            onClick={handleDeleteAll}
            disabled={requests.length === 0}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200 transition-all duration-200 font-semibold text-sm hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Table Container */}
        {requests.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-linear-to-r from-blue-600 to-indigo-600 text-white">
                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider">
                      Leave Type
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider hidden sm:table-cell">
                      Start Date
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider hidden lg:table-cell">
                      End Date
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider hidden md:table-cell">
                      Reason
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider hidden lg:table-cell">
                      View To
                    </th>
                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 md:px-6 py-4 text-center text-xs md:text-sm font-bold uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-20F0">
                  {requests.map((request) => (
                    <tr
                      key={request.id}
                      onClick={() =>
                        navigate(`/employee-request-details/${request.id}`)
                      }
                      className="hover:bg-blue-50 transition-all duration-200 cursor-pointer group"
                    >
                      <td className="px-4 md:px-6 py-4 text-sm font-bold text-gray-900">
                        #{request.id}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-700">
                        <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-semibold group-hover:shadow-md transition-all">
                          {request.leaveType}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-700 hidden sm:table-cell">
                        {formatDate(request.startDate)}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-700 hidden lg:table-cell">
                        {formatDate(request.endDate)}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-700 hidden md:table-cell max-w-xs truncate">
                        {request.reason}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-700 hidden lg:table-cell">
                        <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold group-hover:shadow-md transition-all">
                          {request.viewTo === null
                            ? "Completed"
                            : request.viewTo}
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}
                        >
                          {getStatusIcon(request.status)}
                          <span className="hidden sm:inline">
                            {request.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-4 md:px-6 py-4 text-center">
                        <button
                          onClick={(e) => handleDelete(request.id, e)}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border-2 border-red-200 transition-all duration-200 font-medium text-xs hover:shadow-lg"
                          title="Delete this request"
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
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center border-2 border-gray-100">
            <div className="mb-4">
              <svg
                className="w-16 h-16 mx-auto text-gray-400"
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
            <p className="text-gray-600 text-xl font-semibold mb-2">
              No requests found
            </p>
            <p className="text-gray-500 mb-6">
              You haven't submitted any leave requests yet.
            </p>
            <button
              onClick={() => navigate("/employee-homepage")}
              className="px-6 py-3 rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg transition-all duration-200 font-semibold hover:from-blue-700 hover:to-indigo-700"
            >
              Back to Dashboard
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          table {
            font-size: 13px;
          }
          td, th {
            padding: 12px 8px !important;
          }
        }
      `}</style>
    </div>
  );
};
