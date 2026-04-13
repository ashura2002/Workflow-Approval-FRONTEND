import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import type { UserInterface } from "../../types/user.types";
import { Button } from "../../components/Button";
import { AddUser } from "../../components/AddUser";
import { CirclePlusIcon } from "lucide-react";
import { UpdateUser } from "../../components/UpdateUser";

export const AdminUsermanagement: React.FC = () => {
  const [users, setUsers] = useState<UserInterface[]>([]);
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
      await axiosInstance.patch(
        `/users/details/${Number(selectedUser.id)}`,
        data,
      );

      toast.success("User updated successfully");
      setIsEditModalOpen(false);
      fetchUsers(); // refresh table
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    // TODO: implement delete API
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8 flex justify-between px-3">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-500 mt-1">
            Manage employee accounts and permissions
          </p>
        </div>
        {role === "Admin" && (
          <Button
            text="Add User"
            icons={<CirclePlusIcon />}
            onClick={() => setIsAddModalOpen(true)}
          />
        )}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="bg-gray-50 text-gray-700 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                {role === "Admin" && (
                  <th className="px-6 py-4 font-medium text-center">Action</th>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {users.length > 0 ? (
                users.map((user) => (
                  <tr
                    key={user.email}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {user.username}
                    </td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 font-medium">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                          !!user.isActive,
                        )}`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {role === "Admin" && (
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(user.id)}
                          className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium"
                        >
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <p className="text-lg font-medium">No users found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {users.length > 0 && (
        <div className="mt-4 text-sm text-gray-500">
          Showing {users.length} users ({users.filter((u) => u.isActive).length}{" "}
          active)
        </div>
      )}

      <AddUser
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
      <UpdateUser
        isOpen={isEditModalOpen} // sa boolean value
        onClose={() => setIsEditModalOpen(false)} // setter function
        onSubmit={handleUpdateUser} // the main update function
        initialData={
          selectedUser
            ? {
                username: selectedUser.username,
                role: selectedUser.role,
              }
            : undefined
        } // default data 
      />
    </div>
  );
};
