import { NavLink } from "react-router-dom";
import { adminNavLinks, employeeLinks } from "../utils/navlinks";
import { useState } from "react";

interface SidebarProps {
  onNavigate?: () => void; // Callback for mobile navigation (closes sidebar)
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const [role, _] = useState<string | null>(localStorage.getItem("role"));

  const handleLinkClick = () => {
    if (onNavigate) {
      onNavigate(); // Close mobile sidebar after navigation
    }
  };

  return (
    <aside className="w-64 h-full bg-white flex flex-col">
      {/* Logo / Header */}
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-linear-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {role || "Approvly"}
          </h1>
        </div>
        <p className="text-xs text-slate-500 mt-2 capitalize">
          {role} Dashboard
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {(role === "Employee"
          ? employeeLinks
          : adminNavLinks.filter(
              (item) =>
                !(
                  item.linkName === "Archives" &&
                  (role === "HR" || role === "DepartmentHead")
                ),
            )
        ).map((item) => (
          <NavLink key={item.linkName} to={item.path} onClick={handleLinkClick}>
            {({ isActive }) => (
              <div
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group cursor-pointer
                  ${
                    isActive
                      ? "bg-linear-to-r from-blue-50 to-indigo-50 text-indigo-700 shadow-sm border border-blue-200/50"
                      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600"
                  }
                `}
              >
                <item.icon
                  size={20}
                  className={
                    isActive
                      ? "text-indigo-600"
                      : "text-slate-400 group-hover:text-indigo-500"
                  }
                />
                <span className="font-medium text-sm">{item.linkName}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-sm" />
                )}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 mt-auto">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span>Approvly v1.0</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;