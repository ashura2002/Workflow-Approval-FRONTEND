import type { Role } from "./role.enums";

export type UserInterface = {
  id: number;
  email: string;
  role: Role;
  companyId: string;
  username: string;
  isActive?: boolean;
};
