import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { axiosInstance } from "../../utils/axiosInstance";

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

  const [isLoading, setIsloading] = useState<boolean>(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsloading(true);
    try {
      const res = await axiosInstance.post("/requests", formData);
      console.log(res);
      toast.success("Leave request submitted successfully!");
      setFormData({
        startDate: "",
        endDate: "",
        reason: "",
        leaveType: "",
      });
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data;
        let message = "Failed to submit form";

        // Handle array of messages
        if (Array.isArray(errorData?.message)) {
          message = errorData.message.join(", ");
        }
        // Handle string message
        else if (typeof errorData?.message === "string") {
          message = errorData.message;
        }

        toast.error(message);
      }
    } finally {
      setIsloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-indigo-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">
          {/* Left side - Info & Benefits */}
          <div className="hidden lg:block sticky top-12 space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-100/50">
              <div className="inline-block mb-4 px-4 py-2 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full">
                <p className="text-white text-xs font-semibold uppercase tracking-widest">
                  Leave Request
                </p>
              </div>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Request Your Leave
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Fill out the form to submit your leave request for approval.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-0">
                    <span className="text-indigo-600 text-xl">✓</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Quick Approval
                    </h3>
                    <p className="text-sm text-gray-500">
                      Requests reviewed within 2-3 business days
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-0">
                    <span className="text-purple-600 text-xl">📊</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Track Status
                    </h3>
                    <p className="text-sm text-gray-500">
                      Real-time updates on your dashboard
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center flex-0">
                    <span className="text-pink-600 text-xl">🔒</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Secure & Private
                    </h3>
                    <p className="text-sm text-gray-500">
                      Your data is encrypted and confidential
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-linear-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">💡</span>
                <h3 className="font-semibold text-xl">Pro Tips</h3>
              </div>
              <ul className="space-y-2 text-sm">
                <li>• Submit requests at least 5 days in advance</li>
                <li>• Provide a clear reason for faster processing</li>
                <li>• Check your leave balance before applying</li>
              </ul>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-gray-100/50 p-6 md:p-8 lg:p-10">
            <div className="text-center lg:text-left mb-8">
              <h2 className="text-2xl font-bold text-gray-800">
                Leave Request Form
              </h2>
              <p className="text-gray-500 mt-2">
                Please fill in all required details
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Two Column Layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    📅 Start Date
                  </label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-900"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    📅 End Date
                  </label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-900"
                  />
                </div>
              </div>

              {/* Leave Type */}
              <div>
                <label
                  htmlFor="leaveType"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  🏷️ Leave Type
                </label>
                <select
                  id="leaveType"
                  name="leaveType"
                  value={formData.leaveType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-900"
                >
                  <option value="">Select a leave type</option>
                  <option value="EmergencyLeave">Emergency Leave</option>
                  <option value="SickLeave">Sick Leave</option>
                  <option value="PersonalLeave">Personal Leave</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label
                  htmlFor="reason"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  💬 Reason
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={5}
                  required
                  placeholder="Please provide a detailed reason for your leave..."
                  className="w-full px-4 py-3 bg-gray-50/80 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200 text-gray-900 placeholder-gray-500 resize-none"
                />
              </div>

              <div className="h-px bg-gray-200/50"></div>

              {/* Button Group */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  disabled={isLoading}
                  type="submit"
                  className="flex-1 bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  {isLoading ? "Loading..." : "✓ Submit Request"}
                </button>
                <button
                  type="reset"
                  className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition duration-200"
                >
                  Reset
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

// integrate get all my request history endpoints
