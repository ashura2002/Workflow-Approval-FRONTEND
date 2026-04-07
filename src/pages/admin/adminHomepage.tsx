import React, { useEffect, useState } from "react";
import { Cards } from "../../components/Cards";
import { recentActivity } from "../../utils/mockdata";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import type { UserInterface } from "../../types/user.types";

export const AdminHomepage: React.FC = () => {
  const [name, _] = useState<string | null>(localStorage.getItem("username"));
  const [usersLength, setUsersLength] = useState<number>();
  const [activeUsers, setActiveUsers] = useState<number>();

  useEffect(() => {
    const usersOnCompany = async () => {
      try {
        const res = await axiosInstance.get("/users/own-company");
        const activeUsersLength = res.data;
        const activeUserList = activeUsersLength.filter(
          (user: UserInterface) => user.isActive,
        );
        setActiveUsers(activeUserList.length);
        setUsersLength(res.data.length);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          let message = error?.response?.data?.message;
          toast.error(message);
        }
      }
    };
    usersOnCompany();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome back! {name?.toLocaleUpperCase()} Here's what's happening
          today.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Cards
          cardTitle="Users"
          data={usersLength ? usersLength : 0}
          message="Currently on this Company"
        />

        <Cards
          cardTitle="Active Users"
          data={activeUsers ? activeUsers : 0}
          message="Currently on this company"
        />
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Table Placeholder - Recent Activity */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-800">Recent Activity</h2>
          </div>
          <div className="p-6">
            <table className="w-full text-sm text-left text-gray-600">
              <thead className="text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="pb-3 font-medium">Action</th>
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentActivity.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 font-medium text-gray-900">
                      {item.action}
                    </td>
                    <td className="py-3">{item.user}</td>
                    <td className="py-3 text-gray-400">{item.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pie Chart Placeholder */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-800">
              Request Distribution
            </h2>
          </div>
          <div className="p-6 flex flex-col items-center justify-center">
            {/* Simple donut chart visual (pure CSS) */}
            <div className="relative w-40 h-40 mb-4">
              <div className="absolute inset-0 rounded-full bg-gray-200"></div>
              <div
                className="absolute inset-0 rounded-full bg-blue-500"
                style={{
                  clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 35%)",
                }}
              ></div>
              <div
                className="absolute inset-0 rounded-full bg-green-500"
                style={{
                  clipPath: "polygon(50% 50%, 100% 35%, 100% 70%, 75% 70%)",
                }}
              ></div>
              <div
                className="absolute inset-0 rounded-full bg-yellow-500"
                style={{
                  clipPath: "polygon(50% 50%, 75% 70%, 25% 70%, 0% 35%)",
                }}
              ></div>
              <div
                className="absolute inset-0 rounded-full bg-red-500"
                style={{
                  clipPath: "polygon(50% 50%, 0% 35%, 0% 0%, 50% 0%)",
                }}
              ></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-full"></div>
              </div>
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Sick Leave (35%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Vacation (35%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Personal (20%)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-gray-600">Other (10%)</span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-4">Based on last 30 days</p>
          </div>
        </div>
      </div>
    </div>
  );
};
