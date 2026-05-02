import { createContext, useContext, useState, ReactNode } from "react";

type Role = "renter" | "owner" | null;

interface User {
  id: number;
  name: string;
  role: Role;
  avatarUrl?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  login: (id: number, name: string, role: Role) => void;
  logout: () => void;
  simulateSwitch: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (id: number, name: string, role: Role) => {
    setUser({ id, name, role });
  };

  const logout = () => {
    setUser(null);
  };

  const simulateSwitch = () => {
    if (!user) {
      setUser({ id: 3, name: "Marcus Chen", role: "renter", createdAt: "2024-01-15T00:00:00.000Z" });
    } else if (user.role === "renter") {
      setUser({ id: 1, name: "Alex Johnson", role: "owner", createdAt: "2023-06-01T00:00:00.000Z" });
    } else {
      setUser({ id: 3, name: "Marcus Chen", role: "renter", createdAt: "2024-01-15T00:00:00.000Z" });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, simulateSwitch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
