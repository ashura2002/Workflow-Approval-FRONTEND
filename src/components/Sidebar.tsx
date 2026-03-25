import { NavLink } from "react-router-dom";
import { adminNavLinks, employeeLinks } from "../utils/navlinks";
import { useState } from "react";

const Sidebar = () => {
  const [role, _] = useState<string | null>(localStorage.getItem("role"));

  return (
    <aside className="w-72 h-screen sticky top-0 bg-white/80 backdrop-blur-md border-r border-gray-200/50 shadow-lg flex flex-col">
      {/* Logo / Header */}
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <h1 className="text-xl font-bold bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            {role || "Approvly"}
          </h1>
        </div>
        <p className="text-xs text-gray-500 mt-2 capitalize">
          {role} Dashboard
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {(role === "Employee" ? employeeLinks : adminNavLinks).map((item) => (
          <NavLink key={item.linkName} to={item.path}>
            {({ isActive }) => (
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-linear-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm border border-indigo-200/50"
                    : "text-gray-600 hover:bg-gray-100/80 hover:text-gray-900"
                }`}
              >
                <item.icon
                  size={20}
                  className={
                    isActive
                      ? "text-indigo-600"
                      : "text-gray-400 group-hover:text-gray-600"
                  }
                />
                <span className="font-medium">{item.linkName}</span>
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200/50">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Approvly v1.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
