import React, { useState } from "react";
import type { RequestData } from "../../types/RequestData.types";
import { requestDataShape } from "../../utils/mockdata";

export const AdminArchivesRequest: React.FC = () => {
  const [archivedRequests] = useState<RequestData[]>(
    requestDataShape.filter(
      (req) => req.status === "Approved" || req.status === "Rejected",
    ),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800 border border-green-300";
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
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-2">
            Archived Requests
          </h1>
          <p className="text-gray-600 text-lg">
            View all completed (approved or rejected) requests
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Archives */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider">
                  Total Archives
                </p>
                <p className="text-4xl font-bold text-gray-900 mt-2">
                  {archivedRequests.length}
                </p>
              </div>
              <div className="p-4 bg-blue-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-blue-600"
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
          <div className="bg-white rounded-2xl shadow-lg border-2 border-green-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider">
                  Approved
                </p>
                <p className="text-4xl font-bold text-green-600 mt-2">
                  {approvedCount}
                </p>
              </div>
              <div className="p-4 bg-green-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-green-600"
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
          <div className="bg-white rounded-2xl shadow-lg border-2 border-red-100 p-6 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold uppercase tracking-wider">
                  Rejected
                </p>
                <p className="text-4xl font-bold text-red-600 mt-2">
                  {rejectedCount}
                </p>
              </div>
              <div className="p-4 bg-red-100 rounded-lg">
                <svg
                  className="w-8 h-8 text-red-600"
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
                    <th className="px-4 md:px-6 py-4 text-left text-xs md:text-sm font-bold uppercase tracking-wider hidden md:table-cell">
                      Completed Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {archivedRequests.map((request) => (
                    <tr
                      key={request.id}
                      className={`hover:shadow-md transition-all duration-200 ${
                        request.status === "Approved"
                          ? "hover:bg-green-50"
                          : "hover:bg-red-50"
                      }`}
                    >
                      <td className="px-4 md:px-6 py-4 text-sm font-bold text-gray-900">
                        #{request.id}
                      </td>
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-700">
                        <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-semibold">
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
                        <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                          {request.viewTo}
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
                      <td className="px-4 md:px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
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
                  d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2-3h2.586a2 2 0 012 2v2h4a2 2 0 012 2v10a2 2 0 01-2 2H5z"
                />
              </svg>
            </div>
            <p className="text-gray-600 text-xl font-semibold mb-2">
              No archived requests yet
            </p>
            <p className="text-gray-500">
              Requests will appear here once they are approved or rejected.
            </p>
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
