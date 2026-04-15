import React, { useEffect, useState } from "react";
import { Cards } from "../../components/Cards";
import { recentActivity } from "../../utils/mockdata";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import type { UserInterface } from "../../types/user.types";
import { FiUsers, FiUserCheck, FiShield, FiTrendingUp } from "react-icons/fi";

export const AdminHomepage: React.FC = () => {
  const [name, _] = useState<string | null>(localStorage.getItem("username"));
  const [usersLength, setUsersLength] = useState<number>();
  const [activeUsers, setActiveUsers] = useState<number>();
  const [totalRequestPerDay, setTotalRequestPerDay] = useState<number>();

  useEffect(() => {
    const requestPerDay = async () => {
      try {
        const res = await axiosInstance.get("/requests/todays-record");
        setTotalRequestPerDay(res.data.length);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(error?.response?.data?.message);
        }
      }
    };
    requestPerDay();
  }, []);

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

  const workflowSteps = [
    {
      title: "Department Head",
      icon: FiUsers,
      description: "First approval level",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "HR",
      icon: FiUserCheck,
      description: "Second approval level",
      color: "from-indigo-500 to-purple-500",
    },
    {
      title: "Admin",
      icon: FiShield,
      description: "Final approval level",
      color: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/30 to-purple-50/20 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome back,{" "}
            <span className="font-semibold text-indigo-600">
              {name?.toLocaleUpperCase()}
            </span>{" "}
            Here's what's happening today.
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <div className="transform transition-all duration-300 hover:scale-105">
            <Cards
              cardTitle="Total Users"
              data={usersLength ? usersLength : 0}
              message="Currently on this company"
            />
          </div>
          <div className="transform transition-all duration-300 hover:scale-105">
            <Cards
              cardTitle="Active Users"
              data={activeUsers ? activeUsers : 0}
              message="Currently active"
            />
          </div>
          <div className="transform transition-all duration-300 hover:scale-105">
            <Cards
              cardTitle="Today's Requests"
              data={totalRequestPerDay ? totalRequestPerDay : 0}
              message="Total requests today"
            />
          </div>
        </div>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* Recent Activity Table */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all border border-slate-200/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-linear-to-r from-indigo-50/50 to-purple-50/50">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Recent Activity
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase tracking-wider bg-slate-50/50">
                  <tr>
                    <th className="px-6 py-3 font-medium">Action</th>
                    <th className="px-6 py-3 font-medium">User</th>
                    <th className="px-6 py-3 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentActivity.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-indigo-50/30 transition-colors duration-150"
                    >
                      <td className="px-6 py-3 font-medium text-slate-800">
                        {item.action}
                      </td>
                      <td className="px-6 py-3 text-slate-600">{item.user}</td>
                      <td className="px-6 py-3 text-slate-400 text-xs">
                        {item.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Request Distribution (Pie Chart Placeholder) */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md hover:shadow-lg transition-all border border-slate-200/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-linear-to-r from-indigo-50/50 to-purple-50/50">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Request Distribution
              </h2>
            </div>
            <div className="p-6 flex flex-col items-center justify-center">
              <div className="relative w-40 h-40 mb-4">
                <div className="absolute inset-0 rounded-full bg-slate-200"></div>
                <div
                  className="absolute inset-0 rounded-full bg-indigo-500"
                  style={{
                    clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 35%)",
                  }}
                ></div>
                <div
                  className="absolute inset-0 rounded-full bg-emerald-500"
                  style={{
                    clipPath: "polygon(50% 50%, 100% 35%, 100% 70%, 75% 70%)",
                  }}
                ></div>
                <div
                  className="absolute inset-0 rounded-full bg-amber-500"
                  style={{
                    clipPath: "polygon(50% 50%, 75% 70%, 25% 70%, 0% 35%)",
                  }}
                ></div>
                <div
                  className="absolute inset-0 rounded-full bg-rose-500"
                  style={{
                    clipPath: "polygon(50% 50%, 0% 35%, 0% 0%, 50% 0%)",
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white rounded-full shadow-inner"></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
                  <span className="text-slate-600">Sick Leave (35%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-slate-600">Vacation (35%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-slate-600">Personal (20%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                  <span className="text-slate-600">Other (10%)</span>
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-5 pt-2 border-t border-slate-100">
                Based on last 30 days
              </p>
            </div>
          </div>
        </div>

        {/* System Description - Approval Workflow (now at the bottom) */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-slate-200/50 p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 rounded-full mb-4">
                <FiTrendingUp className="w-4 h-4 text-indigo-600" />
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  Multi‑Tenant Approval Workflow
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
                How Requests Are Approved
              </h2>
              <p className="text-slate-500 mt-2 max-w-lg mx-auto">
                Every request moves through a structured three‑step approval
                process
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              {workflowSteps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <div
                    key={idx}
                    className="relative flex flex-col items-center text-center p-5 bg-white/50 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all"
                  >
                    {idx < workflowSteps.length - 1 && (
                      <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-linear-to-r from-indigo-300 to-purple-300"></div>
                    )}
                    <div
                      className={`p-3 rounded-xl bg-linear-to-r ${step.color} text-white shadow-md mb-3`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-6">
              <p>
                <span className="font-medium text-indigo-600">
                  ➤ Department Head
                </span>{" "}
                reviews first →
                <span className="font-medium text-indigo-600"> ➤ HR</span>{" "}
                reviews second →
                <span className="font-medium text-indigo-600"> ➤ Admin</span>{" "}
                gives final approval.
              </p>
              <p className="mt-2">
                This ensures proper oversight and accountability across your
                organization.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
