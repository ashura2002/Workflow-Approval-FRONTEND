import React from "react";
import Header from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { Route, Routes, useLocation } from "react-router-dom";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

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
          <aside className="w-64 bg-red-200">
            <Sidebar />
          </aside>
        )}

        <main className="overflow-y-auto border w-full">
          <div>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
