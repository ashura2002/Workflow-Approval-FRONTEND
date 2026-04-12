import { createContext } from "react";
import type { Role } from "../types/role.enums";

export interface User {
  id: number;
  email: string;
  companyId: number;
  isActive: boolean;
  role: Role;
  username: string;
}

export interface UserContextType {
  users: User[];
  setUsers: (user: User[] | ((prev: User[]) => User[])) => void;
}

export const userContext = createContext<UserContextType | null>(null);
