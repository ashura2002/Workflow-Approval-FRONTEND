import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FiUser, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { LogoutConfirmation } from "./LogoutConfirmation";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isModalShow, setIsModalShow] = useState<boolean>(false);

  const openLogoutModal = () => {
    setIsModalShow(true);
  };

  const closeLogoutModal = () => {
    setIsModalShow(false);
  };

  const handleLogout = () => {
    try {
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
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-linear-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center shadow-md transition-transform group-hover:scale-105">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className=" font-semibold text-lg hidden sm:block bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Approvly
              </span>
            </a>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100/80 transition-all duration-200">
              <FiUser size={20} />
            </button>
            <button
              onClick={openLogoutModal}
              className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100/80 transition-all duration-200"
            >
              <FiLogOut size={20} />
            </button>
          </div>

          {/* Mobile menu button (kept for design, no new functionality) */}
          <div className="md:hidden flex items-center">
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100/80 focus:outline-none transition-colors">
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
        message="  You'll need to sign in again to access your account."
        firstBtnText="Cancel"
        secondBtnText="Yes, Log out"
        onConfirm={handleLogout}
        onClose={closeLogoutModal}
      />
    </header>
  );
};

export default Header;
