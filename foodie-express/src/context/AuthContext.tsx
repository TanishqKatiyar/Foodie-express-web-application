import React, { createContext, useContext, useEffect, useState } from "react";
import { UserProfile } from "../types";
import toast from "react-hot-toast";

interface AuthContextType {
  user: { uid: string; email: string; displayName: string; createdAt?: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ uid: string; email: string; displayName: string; createdAt?: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      setProfile(parsedUser);
    }
    setLoading(false);
  }, []);

  const loginWithGoogle = async () => {
    // Mock Google Login
    const mockUser = {
      uid: "google-user-123",
      email: "aadinajain@gmail.com",
      displayName: "Aadina Jain",
      role: "admin",
      createdAt: new Date().toISOString()
    };
    setUser(mockUser);
    setProfile(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    toast.success("Logged in with Google (Mock)!");
  };

  const loginWithEmail = async (email: string, name: string) => {
    const mockUser = {
      uid: `email-user-${Date.now()}`,
      email,
      displayName: name,
      role: "user",
      createdAt: new Date().toISOString()
    };
    setUser(mockUser);
    setProfile(mockUser);
    localStorage.setItem("user", JSON.stringify(mockUser));
    toast.success("Logged in successfully!");
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updatedProfile = { ...profile, ...data } as UserProfile;
    setProfile(updatedProfile);
    setUser(prev => prev ? { ...prev, ...data } : null);
    localStorage.setItem("user", JSON.stringify(updatedProfile));
    toast.success("Profile updated!");
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, loginWithGoogle, loginWithEmail, logout, updateUserProfile }}>
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
