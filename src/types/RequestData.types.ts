export type RequestData = {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
  status: "Pending" | "Approved" | "Rejected";
  userId: number;
  viewTo: string;
  companyId: number;
};
