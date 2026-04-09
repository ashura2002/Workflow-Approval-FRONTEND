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
        console.log("Pending Request", res.data);
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
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Leave Requests</h1>
        <p className="text-gray-500 mt-1">
          Manage and review employee leave requests
        </p>
      </div>

      {/* Table container with card-like styling */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Username</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Start Date</th>
                <th className="px-6 py-4 font-medium">End Date</th>
                <th className="px-6 py-4 font-medium">Leave Type</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {requests.length > 0 ? (
                requests.map((request) => (
                  <tr
                    key={request.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {request.user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {request.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(request.startDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(request.endDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                        {request.leaveType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {request.reason}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="px-4 py-2 bg-green-500 hover:bg-green-600 cursor-pointer
                         text-white rounded-lg text-sm font-medium transition-colors
                          focus:outline-none focus:ring-2 focus:ring-green-300"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 cursor-pointer
                         text-white rounded-lg text-sm font-medium transition-colors
                          focus:outline-none focus:ring-2 focus:ring-red-300"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <p className="text-lg font-medium">No pending requests</p>
                    <p className="text-sm">
                      All leave requests have been processed.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optional: Summary footer */}
      {requests.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {requests.length} pending request
          {requests.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
};
