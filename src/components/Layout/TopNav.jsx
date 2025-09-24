import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  Bell,
  Search,
  Sun,
  Moon,
  Plus,
  Minus,
  LogOut,
  User,
} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useFontSize } from "../../contexts/FontSizeContext";
import { supabase } from "../../services/supabase";
import { useNavigate } from "react-router-dom";

const TopNav = ({ onSidebarToggle }) => {
  const { user, signout } = useAuth(); // ✅ make sure AuthContext exports signout
  const { theme, toggleTheme } = useTheme();
  const { increaseFontSize, decreaseFontSize, canIncrease, canDecrease } =
    useFontSize();

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const navigate = useNavigate();

  // Fetch psychologists when query changes
  useEffect(() => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }

    const fetchPsychologists = async () => {
      const { data, error } = await supabase
        .from("profile")
        .select("id, name, email, role")
        .eq("role", "psychologist")
        .ilike("name", `%${query}%`);

      if (error) {
        console.error("Error fetching psychologists:", error);
        return;
      }

      setResults(data || []);
    };

    fetchPsychologists();
  }, [query]);

  // Handle Profile navigation based on role
  const handleProfileClick = () => {
    const role =
      user?.profile?.role?.toLowerCase() ||
      user?.user_metadata?.role?.toLowerCase();

    if (role === "psychologist") {
      navigate("/psychologistprofile");
    } else if (role === "patient") {
      navigate("/patientprofile");
    } else if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/home");
    }
  };

  // ✅ Pull name from metadata fallback
  const displayName =
    user?.profile?.name || user?.user_metadata?.name || "Guest";
  const initial =
    displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0) || "?";

  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 relative"
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onSidebarToggle}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowResults(true);
              }}
              placeholder="Search psychologists..."
              className="pl-10 pr-4 py-2 w-64 bg-gray-100 dark:bg-gray-700 border-0 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:bg-white dark:focus:bg-gray-600 transition-colors"
            />

            {/* Results Dropdown */}
            {showResults && results.length > 0 && (
              <div className="absolute mt-2 w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
                <ul>
                  {results.map((psych) => (
                    <li
                      key={psych.id}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm text-gray-700 dark:text-gray-300"
                      onClick={() => {
                        setShowResults(false);
                        setQuery("");
                        navigate(`/psychologist/${psych.id}`); // ✅ public view page
                      }}
                    >
                      <span className="font-medium">{psych.name}</span>
                      <span className="block text-xs text-gray-500">
                        {psych.email}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Font Size Controls */}
          <div className="flex items-center space-x-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={decreaseFontSize}
              disabled={!canDecrease}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Decrease font size"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-xs text-gray-500 dark:text-gray-400 px-2">
              Aa
            </span>
            <button
              onClick={increaseFontSize}
              disabled={!canIncrease}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Increase font size"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* User Menu */}
          <div className="relative group">
            <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              {/* Avatar fallback */}
              <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold">
                {initial}
              </div>
              <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-300">
                {displayName}
              </span>
            </button>

            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="py-2">
                <button
                  onClick={handleProfileClick}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </button>
                <button
                  onClick={async () => {
                    await signout();
                    navigate("/login"); // ✅ redirect after logout
                  }}
                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default TopNav;
