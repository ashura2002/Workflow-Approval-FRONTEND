import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import type { UserInterface } from "../../types/user.types";

export const AdminUsermanagement: React.FC = () => {
  const [users, setUsers] = useState<UserInterface[]>([]);
  const [role, _] = useState<string | null>(localStorage.getItem("role"));

  const handleEdit = (id: number) => {
    alert(`Edit user ${id}`);
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter((user) => user.userId !== id));
    alert(`User ${id} deleted`);
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  useEffect(() => {
    const getAllUsersOnCompany = async () => {
      try {
        const res = await axiosInstance.get("/users/own-company");
        setUsers(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          let message = error?.response?.data?.message;
          toast.error(message);
        }
      }
    };
    getAllUsersOnCompany();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-500 mt-1">
          Manage employee accounts and permissions
        </p>
      </div>

      {/* Table container with card-like styling */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                {role === "Admin" ? (
                  <th className="px-6 py-4 font-medium text-center">Action</th>
                ) : null}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                          user.isActive!,
                        )}`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    {role === "Admin" ? (
                      <td className="px-6 py-4 whitespace-nowrap text-center space-x-2">
                        <button
                          onClick={() => handleEdit(Number(user.userId))}
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 cursor-pointer
                         text-white rounded-lg text-sm font-medium transition-colors
                          focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.userId)}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 cursor-pointer
                         text-white rounded-lg text-sm font-medium transition-colors
                          focus:outline-none focus:ring-2 focus:ring-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    ) : null}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm">
                      Start adding users to manage them.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Optional: Summary footer */}
      {users.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {users.length} total user{users.length !== 1 ? "s" : ""} (
          {users.filter((u) => u.isActive).length} active)
        </div>
      )}
    </div>
  );
};
