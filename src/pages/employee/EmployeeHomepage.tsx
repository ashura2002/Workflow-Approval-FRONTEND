import React, { useEffect, useState } from "react";
import {
  FiCalendar,
  FiClock,
  FiBriefcase,
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

  // Quick stats (dummy data – purely decorative)
  const stats = [
    {
      label: "Projects",
      value: "4",
      icon: FiBriefcase,
      color: "from-blue-500 to-cyan-500",
    },
    {
      label: "Team Members",
      value: "12",
      icon: FiUsers,
      color: "from-purple-500 to-pink-500",
    },
    {
      label: "Tasks Completed",
      value: "28",
      icon: FiTrendingUp,
      color: "from-green-500 to-emerald-500",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-indigo-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight">
            Welcome back,{" "}
            <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {name || "Employee"}
            </span>
          </h1>
          <p className="text-lg text-gray-500 mt-2">
            Here's what's happening with your work today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100/50"
              >
                <div
                  className={`absolute inset-0 bg-linear-to-r ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                />
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`p-3 rounded-xl bg-linear-to-r ${stat.color} text-white shadow-md`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-3xl font-bold text-gray-800">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Time Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-100/50">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FiClock className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Current Time
                </h2>
              </div>
              <div className="text-center py-4">
                <p className="text-6xl font-bold text-transparent bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text">
                  {formattedTime}
                </p>
                <div className="flex items-center justify-center mt-4 space-x-2 text-gray-500">
                  <FiCalendar className="w-4 h-4" />
                  <p className="text-sm">{formattedDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Tasks / Announcements (decorative) */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-100/50">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FiTrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Today's Focus
                </h2>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 mt-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Complete project report
                    </p>
                    <p className="text-sm text-gray-500">Due by 5:00 PM</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 mt-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Team sync meeting
                    </p>
                    <p className="text-sm text-gray-500">
                      2:30 PM - Conference Room A
                    </p>
                  </div>
                </li>
                <li className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-800">
                      Review pull requests
                    </p>
                    <p className="text-sm text-gray-500">3 items pending</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
