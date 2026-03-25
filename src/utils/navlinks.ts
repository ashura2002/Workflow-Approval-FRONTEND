import {
  Archive,
  Building2,
  Building2Icon,
  Home,
  MailCheck,
  Newspaper,
  NewspaperIcon,
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
    icon: NewspaperIcon,
  },
  {
    linkName: "Company",
    path: "/sds",
    icon: Building2Icon,
  },
];
