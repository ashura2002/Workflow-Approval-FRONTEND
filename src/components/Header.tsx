import axios from "axios";
import React, { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import { FiUser, FiLogOut, FiBell, FiTrash2 } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { LogoutConfirmation } from "./LogoutConfirmation";
import { axiosInstance } from "../utils/axiosInstance";

interface HeaderProps {
  isMobileSidebarOpen?: boolean;
  onToggleMobileSidebar?: () => void;
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
}

const Header: React.FC<HeaderProps> = ({
  isMobileSidebarOpen,
  onToggleMobileSidebar,
}) => {
  const navigate = useNavigate();
  const [isModalShow, setIsModalShow] = useState<boolean>(false);
  const [role, _] = useState<string | null>(localStorage.getItem("role"));
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Fetch notifications from backend API
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const getAllMyNotifications = async () => {
      try {
        const res = await axiosInstance.get("/notification");
        setNotifications(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        }
      }
    };
    getAllMyNotifications();
  }, []);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };

    if (isNotificationOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationOpen]);

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

  const handleMarkAsRead = async (id: number) => {
    try {
      await axiosInstance.patch(`/notification/${id}`);
      setNotifications(
        notifications.map((notif) =>
          notif.id === id ? { ...notif, isRead: true } : notif,
        ),
      );
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Failed to mark as read");
      }
    }
  };

  const handleClearAllNotifications = () => {
    setNotifications([]);
    setIsNotificationOpen(false);
  };

  const handleDeleteNotification = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await axiosInstance.delete(`/notification/${id}`);
      setNotifications(notifications.filter((notif) => notif.id !== id));
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message || "Failed to delete notification",
        );
      }
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

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
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            )}

            <a href="/" className="flex items-center gap-2 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-linear-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-center shadow-md transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                <span className="text-white font-bold text-base sm:text-lg">
                  A
                </span>
              </div>
              <span className="hidden sm:inline font-semibold text-base sm:text-lg bg-linear-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
                Approvly
              </span>
            </a>
          </div>

          {/* Right side user actions - responsive */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification Icon */}
            <div className="relative" ref={notificationRef}>
              <button
                className="
                relative p-2 text-slate-600 hover:text-violet-600 rounded-full hover:bg-violet-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                aria-label="Notifications"
              >
                <FiBell size={18} className="sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center ring-2 ring-white font-semibold">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown - FULLY RESPONSIVE */}
              {isNotificationOpen && (
                <div
                  className=" right-0 mt-2 
                  /* Mobile-first: full width with margins, taller height */
                  w-[calc(100vw-2rem)] max-w-[calc(100vw-2rem)] 
                  /* Tablet and up: fixed width */
                  sm:w-80 sm:max-w-80 
                  /* Large screens: wider */
                  lg:w-96 lg:max-w-96
                  /* Styling */
                  bg-white rounded-lg shadow-xl border border-gray-200 
                  /* Responsive max-height */
                  max-h-[70vh] sm:max-h-96 
                  /* Ensure proper scrolling */
                  overflow-y-auto
                  /* Smooth animations on all screens */
                  transition-all duration-200 ease-out
                  /* Better positioning on mobile */
                  origin-top-right
                  z-50"
                >
                  {/* Header */}
                  <div className="sticky top-0 bg-linear-to-r from-violet-500 to-fuchsia-500 text-white px-4 py-3 rounded-t-lg">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm sm:text-base">
                        Notifications
                      </h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={handleClearAllNotifications}
                          className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors"
                        >
                          Clear All
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Notification Items */}
                  <div className="divide-y divide-gray-200">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          onClick={() => handleMarkAsRead(notification.id)}
                          className={`px-3 sm:px-4 py-3 cursor-pointer transition-colors ${
                            notification.isRead
                              ? "bg-white hover:bg-gray-50"
                              : "bg-blue-50 hover:bg-blue-100"
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {/* Status Indicator */}
                            <div
                              className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                                notification.type === "success"
                                  ? "bg-green-500"
                                  : notification.type === "error"
                                    ? "bg-red-500"
                                    : notification.type === "warning"
                                      ? "bg-yellow-500"
                                      : "bg-blue-500"
                              }`}
                            />

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-800 leading-tight wrap-break-words">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {notification.timestamp}
                              </p>
                            </div>

                            {/* Delete Button - larger touch target on mobile */}
                            <button
                              onClick={(e) =>
                                handleDeleteNotification(notification.id, e)
                              }
                              className="p-1.5 sm:p-1 text-gray-400 hover:text-red-500 rounded hover:bg-red-50 transition-colors shrink-0"
                              aria-label="Delete notification"
                            >
                              <FiTrash2 size={16} className="sm:w-4 sm:h-4" />
                            </button>

                            {/* Unread Badge */}
                            {!notification.isRead && (
                              <div className="w-2 h-2 rounded-full bg-violet-500 shrink-0 mt-1" />
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-500">
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              className="relative p-2 text-slate-600 hover:text-violet-600 rounded-full hover:bg-violet-50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-300"
              onClick={
                role === "Employee" ? goToEmployeeProfile : goToAdminProfile
              }
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
