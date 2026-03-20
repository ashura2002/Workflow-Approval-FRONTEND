import React, { useState } from "react";
import type { RequestData } from "../../types/RequestData.types";
import { requestDataShape } from "../../utils/mockdata";

export const EmployeeRequestHistory: React.FC = () => {
  const [requests, setRequests] = useState<RequestData[]>(requestDataShape);

  const handleDelete = (id: number) => {
    setRequests(requests.filter((request) => request.id !== id));
  };

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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Request History
            </h1>
            <p className="text-gray-600">
              Track your leave and request submissions
            </p>
          </div>

          <div>
            <button
              className="inline-flex items-center gap-2
               px-4 py-2 rounded-lg bg-red-50 text-red-600
                hover:bg-red-100 border border-red-200 transition-all duration-200 font-medium text-sm hover:shadow-md"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138
                   21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              Delete All
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-linear-to-r from-blue-600 to-indigo-600 text-white">
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Leave Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Start Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    End Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Reason
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    View To
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">
                    Created Date
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      #{request.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="inline-block bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {request.leaveType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(request.startDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(request.endDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {request.reason}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                        {request.viewTo}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(request.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDelete(request.id)}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-all duration-200 font-medium text-sm hover:shadow-md"
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
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {requests.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
            <p className="text-gray-500 text-lg">No requests found</p>
          </div>
        )}
      </div>
    </div>
  );
};

// to do
// get request by id
