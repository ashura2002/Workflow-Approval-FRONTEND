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
      className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow 
        duration-200 cursor-default border border-gray-100"
    >
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-1">
        {cardTitle}
      </h3>
      <p className="text-4xl font-bold text-gray-800 mb-1">{data}</p>
      <p className="text-sm text-gray-400">{message}</p>
    </div>
  );
};
