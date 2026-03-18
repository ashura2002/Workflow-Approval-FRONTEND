import React from "react";
import { companyData } from "../../utils/mockdata";

export const AdminCompany: React.FC = () => {
  const handleEdit = () => {
    alert("Edit company details");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      alert("Company deleted");
    }
  };

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
              {companyData.CompanyName}
            </h2>
          </div>

          {/* Company Description */}
          <div className="mb-8">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {companyData.description}
            </p>
          </div>

          {/* Total Users */}
          <div className="border-t border-gray-200 pt-6 mb-8">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                Total Users
              </h3>
              <div className="text-4xl font-bold text-blue-600">
                {companyData.totalUsers}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
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
        </div>
      </div>
    </div>
  );
};
