import { NavLink } from "react-router-dom";
import { adminNavLinks, employeeLinks } from "../utils/navlinks";
import { useState } from "react";

const Sidebar = () => {
  const [role, _] = useState<string | null>(localStorage.getItem("role"));

  return (
    <aside className="w-64 h-screen bg-white text-gray-800 flex flex-col p-4 border-r border-gray-200">
      <div className="mb-8 px-2">
        {/* if admin role then admin dashboard if hr then hr dashboard */}
        <h1 className="text-xl font-bold">{role} Dashboard</h1>
      </div>

      <nav className="flex-1 space-y-1">
        {role === "Employee" ? (
          <>
            {employeeLinks.map((item) => (
              <NavLink
                key={item.linkName}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.linkName}</span>
              </NavLink>
            ))}
          </>
        ) : (
          <>
            {adminNavLinks.map((item) => (
              <NavLink
                key={item.linkName}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`
                }
              >
                <item.icon size={20} />
                <span>{item.linkName}</span>
              </NavLink>
            ))}
          </>
        )}
      </nav>

      <div className="px-2 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">Approvly</p>
      </div>
    </aside>
  );
};

export default Sidebar;
