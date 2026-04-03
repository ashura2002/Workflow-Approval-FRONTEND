import React from "react";
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

const App: React.FC = () => {
  const location = useLocation();
  const isHomePage =
    location.pathname === "/" || location.pathname === "/register";

  return (
    <div>
      {!isHomePage && (
        <header>
          <Header />
        </header>
      )}

      <div className="flex h-screen">
        {!isHomePage && (
          <aside className="w-64">
            <Sidebar />
          </aside>
        )}

        <main className="overflow-y-auto w-full p-3">
          <div>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* ADMIN */}
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

              {/* EMPLOYEE */}
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
    </div>
  );
};

export default App;

// TODO EMPLOYEECOMPANY FILE
