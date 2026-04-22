import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import { Route, Routes, useLocation } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { AdminHomepage } from "./pages/admin/adminHomepage";
import Sidebar from "./components/Sidebar";
import { AdminRequests } from "./pages/admin/adminRequests";
import { AdminUsermanagement } from "./pages/admin/adminUsermanagement";
import { AdminCompany } from "./pages/admin/adminCompany";
import { EmployeeHomepage } from "./pages/employee/EmployeeHomepage";
import { EmployeeRequest } from "./pages/employee/EmployeeRequest";
import { EmployeeRequestHistory } from "./pages/employee/EmployeeRequestHistory";
import { EmployeeRequestInfo } from "./pages/employee/EmployeeRequestInfo";
import { AdminArchivesRequest } from "./pages/admin/adminArchivesRequest";
import { EmployeeCompany } from "./pages/employee/EmployeeCompany";
import { ProtectedRoute } from "./components/ProtectedRoute";
import {
  userContext,
  type User,
  type UserContextType,
} from "../src/context/UserContext";
import { AdminRequestInfo } from "./pages/admin/AdminRequestInfo";
import { EmployeeUserProfileForm } from "./pages/employee/EmployeeProfilePage";
import { AdminProfilepage } from "./pages/admin/AdminProfilepage";
import { AdminUserDetails } from "./pages/admin/AdminUserDetails";

// Hook to lock body scroll when sidebar is open
const useLockBodyScroll = (lock: boolean) => {
  useEffect(() => {
    if (lock) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [lock]);
};

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const location = useLocation();

  // State to control mobile sidebar visibility
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Lock body scroll when mobile sidebar is open
  useLockBodyScroll(isMobileSidebarOpen);

  const contextValue: UserContextType = {
    users,
    setUsers,
  };

  const isHomePage =
    location.pathname === "/" || location.pathname === "/register";

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen((prev) => !prev);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div>
      <userContext.Provider value={contextValue}>
        {!isHomePage && (
          <header>
            <Header
              isMobileSidebarOpen={isMobileSidebarOpen}
              onToggleMobileSidebar={toggleMobileSidebar}
            />
          </header>
        )}

        <div className="flex h-screen">
          {/* Desktop Sidebar - visible on lg screens and above */}
          {!isHomePage && (
            <aside className="hidden lg:block w-64 bg-white shadow-md overflow-y-auto">
              <Sidebar />
            </aside>
          )}

          {/* Mobile Sidebar Overlay - Slide-out panel for mobile devices */}
          {!isHomePage && isMobileSidebarOpen && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300"
                onClick={closeMobileSidebar}
              />

              {/* Sidebar panel */}
              <aside className="fixed top-0 left-0 z-50 w-64 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-out lg:hidden">
                {/* Close button inside sidebar for quick access */}
                <div className="flex justify-end p-3 border-b border-gray-100">
                  <button
                    onClick={closeMobileSidebar}
                    className="p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-colors"
                    aria-label="Close menu"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                <div className="overflow-y-auto h-full pb-4">
                  {/* Pass close function to Sidebar for navigation clicks on mobile */}
                  <Sidebar onNavigate={closeMobileSidebar} />
                </div>
              </aside>
            </>
          )}

          {/* Main Content Area - Responsive padding */}
          <main
            className={`
              flex-1 overflow-y-auto 
              p-4 sm:p-5 md:p-6 lg:p-8
              transition-all duration-300
              ${!isHomePage && "lg:ml-0"}
            `}
          >
            <div className="max-w-7xl mx-auto">
              <Routes>
                {/* PUBLIC ROUTES */}
                <Route path="/" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* ADMIN ROUTES */}
                <Route
                  path="/admin-homepage"
                  element={
                    <ProtectedRoute
                      roles={["Admin", "HR", "DepartmentHead"]}
                      element={<AdminHomepage />}
                    />
                  }
                />
                <Route
                  path="/admin-user-details/:id"
                  element={
                    <ProtectedRoute
                      roles={["Admin", "HR", "DepartmentHead"]}
                      element={<AdminUserDetails />}
                    />
                  }
                />
                <Route
                  path="/admin-profile"
                  element={
                    <ProtectedRoute
                      roles={["Admin", "HR", "DepartmentHead"]}
                      element={<AdminProfilepage />}
                    />
                  }
                />
                <Route
                  path="/admin-requests"
                  element={
                    <ProtectedRoute
                      roles={["Admin", "HR", "DepartmentHead"]}
                      element={<AdminRequests />}
                    />
                  }
                />
                <Route
                  path="/admin-company"
                  element={
                    <ProtectedRoute
                      roles={["Admin", "HR", "DepartmentHead"]}
                      element={<AdminCompany />}
                    />
                  }
                />
                <Route
                  path="/admin-user-management"
                  element={
                    <ProtectedRoute
                      roles={["Admin", "HR", "DepartmentHead"]}
                      element={<AdminUsermanagement />}
                    />
                  }
                />
                <Route
                  path="/admin-archives-requests"
                  element={
                    <ProtectedRoute
                      roles={["Admin", "HR", "DepartmentHead"]}
                      element={<AdminArchivesRequest />}
                    />
                  }
                />
                <Route
                  path="/admin-request-details/:id"
                  element={
                    <ProtectedRoute
                      roles={["Admin", "HR", "DepartmentHead"]}
                      element={<AdminRequestInfo />}
                    />
                  }
                />

                {/* EMPLOYEE ROUTES */}
                <Route
                  path="/employee-homepage"
                  element={
                    <ProtectedRoute
                      roles="Employee"
                      element={<EmployeeHomepage />}
                    />
                  }
                />
                <Route
                  path="/employee-profile"
                  element={
                    <ProtectedRoute
                      roles="Employee"
                      element={<EmployeeUserProfileForm />}
                    />
                  }
                />
                <Route
                  path="/employee-requests"
                  element={
                    <ProtectedRoute
                      roles="Employee"
                      element={<EmployeeRequest />}
                    />
                  }
                />
                <Route
                  path="/employee-requests-history"
                  element={
                    <ProtectedRoute
                      roles="Employee"
                      element={<EmployeeRequestHistory />}
                    />
                  }
                />
                <Route
                  path="/employee-request-details/:id"
                  element={
                    <ProtectedRoute
                      roles="Employee"
                      element={<EmployeeRequestInfo />}
                    />
                  }
                />
                <Route
                  path="/employee-company"
                  element={
                    <ProtectedRoute
                      roles="Employee"
                      element={<EmployeeCompany />}
                    />
                  }
                />
              </Routes>
            </div>
          </main>
        </div>
      </userContext.Provider>
    </div>
  );
};

export default App;
