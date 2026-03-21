import { Archive, Building2, Home, MailCheck, Users } from "lucide-react";

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
  },
  {
    linkName: "Requests",
  },
  {
    linkName: "Company",
  },
];
