import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import type { CompanyType } from "../../types/Company.types";

export const AdminCompany: React.FC = () => {
  const [usersLength, setUsersLength] = useState<number>();
  const [role, _] = useState<string | null>(localStorage.getItem("role"));
  const [companyId, __] = useState<string | null>(
    localStorage.getItem("companyId"),
  );
  const [company, setCompany] = useState<CompanyType>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    companyName: "",
    description: "",
    tagline: "",
  });

  const handleEdit = () => {
    if (company) {
      setFormData({
        companyName: company.companyName || "",
        description: company.description || "",
        tagline: company.tagline || "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      companyName: "",
      description: "",
      tagline: "",
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axiosInstance.patch(`/company/${companyId}`, formData);
      setCompany((prev) =>
        prev
          ? {
              ...prev,
              companyName: formData.companyName,
              description: formData.description,
              tagline: formData.tagline,
            }
          : prev,
      );
      toast.success("Company updated successfully");
      handleCloseModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this company all users will also deleted?",
      )
    ) {
      alert("Company deleted");
    }
    try {
      const res = await axiosInstance.delete(`/company/${company?.id}`);
      toast.success(res.data.message);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        toast.error(error?.response?.data?.message);
      }
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

      {/* Edit Company Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
            {/* Modal Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-bold text-gray-800">Edit Company</h2>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company name"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Enter company description"
                  required
                />
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter company tagline"
                  required
                />
              </div>

              {/* Modal Footer */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-medium"
                >
                  {isLoading ? "Loading..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
