// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Keep user in sync with session
  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user || null);
      setLoading(false);
    };

    getSession();

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription?.subscription?.unsubscribe();
  }, []);

  // Helper: ensure profile exists in Profiles table
  const ensureProfile = async (user, name, role) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from("profile")
        .upsert(
          {
            id: user.id,
            name: name || user.user_metadata?.name || "",
            email: user.email,
            role: role || user.user_metadata?.role || "",
          },
          { onConflict: "id" }
        );
      if (error) console.error("Profile upsert failed:", error.message);
    } catch (err) {
      console.error("Profile upsert exception:", err);
    }
  };

  // Sign Up
  const signup = async ({ name, email, role, password }) => {
    try {
      if (password.length < 8 || password.length > 32)
        return { success: false, error: "Password must be between 8 and 32 characters long." };

      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name, role } }, // store metadata
      });

      if (authError) {
        console.error("Auth error:", authError.message);
        if (authError.message.toLowerCase().includes("duplicate"))
          return { success: false, error: "This email is already registered." };
        if (authError.message.toLowerCase().includes("password"))
          return { success: false, error: "Password is too weak." };
        return { success: false, error: "Unable to create account. Please try again." };
      }

      // Email confirmation may require session to be null
      if (!data.session)
        return {
          success: true,
          pendingEmailConfirmation: true,
          message: "Check your inbox to confirm your email before logging in.",
        };

      // Upsert profile immediately
      await ensureProfile(data.user, name, role);

      setUser(data.user);
      return { success: true };
    } catch (err) {
      console.error("Signup error:", err);
      return { success: false, error: "Something went wrong. Please try again." };
    }
  };

  // Log In
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error("SignIn error:", error.message);
        if (error.message.toLowerCase().includes("invalid"))
          return { success: false, error: "Invalid email or password." };
        return { success: false, error: "Unable to sign in. Please try again." };
      }

      if (data.user) {
        setUser(data.user);
        // Upsert profile in case trigger failed or metadata missing
        await ensureProfile(data.user);
        const role = data.user.user_metadata?.role || "";
        return { success: true, role };
      }

      return { success: false, error: "Unable to sign in." };
    } catch (err) {
      console.error("SignIn exception:", err);
      return { success: false, error: "Something went wrong. Please try again." };
    }
  };

  // Sign Out
  const signout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, signout }}>
      {children}
    </AuthContext.Provider>
  );
};