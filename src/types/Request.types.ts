export type Request = {
  id: number;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  user: {
    username: string;
    email: string;
  };
};
