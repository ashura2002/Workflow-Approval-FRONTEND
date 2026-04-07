import type { Role } from "./role.enums";

export type UserInterface = {
  userId: string;
  email: string;
  role: Role;
  companyId: string;
  username: string;
  isActive?: Boolean;
};
