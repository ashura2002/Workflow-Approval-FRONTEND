import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { LogoutConfirmation } from "./LogoutConfirmation";
import { axiosInstance } from "../utils/axiosInstance";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isModalShow, setIsModalShow] = useState<boolean>(false);
  const [role, _] = useState<string | null>(localStorage.getItem("role"));
  const goToEmployeeProfile = () => {
    navigate("/employee-profile");
  };

  const goToAdminProfile = () => {
    navigate("/admin-profile");
  };

  const openLogoutModal = () => {
    setIsModalShow(true);
  };

  const closeLogoutModal = () => {
    setIsModalShow(false);
  };

  const handleLogout = async () => {
    try {
      const res = await axiosInstance.post("/auth/logout");
      toast.success(res.data.message);
      localStorage.clear();
      setIsModalShow(false);
      navigate("/");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "Logout Failed";
        toast.error(message);
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-xl border-b border-white/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Left side */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-linear-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-semibold text-lg hidden sm:block bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Approvly
              </span>
            </a>
          </div>

          {/* Right side: user actions */}
          <div className="flex items-center gap-3">
            {/* User profile button with badge */}
            <button
              className="relative p-2 text-slate-600 hover:text-violet-600 rounded-full hover:bg-violet-50 transition-all duration-200"
              onClick={
                role === "Employee" ? goToEmployeeProfile : goToAdminProfile
              }
            >
              <FiUser size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </button>

            {/* Logout button */}
            <button
              onClick={openLogoutModal}
              className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-full text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <FiLogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Mobile menu button (preserved for responsiveness) */}
          <div className="md:hidden flex items-center">
            <button className="p-2 rounded-md text-slate-500 hover:text-violet-600 hover:bg-violet-50 focus:outline-none transition-colors">
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <LogoutConfirmation
        isOpen={isModalShow}
        title="Log Out"
        content="Are you sure you want to log out?"
        message="You'll need to sign in again to access your account."
        firstBtnText="Cancel"
        secondBtnText="Yes, Log out"
        onConfirm={handleLogout}
        onClose={closeLogoutModal}
      />
    </header>
  );
};

export default Header;
