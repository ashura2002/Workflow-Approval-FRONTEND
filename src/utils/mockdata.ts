export const hompageCardData = [
  {
    cardTitle: "Users",
    data: 200,
    message: "Currently on this Company",
  },
  {
    cardTitle: "Todays Requests",
    data: 150,
    message: "Today's Requests",
  },
  {
    cardTitle: "Active Users",
    data: 100,
    message: "Currently on this company",
  },
];

//Mock Data for requests
export const RequestMockData = [
  {
    id: 1,
    name: "John Doe",
    startDate: "2026-03-20",
    endDate: "2026-03-25",
    leaveType: "Emergency Leave",
  },
  {
    id: 2,
    name: "Jane Smith",
    startDate: "2026-03-22",
    endDate: "2026-03-23",
    leaveType: "Sick Leave",
  },
  {
    id: 3,
    name: "Mike Johnson",
    startDate: "2026-04-01",
    endDate: "2026-04-07",
    leaveType: "Personal Leave",
  },
  {
    id: 4,
    name: "Sarah Williams",
    startDate: "2026-03-25",
    endDate: "2026-03-26",
    leaveType: "Personal Leave",
  },
];

// Mock analytics data
export const recentActivity = [
  { id: 1, action: "New leave request", user: "John Doe", time: "2 min ago" },
  { id: 2, action: "Company added", user: "Jane Smith", time: "15 min ago" },
  {
    id: 3,
    action: "Request approved",
    user: "Mike Johnson",
    time: "1 hour ago",
  },
  {
    id: 4,
    action: "New user registered",
    user: "Sarah Lee",
    time: "3 hours ago",
  },
];

// Mock company data
export const companyData = {
  id: 1,
  CompanyName: "Acme Corporation",
  description:
    "A leading global company dedicated to innovation and excellence in technology solutions. We pride ourselves on delivering cutting-edge products and services that help businesses transform and grow.",
  totalUsers: 200,
};

export const requestDataShape = [
  {
    id: 17,
    leaveType: "PersonalLeave",
    startDate: "2024-10-28T00:00:00.000Z",
    endDate: "2024-10-29T00:00:00.000Z",
    reason: "leave 2",
    createdAt: "2026-03-15T04:22:22.921Z",
    updatedAt: "2026-03-15T04:22:22.921Z",
    status: "Pending" as const,
    userId: 6,
    viewTo: "DepartmentHead",
    companyId: 2,
  },
  {
    id: 18,
    leaveType: "AnnualLeave",
    startDate: "2026-03-20T00:00:00.000Z",
    endDate: "2026-03-25T00:00:00.000Z",
    reason: "Vacation",
    createdAt: "2026-03-10T10:15:00.000Z",
    updatedAt: "2026-03-12T14:30:00.000Z",
    status: "Approved" as const,
    userId: 6,
    viewTo: "DepartmentHead",
    companyId: 2,
  },
  {
    id: 19,
    leaveType: "SickLeave",
    startDate: "2026-03-19T00:00:00.000Z",
    endDate: "2026-03-19T00:00:00.000Z",
    reason: "Medical appointment",
    createdAt: "2026-03-18T08:45:00.000Z",
    updatedAt: "2026-03-18T08:45:00.000Z",
    status: "Rejected" as const,
    userId: 6,
    viewTo: "DepartmentHead",
    companyId: 2,
  },
];
