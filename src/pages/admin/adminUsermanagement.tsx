import React, { useContext, useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import type { UserInterface } from "../../types/user.types";
import { Button } from "../../components/Button";
import { AddUser } from "../../components/AddUser";
import { CirclePlusIcon } from "lucide-react";
import { UpdateUser } from "../../components/UpdateUser";
import { userContext } from "../../context/UserContext";

export const AdminUsermanagement: React.FC = () => {
  const context = useContext(userContext);
  if (!context) return <div>Loading...</div>;

  const { users, setUsers } = context;
  const [role] = useState<string | null>(localStorage.getItem("role"));
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInterface | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await axiosInstance.get("/users/own-company");
      setUsers(res.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
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

  const handleUpdateUser = async (data: {
    username: string;
    password: string;
    role: string;
  }) => {
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

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await axiosInstance.delete(`users/details/${id}`);
      setUsers((prev) => prev.filter((user) => user.id !== id));
      toast.success(res.data.message);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-emerald-100 text-emerald-700"
      : "bg-rose-100 text-rose-700";
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 p-6 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header with title and add button */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-slate-500 mt-1">
              Manage employee accounts and permissions
            </p>
          </div>
          {role === "Admin" && (
            <Button
              text="Add User"
              icons={<CirclePlusIcon className="w-4 h-4" />}
              onClick={() => setIsAddModalOpen(true)}
            />
          )}
        </div>

        {/* List layout */}
        {users.length > 0 ? (
          <div className="space-y-3">
            {users.map((user: UserInterface) => (
              <div
                key={user.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 hover:border-indigo-200 overflow-hidden"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-5 gap-4">
                  {/* Left side: Avatar + info */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-full bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-lg shadow-sm shrink-0">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold text-slate-800 text-lg truncate">
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
                      <p className="text-slate-500 text-sm truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  {/* Right side: Actions (Admin only) */}
                  {role === "Admin" && (
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleEdit(user.id)}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 cursor-pointer text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="px-4 py-2 bg-rose-500 hover:bg-rose-600 cursor-pointer text-white rounded-lg text-sm font-medium transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-rose-300"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-2xl shadow-md border border-slate-200 p-12 text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-indigo-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <p className="text-xl font-semibold text-slate-700">
                No users found
              </p>
              <p className="text-slate-500 mt-1">
                {role === "Admin"
                  ? "Click 'Add User' to create your first employee account."
                  : "No users are currently available."}
              </p>
            </div>
          </div>
        )}

        {/* Summary footer */}
        {users.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-indigo-600">
                {users.length}
              </span>{" "}
              users (
              <span className="font-medium text-emerald-600">
                {users.filter((u) => u.isActive).length}
              </span>{" "}
              active)
            </p>
          </div>
        )}

        {/* Modals - unchanged */}
        <AddUser
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
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
      </div>
    </div>
  );
};
