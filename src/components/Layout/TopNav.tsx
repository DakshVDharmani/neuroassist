import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, Bell, Search, Sun, Moon, LogOut, User, Shield } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { supabase } from "../../services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CrisisButton from "../Shared/CrisisButton";

const TopNav = ({ onSidebarToggle }: { onSidebarToggle: () => void }) => {
  const { user, signout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const fetchPsychologists = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, display_name, contact_email")
        .eq("role", "psychologist")
        .ilike("display_name", `%${query}%`);

      if (error) console.error("Error fetching psychologists:", error);
      else setResults(data || []);
    };

    const searchTimeout = setTimeout(() => {
      fetchPsychologists();
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleProfileClick = () => {
    const role = user?.profile?.role;
    if (role === 'psychologist') navigate("/psychologist-profile");
    else if (role === 'patient') navigate("/profile");
    else navigate("/dashboard");
  };

  const displayName = user?.profile?.display_name || user?.email || "Guest";
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;

  return (
    <header className="bg-card border-b px-4 md:px-6 h-16 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={onSidebarToggle} className="lg:hidden">
          <Menu className="w-5 h-5" />
        </Button>
        
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clinicians..."
            className="pl-9 w-64"
          />
          {results.length > 0 && (
            <div className="absolute mt-2 w-64 bg-popover border rounded-lg shadow-lg z-50">
              <ul>
                {results.map((psych) => (
                  <li
                    key={psych.user_id}
                    className="px-4 py-2 hover:bg-muted cursor-pointer text-sm"
                    onClick={() => {
                      setQuery("");
                      navigate(`/clinician/${psych.user_id}`);
                    }}
                  >
                    <span className="font-medium">{psych.display_name}</span>
                    <span className="block text-xs text-muted-foreground">{psych.contact_email}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <CrisisButton />
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        </Button>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">3</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="p-4">
              <h4 className="font-medium">Notifications</h4>
              <div className="mt-4 space-y-2">
                <p className="text-sm">New message from Dr. Smith.</p>
                <p className="text-sm">Your appointment is tomorrow.</p>
                <p className="text-sm">New resource added: "Coping with Anxiety".</p>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2">
              <img src={avatarUrl} alt={displayName} className="w-8 h-8 rounded-full" />
              <span className="hidden md:block text-sm font-medium">{displayName}</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2">
            <Button variant="ghost" className="w-full justify-start" onClick={handleProfileClick}>
              <User className="w-4 h-4 mr-2" /> Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600" onClick={async () => { await signout(); navigate("/login"); }}>
              <LogOut className="w-4 h-4 mr-2" /> Sign out
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default TopNav;
