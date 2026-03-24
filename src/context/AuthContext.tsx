import React, { createContext, useContext, useState } from "react";

interface AuthUser {
  userId: string;
  email: string;
  role: string;
  companyId: string;
  username: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getUserFromStorage = (): AuthUser | null => {
  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");
  const role = localStorage.getItem("role");
  const companyId = localStorage.getItem("companyId");
  const username = localStorage.getItem("username");

  if (!userId || !role) return null;

  return {
    userId,
    email: email ?? "",
    role,
    companyId: companyId ?? "",
    username: username ?? "",
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthUser | null>(getUserFromStorage);

  const isAuthenticated = !!user;

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("companyId");
    localStorage.removeItem("username");
    setUser(null);
  };

  // Sync logout across browser tabs
  React.useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "role" && !e.newValue) {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// understand how to make auth context and implement on this project