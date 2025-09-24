// src/pages/Psychologist/PsychologistProfile.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const PsychologistProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("psychologist_profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 dark:text-gray-300">
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card max-w-2xl mx-auto p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">No profile found</h2>
        <p className="mb-4 text-gray-600 dark:text-gray-400">
          You haven’t created your profile yet.
        </p>
        <button
          onClick={() => navigate("/psychologist-profile")}
          className="btn-primary px-4 py-2 rounded-md"
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="card max-w-3xl mx-auto p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {user?.user_metadata?.name || "Psychologist"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          {user?.email}
        </p>
      </div>

      {/* Bio */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Bio
        </h3>
        <p className="mt-1 text-gray-700 dark:text-gray-300 leading-relaxed">
          {profile.bio || "No bio provided."}
        </p>
      </div>

      {/* Experience + Charges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Years of Experience
          </h4>
          <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
            {profile.years_experience || "—"}
          </p>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Charges per Hour
          </h4>
          <p className="mt-2 text-xl font-semibold text-gray-900 dark:text-white">
            {profile.charges_per_hour ? `$${profile.charges_per_hour}` : "—"}
          </p>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Expertise
        </h3>
        {profile.skills && profile.skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-primary-600 text-white rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No expertise added.</p>
        )}
      </div>

      {/* Edit Button */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={() => navigate("/psychologist-profile")}
          className="btn-primary px-6 py-2 rounded-md"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default PsychologistProfile;
