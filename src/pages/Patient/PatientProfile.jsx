// src/pages/Patient/PatientProfile.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("patient_profiles_new")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching patient profile:", error);
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
          onClick={() => navigate("/patient-profile")}
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
          {user?.user_metadata?.name || "Patient"}
        </h1>
        <p className="text-gray-500 dark:text-gray-400">{user?.email}</p>
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

      {/* Age, Gender, Weight, Height */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Age
          </h4>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            {profile.age || "—"}
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Gender
          </h4>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            {profile.gender || "—"}
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Weight
          </h4>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            {profile.weight ? `${profile.weight} kg` : "—"}
          </p>
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Height
          </h4>
          <p className="mt-2 text-lg font-semibold text-gray-900 dark:text-white">
            {profile.height ? `${profile.height} cm` : "—"}
          </p>
        </div>
      </div>

      {/* Disorders */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
          Disorders
        </h3>
        {profile.disorders && profile.disorders.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.disorders.map((disorder, i) => (
              <span
                key={i}
                className="px-3 py-1 text-sm bg-primary-600 text-white rounded-full"
              >
                {disorder}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">None selected.</p>
        )}
      </div>

      {/* Medical History */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Medical History
        </h3>
        <p className="mt-1 text-gray-700 dark:text-gray-300">
          {profile.medical_history || "No medical history provided."}
        </p>
      </div>

      {/* Current Medications */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Current Medications
        </h3>
        <p className="mt-1 text-gray-700 dark:text-gray-300">
          {profile.current_medications || "No current medications listed."}
        </p>
      </div>

      {/* Therapy Goals */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Therapy Goals
        </h3>
        <p className="mt-1 text-gray-700 dark:text-gray-300">
          {profile.therapy_goals || "No therapy goals provided."}
        </p>
      </div>

      {/* Edit Button */}
      <div className="pt-4 flex justify-end">
        <button
          onClick={() => navigate("/patient-profile")}
          className="btn-primary px-6 py-2 rounded-md"
        >
          Edit Profile
        </button>
      </div>
    </div>
  );
};

export default PatientProfile;
