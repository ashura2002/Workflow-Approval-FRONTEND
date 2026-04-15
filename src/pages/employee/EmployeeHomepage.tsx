import React, { useEffect, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiSun,
  FiSmile,
  FiUserCheck,
  FiShield,
  FiUsers,
  FiTrendingUp,
} from "react-icons/fi";

export const EmployeeHomepage: React.FC = () => {
  const [name, _] = useState<string | null>(localStorage.getItem("username"));
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const formattedDate = time.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Determine greeting based on hour
  const hour = time.getHours();
  let greeting = "Good morning";
  if (hour >= 12 && hour < 18) greeting = "Good afternoon";
  if (hour >= 18) greeting = "Good evening";

  // Workflow steps
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
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-indigo-50/50 to-purple-50/30 relative overflow-hidden">
      {/* Decorative animated blob */}
      <div className="absolute top-0 -left-40 w-80 h-80 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section with user greeting */}
        <div className="mb-12 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full shadow-sm border border-slate-200/50 mb-6">
            <FiSmile className="w-4 h-4 text-indigo-500" />
            <span className="text-sm font-medium text-slate-600">
              {greeting}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-800 tracking-tight">
            Welcome back,{" "}
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {name || "Employee"}
            </span>
          </h1>
          <p className="text-lg text-slate-500 mt-3 max-w-2xl mx-auto md:mx-0">
            Hope you're having a great day. Here's your current time and date.
          </p>
        </div>

        {/* Time Card - Enhanced with glassmorphism and subtle animation */}
        <div className="flex justify-center mb-16">
          <div className="group w-full max-w-md bg-white/70 backdrop-blur-md rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-white/40 overflow-hidden transform hover:scale-105">
            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-linear-to-br from-indigo-500 to-purple-500 rounded-2xl shadow-md">
                    <FiClock className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">
                    Current Time
                  </h2>
                </div>
                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                  <FiSun className="w-4 h-4 text-amber-500" />
                </div>
              </div>
              <div className="text-center py-6">
                <p className="text-7xl font-bold tracking-tighter text-transparent bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text">
                  {formattedTime}
                </p>
                <div className="flex items-center justify-center mt-6 space-x-2 text-slate-500 bg-slate-100/50 px-4 py-2 rounded-full w-fit mx-auto">
                  <FiCalendar className="w-4 h-4 text-indigo-400" />
                  <p className="text-sm font-medium">{formattedDate}</p>
                </div>
              </div>
            </div>
            {/* Decorative bottom accent */}
            <div className="h-1 w-full bg-linear-to-r from-indigo-500 to-purple-500"></div>
          </div>
        </div>

        {/* System Description - Approval Workflow */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow-lg border border-white/40 p-6 md:p-8">
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
                    {/* Connector line (desktop) */}
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

        {/* Inspirational quote */}
        <div className="mt-12 text-center">
          <p className="text-sm text-slate-400 italic">
            "Make today count. Every small step leads to big achievements."
          </p>
        </div>
      </div>
    </div>
  );
};
