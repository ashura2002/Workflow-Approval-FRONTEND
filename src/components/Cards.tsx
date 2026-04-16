import React from "react";

interface AdminHomepagePros {
  cardTitle: string;
  data: number;
  message: string;
}

export const Cards: React.FC<AdminHomepagePros> = ({
  cardTitle,
  data,
  message,
}) => {
  return (
    <div
      className="group bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/50 p-6 
                 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-default"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-2">
            {cardTitle}
          </h3>
          <p className="text-4xl font-bold bg-linear-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent">
            {data}
          </p>
          <p className="text-sm text-slate-400 mt-2">{message}</p>
        </div>
        {/* Optional decorative accent – can be removed or made dynamic later */}
        <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    </div>
  );
};
