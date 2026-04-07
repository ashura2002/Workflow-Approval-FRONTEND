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
    <div className="min-h-screen bg-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl">
        {/* Top accent bar — indigo gradient matching header logo color */}
        <div className="h-px bg-linear-to-r from-indigo-600 via-indigo-300 to-transparent mb-14" />
        {/* Label */}
        <p className="text-[10px] font-medium tracking-widest uppercase text-indigo-400 mb-5">
          Company Profile
        </p>
        {/* Company Name */}
        <h1 className="text-6xl font-bold text-gray-950 leading-tight tracking-tight mb-2">
          {company?.companyName.split(" ")[0]}{" "}
          <span className="italic font-normal text-indigo-400">
            {company?.companyName.split(" ").slice(1).join(" ")}
          </span>
        </h1>
        {/* Tagline */}
        <p className="text-sm italic text-gray-400 mb-12">{company?.tagline}</p>

        {/* Short divider */}
        <div className="w-12 h-px bg-indigo-100 mb-12" />
        {/* Description */}
        <p className="text-base font-light leading-relaxed text-gray-500 mb-14 max-w-xl">
          {company?.description}
        </p>
        {/* Meta row */}
        {/* <div className="flex flex-wrap gap-6">
          {[
            { key: "Founded", value: company.founded },
            { key: "Team Size", value: company.size },
            { key: "Location", value: company.location },
          ].map(({ key, value }) => (
            <div
              key={key}
              className="flex flex-col gap-1 bg-indigo-50 border border-indigo-100 rounded-lg px-5 py-3"
            >
              <span className="text-[10px] font-medium tracking-widest uppercase text-indigo-400">
                {key}
              </span>
              <span className="text-sm font-medium text-gray-800">{value}</span>
            </div>
          ))}
        </div> */}
        {/* Bottom rule */}
        <div className="h-px bg-indigo-50 mt-14" />
      </div>
    </div>
  );
};
