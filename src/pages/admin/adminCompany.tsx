import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import type { CompanyType } from "../../types/Company.types";

export const AdminCompany: React.FC = () => {
  const [usersLength, setUsersLength] = useState<number>();
  const [role, _] = useState<string | null>(localStorage.getItem("role"));
  const [company, setCompany] = useState<CompanyType>();
  const handleEdit = () => {
    alert("Edit company details");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      alert("Company deleted");
    }
  };

  useEffect(() => {
    const usersOnCompany = async () => {
      try {
        const res = await axiosInstance.get("/users/own-company");
        setUsersLength(res.data.length);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          let message = error?.response?.data?.message;
          toast.error(message);
        }
      }
    };
    usersOnCompany();
  }, []);

  useEffect(() => {
    const getCompany = async () => {
      try {
        const res = await axiosInstance.get("/company");
        setCompany(res.data);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          let message = error?.response?.data?.message;
          toast.error(message);
        }
      }
    };

    getCompany();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Company Details</h1>
        <p className="text-gray-500 mt-1">
          Overview of your company information
        </p>
      </div>

      {/* Company Information Card */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="p-8">
          {/* Company Name */}
          <div className="mb-6">
            <h2 className="text-4xl font-bold text-gray-800">
              {company?.companyName}
            </h2>
          </div>

          {/* Company Description */}
          <div className="mb-8">
            <h3 className="text-sm text-gray-700 uppercase tracking-wider mb-2 font-bold">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {company?.description}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
              Tagline
            </h3>
            <p className="text-gray-600 leading-relaxed">{company?.tagline}</p>
          </div>

          {/* Total Users */}
          <div className="border-t border-gray-200 pt-6 mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">
                Total Users
              </h3>
              <div className="text-4xl font-bold text-blue-600">
                {usersLength}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {role === "Admin" ? (
            <div className="border-t border-gray-200 pt-6 flex gap-4">
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm 
              font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                Edit Company
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm 
              font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                Delete Company
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
