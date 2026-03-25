import {
  Archive,
  Building2,
  Building2Icon,
  Home,
  MailCheck,
  Newspaper,
  NotepadTextDashed,
  Users,
} from "lucide-react";

export const adminNavLinks = [
  {
    linkName: "Home",
    path: "/admin-homepage",
    icon: Home,
  },
  {
    linkName: "Requests",
    path: "/admin-requests",
    icon: Building2,
  },
  {
    linkName: "Users",
    path: "/admin-user-management",
    icon: Users,
  },
  {
    linkName: "Company",
    path: "/admin-company",
    icon: MailCheck,
  },
  {
    linkName: "Archives",
    path: "/admin-archives-requests",
    icon: Archive,
  },
];

export const employeeLinks = [
  {
    linkName: "Home",
    path: "/employee-homepage",
    icon: Home,
  },
  {
    linkName: "Requests",
    path: "/employee-requests",
    icon: Newspaper,
  },

  {
    linkName: "Requests History",
    path: "/employee-requests-history",
    icon: NotepadTextDashed,
  },
  {
    linkName: "Company",
    path: "/employee-company",
    icon: Building2Icon,
  },
];
