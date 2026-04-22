import React, { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import type { UserInterface } from "../../types/user.types";
import { Button } from "../../components/Button";
import { AddUser } from "../../components/AddUser";
import { CirclePlusIcon, RefreshCw, Trash2, Edit, AlertCircle } from "lucide-react";
import { UpdateUser } from "../../components/UpdateUser";
import { userContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";

// Confirmation Modal Component
const ConfirmDeleteModal: React.FC<{
  isOpen: boolean;
  userName: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ isOpen, userName, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all animate-fade-in-up">
        <div className="p-5 sm:p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-full bg-rose-100">
              <Trash2 className="w-5 h-5 sm:w-6 sm:h-6 text-rose-600" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-800">Delete User</h3>
          </div>
          <p className="text-slate-600 text-sm sm:text-base mb-2">
            Are you sure you want to delete <strong>{userName}</strong>?
          </p>
          <p className="text-xs sm:text-sm text-slate-500 mb-5 sm:mb-6">This action cannot be undone.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-xl bg-linear-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white font-medium transition-all shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
            >
              Yes, Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Skeleton Loader for User Card
const UserSkeleton: React.FC = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-pulse">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 gap-4">
      <div className="flex items-center gap-3 sm:gap-4 flex-1">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-200 shrink-0"></div>
        <div className="flex-1">
          <div className="h-5 bg-slate-200 rounded w-28 mb-2"></div>
          <div className="h-4 bg-slate-200 rounded w-40"></div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <div className="h-9 w-16 bg-slate-200 rounded-lg"></div>
        <div className="h-9 w-16 bg-slate-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export const AdminUsermanagement: React.FC = () => {
  const context = useContext(userContext);
  if (!context) return <div>Loading...</div>;
  const navigate = useNavigate();

  const { users, setUsers } = context;
  const [role] = useState<string | null>(localStorage.getItem("role"));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [refreshing, setRefreshing] = useState(false);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; userId: number | null; userName: string }>({
    isOpen: false,
    userId: null,
    userName: "",
  });

  const fetchUsers = async (showToast = false) => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosInstance.get("/users/own-company");
      setUsers(res.data);
      if (showToast) toast.success("Users refreshed");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const msg = error?.response?.data?.message || "Failed to load users";
        setError(msg);
        toast.error(msg);
      } else {
        setError("Something went wrong");
        toast.error("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (id: number) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleUpdateUser = async (data: { username: string; password: string; role: string }) => {
    if (!selectedUser) return;
    try {
      await axiosInstance.patch(`/users/details/${selectedUser.id}`, data);
      toast.success("User updated successfully");
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  const gotoUserDetails = (userId: number) => {
    navigate(`/admin-user-details/${userId}`);
  };

  const openDeleteModal = (id: number, userName: string) => {
    setDeleteModal({ isOpen: true, userId: id, userName });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, userId: null, userName: "" });
  };

  const handleDelete = async () => {
    if (!deleteModal.userId) return;
    try {
      const res = await axiosInstance.delete(`users/details/${deleteModal.userId}`);
      setUsers((prev) => prev.filter((user) => user.id !== deleteModal.userId));
      toast.success(res.data.message || "User deleted successfully");
      closeDeleteModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await fetchUsers(true);
    setRefreshing(false);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-emerald-100 text-emerald-700"
      : "bg-rose-100 text-rose-700";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 p-4 sm:p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-linear-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-slate-500 text-sm sm:text-base mt-1">
              Manage employee accounts and permissions
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={refreshData}
              disabled={refreshing || loading}
              className="p-2 rounded-full bg-white/80 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50"
              aria-label="Refresh users"
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
            </button>
            {role === "Admin" && (
              <Button
                text="Add User"
                icons={<CirclePlusIcon className="w-4 h-4" />}
                onClick={() => setIsAddModalOpen(true)}
              />
            )}
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <p className="text-red-700 text-sm flex-1">{error}</p>
            <button
              onClick={() => fetchUsers()}
              className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <UserSkeleton key={i} />
            ))}
          </div>
        )}

        {/* User list */}
        {!loading && !error && users.length > 0 && (
          <div className="space-y-3">
            {users.map((user: UserInterface) => (
              <div
                key={user.id}
                onClick={() => gotoUserDetails(user.id)}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 hover:border-indigo-200 overflow-hidden cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-5 gap-4">
                  {/* Left side */}
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-base sm:text-lg shadow-sm shrink-0">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800 text-base sm:text-lg truncate">
                          {user.username}
                        </h3>
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-700">
                          {user.role}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            !!user.isActive,
                          )}`}
                        >
                          {user.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      <p className="text-slate-500 text-xs sm:text-sm truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Actions - Admin only */}
                  {role === "Admin" && (
                    <div className="flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300 flex items-center gap-1"
                      >
                        <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Edit</span>
                      </button>
                      <button
                        onClick={() => openDeleteModal(user.id, user.username)}
                        className="px-3 py-1.5 sm:px-4 sm:py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden xs:inline">Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && users.length === 0 && (
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-8 sm:p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <p className="text-lg sm:text-xl font-semibold text-slate-700">No users found</p>
              <p className="text-slate-500 text-sm sm:text-base mt-1">
                {role === "Admin"
                  ? "Click 'Add User' to create your first employee account."
                  : "No users are currently available."}
              </p>
            </div>
          </div>
        )}

        {/* Summary footer */}
        {!loading && !error && users.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-indigo-600">{users.length}</span> users (
              <span className="font-medium text-emerald-600">
                {users.filter((u) => u.isActive).length}
              </span> active)
            </p>
          </div>
        )}

        {/* Modals */}
        <AddUser
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onUserAdded={() => fetchUsers()}
        />
        <UpdateUser
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleUpdateUser}
          initialData={
            selectedUser
              ? {
                  username: selectedUser.username,
                  role: selectedUser.role,
                }
              : undefined
          }
        />
        <ConfirmDeleteModal
          isOpen={deleteModal.isOpen}
          userName={deleteModal.userName}
          onConfirm={handleDelete}
          onCancel={closeDeleteModal}
        />
      </div>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        @media (min-width: 480px) { .xs\\:inline { display: inline; } }
      `}</style>
    </div>
  );
};