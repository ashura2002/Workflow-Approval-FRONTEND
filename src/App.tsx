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
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route path="/admin-homepage" element={<AdminHomepage />} />
              <Route path="/admin-requests" element={<AdminRequests />} />
              <Route path="/admin-company" element={<AdminCompany />} />
              <Route
                path="/admin-user-management"
                element={<AdminUsermanagement />}
              />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
