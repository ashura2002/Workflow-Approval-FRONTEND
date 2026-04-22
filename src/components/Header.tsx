import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { LogoutConfirmation } from "./LogoutConfirmation";
import { axiosInstance } from "../utils/axiosInstance";

interface HeaderProps {
  isMobileSidebarOpen?: boolean;
  onToggleMobileSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  isMobileSidebarOpen, 
  onToggleMobileSidebar 
}) => {
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
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo area - responsive sizing */}
          <div className="flex items-center gap-3">
            {/* Only show hamburger on mobile when toggle function is provided */}
            {onToggleMobileSidebar && (
              <button
                className="p-2 -ml-2 rounded-full text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 lg:hidden transition-colors"
                onClick={onToggleMobileSidebar}
                aria-label={isMobileSidebarOpen ? "Close menu" : "Open menu"}
              >
                {isMobileSidebarOpen ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            )}
            
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-linear-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <span className="text-white font-bold text-base sm:text-lg">A</span>
              </div>
              <span className="hidden sm:inline font-semibold text-base sm:text-lg bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Approvly
              </span>
            </a>
          </div>

          {/* Right side user actions - responsive */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              className="relative p-2 text-slate-600 hover:text-violet-600 rounded-full hover:bg-violet-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
              onClick={role === "Employee" ? goToEmployeeProfile : goToAdminProfile}
              aria-label="User profile"
            >
              <FiUser size={18} className="sm:w-5 sm:h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></span>
            </button>

            <button
              onClick={openLogoutModal}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-linear-to-r from-violet-500 to-fuchsia-500 hover:from-violet-600 hover:to-fuchsia-600 text-white rounded-full text-xs sm:text-sm font-medium transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2"
            >
              <FiLogOut size={14} className="sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Logout</span>
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