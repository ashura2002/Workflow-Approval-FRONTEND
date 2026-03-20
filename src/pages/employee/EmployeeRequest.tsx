import React, { useState } from "react";

interface RequestFormData {
  startDate: string;
  endDate: string;
  reason: string;
  leaveType: string;
}

export const EmployeeRequest: React.FC = () => {
  const [formData, setFormData] = useState<RequestFormData>({
    startDate: "",
    endDate: "",
    reason: "",
    leaveType: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Data:", formData);
    // Add your submission logic here
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
            <p className="text-blue-600 text-xs font-semibold uppercase tracking-widest">
              Leave Request
            </p>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Request Your Leave
          </h1>
          <p className="text-gray-600 text-lg max-w-md mx-auto">
            Fill out the form below to submit your leave request for approval
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-gray-200 rounded-3xl p-12 shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Start Date */}
              <div className="space-y-3">
                <label
                  htmlFor="startDate"
                  className="block text-sm font-semibold text-gray-900"
                >
                  <span className="text-blue-600">📅</span> Start Date
                </label>
                <input
                  type="datetime-local"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* End Date */}
              <div className="space-y-3">
                <label
                  htmlFor="endDate"
                  className="block text-sm font-semibold text-gray-900"
                >
                  <span className="text-purple-600">📅</span> End Date
                </label>
                <input
                  type="datetime-local"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Leave Type */}
            <div className="space-y-3">
              <label
                htmlFor="leaveType"
                className="block text-sm font-semibold text-gray-900"
              >
                <span className="text-indigo-600">🏷️</span> Leave Type
              </label>
              <select
                id="leaveType"
                name="leaveType"
                value={formData.leaveType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition duration-200 text-gray-900"
              >
                <option value="">Select a leave type</option>
                <option value="annual">Annual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="personal">Personal Leave</option>
              </select>
            </div>

            {/* Reason */}
            <div className="space-y-3">
              <label
                htmlFor="reason"
                className="block text-sm font-semibold text-gray-900"
              >
                <span className="text-pink-600">💬</span> Reason
              </label>
              <textarea
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                rows={5}
                required
                placeholder="Please provide detailed reason for your leave..."
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none transition duration-200 text-gray-900 placeholder-gray-500 resize-none"
              />
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-200"></div>

            {/* Button Group */}
            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="flex-1 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                ✓ Submit Request
              </button>
              <button
                type="reset"
                className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold rounded-xl transition duration-200"
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <p className="text-gray-700 text-sm">
            <span className="text-blue-600">ℹ️</span> Your request will be
            reviewed and processed within 2-3 business days
          </p>
        </div>
      </div>
    </div>
  );
};
