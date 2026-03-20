import React, { useState } from "react";

interface RequestData {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  userId: number;
  viewTo: string;
  companyId: number;
}

export const EmployeeRequestHistory: React.FC = () => {
  const [requests] = useState<RequestData[]>([
    {
      id: 17,
      leaveType: "PersonalLeave",
      startDate: "2024-10-28T00:00:00.000Z",
      endDate: "2024-10-29T00:00:00.000Z",
      reason: "leave 2",
      createdAt: "2026-03-15T04:22:22.921Z",
      updatedAt: "2026-03-15T04:22:22.921Z",
      status: "Pending",
      userId: 6,
      viewTo: "DepartmentHead",
      companyId: 2,
    },
    {
      id: 18,
      leaveType: "AnnualLeave",
      startDate: "2026-03-20T00:00:00.000Z",
      endDate: "2026-03-25T00:00:00.000Z",
      reason: "Vacation",
      createdAt: "2026-03-10T10:15:00.000Z",
      updatedAt: "2026-03-12T14:30:00.000Z",
      status: "Approved",
      userId: 6,
      viewTo: "DepartmentHead",
      companyId: 2,
    },
    {
      id: 19,
      leaveType: "SickLeave",
      startDate: "2026-03-19T00:00:00.000Z",
      endDate: "2026-03-19T00:00:00.000Z",
      reason: "Medical appointment",
      createdAt: "2026-03-18T08:45:00.000Z",
      updatedAt: "2026-03-18T08:45:00.000Z",
      status: "Rejected",
      userId: 6,
      viewTo: "DepartmentHead",
      companyId: 2,
    },
  ]);

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
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Request History
          </h1>
          <p className="text-gray-600">
            Track your leave and request submissions
          </p>
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
