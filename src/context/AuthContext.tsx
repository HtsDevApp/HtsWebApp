import { createContext, useContext, useState} from "react";
import type { ReactNode } from "react";
import { supabase } from "../supabaseClient";

// 1. Update the Interface to include the company name
interface User {
  id: number;
  username: string;
  role: string;
  empresa_id: number | null;
  empresa_nombre?: string; // <--- ADD THIS
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<{ error: string | null }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (username: string, password: string) => {
    // 2. Update query to JOIN with empresa table
    const { data, error } = await supabase
      .from("app_users")
      .select("*, empresa(nombre)") // <--- Get the name too
      .eq("username", username)
      .eq("password", password)
      .single();

    if (error || !data) {
      return { error: "Credenciales inválidas" };
    }

    // Cast data safely
    const userData = data as any; 
    
    // 3. Set the state including the company name
    setUser({
      id: userData.id,
      username: userData.username,
      role: userData.role || "USER",
      empresa_id: userData.empresa_id,
      empresa_nombre: userData.empresa?.nombre || "", // Extract the name
    });

    return { error: null };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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