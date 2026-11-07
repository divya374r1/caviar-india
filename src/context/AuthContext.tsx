
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

const API_URL =
  process.env.NEXT_PUBLIC_DJANGO_API_URL ||
  "http://127.0.0.1:8000";

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const savedUser = sessionStorage.getItem("caviar_user");
      const savedAccess = sessionStorage.getItem("caviar_access");

      if (savedUser && savedAccess) {
        setUser(JSON.parse(savedUser));
        setAccessToken(savedAccess);
      }
    } catch {
      sessionStorage.removeItem("caviar_user");
      sessionStorage.removeItem("caviar_access");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || "Login failed.");
    }

    const userResponse = await fetch(`${API_URL}/api/auth/me/`, {
      headers: {
        Authorization: `Bearer ${data.access}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error("Unable to retrieve customer details.");
    }

    const customer = await userResponse.json();

    sessionStorage.setItem("caviar_access", data.access);
    sessionStorage.setItem("caviar_refresh", data.refresh);
    sessionStorage.setItem("caviar_user", JSON.stringify(customer));

    setAccessToken(data.access);
    setUser(customer);
  };

  const register = async (registrationData: {
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
  }) => {
    const response = await fetch(`${API_URL}/api/auth/register/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registrationData),
    });

    const data = await response.json();

    if (!response.ok) {
      const message = Object.values(data).flat().join(" ");
      throw new Error(message || "Registration failed.");
    }
  };

  const logout = () => {
    sessionStorage.removeItem("caviar_access");
    sessionStorage.removeItem("caviar_refresh");
    sessionStorage.removeItem("caviar_user");

    setUser(null);
    setAccessToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isLoading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
