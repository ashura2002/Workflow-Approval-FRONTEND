import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";
import type { JwtTypes } from "../types/jwt.types";

export type AuthUser = {
  token: string | null;
  userId: number | null;
  email: string | null;
  role: string | null;
  companyId: number | null;
  username: string | null;
};

export type AuthContextType = {
  user: AuthUser;
  isAuthenticated: boolean;
  tokenValid: boolean;
  login: (token: string) => void;
  logout: () => void;
  hasRole: (roles: string | string[]) => boolean;
};

const defaultUser: AuthUser = {
  token: null,
  userId: null,
  email: null,
  role: null,
  companyId: null,
  username: null,
};

const AuthContext = createContext<AuthContextType>({
  user: defaultUser,
  isAuthenticated: false,
  tokenValid: false,
  login: () => undefined,
  logout: () => undefined,
  hasRole: () => false,
});

type DecodedJwt = JwtTypes & {
  exp?: number;
  iat?: number;
};

const parseToken = (token: string): AuthUser => {
  try {
    const decoded = jwtDecode<DecodedJwt>(token);
    const expiresAt = decoded.exp ? decoded.exp * 1000 : null;
    const valid = expiresAt === null || expiresAt > Date.now();

    if (!valid) {
      return defaultUser;
    }

    return {
      token,
      userId: decoded.userId ?? null,
      email: decoded.email ?? null,
      role: decoded.role ?? null,
      companyId: decoded.companyId ?? null,
      username: decoded.username ?? null,
    };
  } catch {
    return defaultUser;
  }
};

const storageKeys = {
  token: "token",
  userId: "userId",
  email: "email",
  role: "role",
  companyId: "companyId",
  username: "username",
};

const syncLocalStorage = (user: AuthUser) => {
  if (!user.token) {
    Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
    return;
  }

  localStorage.setItem(storageKeys.token, user.token);
  localStorage.setItem(
    storageKeys.userId,
    user.userId !== null ? String(user.userId) : "",
  );
  localStorage.setItem(storageKeys.email, user.email ?? "");
  localStorage.setItem(storageKeys.role, user.role ?? "");
  localStorage.setItem(
    storageKeys.companyId,
    user.companyId !== null ? String(user.companyId) : "",
  );
  localStorage.setItem(storageKeys.username, user.username ?? "");
};

const getInitialUser = (): AuthUser => {
  const token = localStorage.getItem(storageKeys.token);
  if (!token) return defaultUser;
  return parseToken(token);
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser>(getInitialUser());

  useEffect(() => {
    if (!user.token) {
      const token = localStorage.getItem(storageKeys.token);
      if (!token) return;

      const parsed = parseToken(token);
      if (parsed.token) {
        setUser(parsed);
      } else {
        setUser(defaultUser);
        syncLocalStorage(defaultUser);
      }
    }
  }, [user.token]);

  const login = (token: string) => {
    const parsed = parseToken(token);
    if (!parsed.token) return;
    setUser(parsed);
    syncLocalStorage(parsed);
  };

  const logout = () => {
    setUser(defaultUser);
    syncLocalStorage(defaultUser);
  };

  const hasRole = (roles: string | string[]) => {
    if (!user.role) return false;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.includes(user.role);
  };

  const isAuthenticated = Boolean(user.token);
  const tokenValid = isAuthenticated;

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      tokenValid,
      login,
      logout,
      hasRole,
    }),
    [user, isAuthenticated, tokenValid],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
