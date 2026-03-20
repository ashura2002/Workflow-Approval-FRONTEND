import React, { useEffect, useState } from "react";

type EmployeeHomepageProps = {
  name?: string;
};

export const EmployeeHomepage: React.FC<EmployeeHomepageProps> = ({
  name = "Employee",
}) => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const formattedDate = time.toLocaleDateString();

  return (
    <div className="p-6 min-h-screen bg-gradient from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto">
        {/* Greeting Message */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Welcome back, {name}!
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Have a great day at work.
          </p>
        </div>

        {/* Time Display */}
        <div className="bg-white rounded-lg shadow-lg p-6 border-l-4 border-indigo-500">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Current Time
          </h2>
          <p className="text-5xl font-bold text-indigo-600">{formattedTime}</p>
          <p className="text-sm text-gray-500 mt-2">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
};
