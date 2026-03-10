import React from "react";
import { FiUser, FiLogOut } from "react-icons/fi"; // Optional icons

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <span className="text-gray-800 font-semibold text-lg hidden sm:block">
                AppName
              </span>
            </a>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition">
              <FiUser size={20} />
            </button>
            <button className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition">
              <FiLogOut size={20} />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
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
    </header>
  );
};

export default Header;
