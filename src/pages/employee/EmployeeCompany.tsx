import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../utils/axiosInstance";
import axios from "axios";
import toast from "react-hot-toast";
import type { CompanyType } from "../../types/Company.types";

export const EmployeeCompany: React.FC = () => {
  const [company, setCompany] = useState<CompanyType>();

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
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-indigo-50/30 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold bg-linear-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
            Company Profile
          </h1>
          <p className="text-slate-500 mt-1">View your organization details</p>
        </div>

        {/* Company Card */}
        <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border border-slate-200">
          <div className="flex flex-col md:flex-row">
            {/* Left sidebar - accent + logo */}
            <div className="md:w-1/3 bg-linear-to-b from-indigo-50 to-white p-6 border-r border-slate-100 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-linear-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md mb-4">
                <span className="text-white text-3xl font-bold">
                  {company?.companyName?.charAt(0).toUpperCase() || "C"}
                </span>
              </div>
              <div className="w-12 h-0.5 bg-indigo-200 my-3"></div>
              <p className="text-xs text-indigo-500 font-medium uppercase tracking-wider">
                Est. {new Date().getFullYear()}
              </p>
            </div>

            {/* Right content - company details */}
            <div className="md:w-2/3 p-6 md:p-8">
              <div className="mb-5">
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-1">
                  {company?.companyName}
                </h2>
                {company?.tagline && (
                  <p className="text-indigo-500 text-sm italic">
                    "{company.tagline}"
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {/* Description */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <svg
                      className="w-4 h-4 text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                      About
                    </h3>
                  </div>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {company?.description}
                  </p>
                </div>

                {/* Optional metadata row - you can add more fields if needed */}
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <svg
                      className="w-4 h-4 text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>ID: {company?.id || "—"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};