"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "../../../firebase";

// Definir la estructura del usuario autenticado
interface AuthUser {
  email?: string;
}

// Definir la estructura del contexto
interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
}

// Crear contexto con tipo definido
export const authContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};

// Definir las props para AuthProvider, incluyendo children correctamente
interface AuthProviderProps {
  children: ReactNode;
}

// Componente AuthProvider
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = (email: string, password: string) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser ? { email: currentUser.email ?? "" } : null);
    });

    return () => unsubscribe(); // Limpiar suscripción al desmontar
  }, []);

  return (
    <authContext.Provider value={{ login, user, logout }}>
      {children}
    </authContext.Provider>
  );
}
