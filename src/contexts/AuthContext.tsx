import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../services/supabaseClient";
import type { User } from "@supabase/supabase-js";

// -------------------- Types --------------------

interface Profile {
  id: string;
  role: "patient" | "psychologist" | "admin";
  name: string;
  email: string;
  [key: string]: any;
}

interface AppUser extends User {
  profile?: Profile;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  signup: (
    credentials: SignupCredentials
  ) => Promise<{
    success: boolean;
    error?: string;
    pendingEmailConfirmation?: boolean;
    message?: string;
  }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; role?: string }>;
  signout: () => Promise<void>;
}

interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
  role?: "patient" | "psychologist" | "admin";
}

// -------------------- Context --------------------

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

// -------------------- Provider --------------------

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch profile and attach to user
  const fetchProfileAndSetUser = async (user: User | null) => {
    if (!user) {
      setUser(null);
      setLoading(false);
      return;
    }

    const { data: profile, error } = await supabase
      .from("profile")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
    }

    setUser({
      ...user,
      profile: profile || {
        role: user.user_metadata?.role,
        name: user.user_metadata?.name,
        email: user.email,
      },
    });

    setLoading(false);
  };

  // Listen to session changes
  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      await fetchProfileAndSetUser(session?.user ?? null);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        await fetchProfileAndSetUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // -------------------- Signup --------------------

  const signup = async ({ email, password, name, role }: SignupCredentials) => {
    if (!email || !password) {
      return { success: false, error: "Email and password are required." };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, role },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.session) {
      return {
        success: true,
        pendingEmailConfirmation: true,
        message: "Check your inbox to confirm your email.",
      };
    }

    if (!data.user) {
      return { success: false, error: "User not returned from signup." };
    }

    const userId = data.user.id;

    // ✅ Insert into `profile`
    const { error: profileError } = await supabase.from("profile").insert({
      id: userId,
      name: name || "",
      email,
      role: role || "patient",
    });

    if (profileError) {
      console.error("Error creating profile:", profileError);
    }

    // ✅ Insert into sub-profiles
    if (role === "patient") {
      await supabase.from("patient_profiles").insert({ user_id: userId });
    } else if (role === "psychologist") {
      await supabase.from("doctor_profiles").insert({ user_id: userId });
    }

    await fetchProfileAndSetUser(data.user);
    return { success: true };
  };

  // -------------------- Login --------------------

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      await fetchProfileAndSetUser(data.user);
      const role =
        (data.user as AppUser)?.profile?.role ||
        data.user.user_metadata?.role ||
        "patient";
      return { success: true, role };
    }

    return { success: false, error: "Login failed unexpectedly." };
  };

  // -------------------- Signout --------------------

  const signout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  // -------------------- Provide Context --------------------

  const value: AuthContextType = {
    user,
    loading,
    signup,
    login,
    signout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
