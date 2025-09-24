// src/pages/Patient/PatientProfileForm.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { DISORDERS } from "../../lib/disorders";

const PatientProfileForm = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    bio: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    medical_history: "",
    current_medications: "",
    therapy_goals: "",
    disorders: [], // array of selected disorders
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing profile if available
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("patient_profiles") // ✅ fixed table name
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading profile:", error);
      } else if (data) {
        setForm({
          bio: data.bio || "",
          age: data.age || "",
          gender: data.gender || "",
          weight: data.weight || "",
          height: data.height || "",
          medical_history: data.medical_history || "",
          current_medications: data.current_medications || "",
          therapy_goals: data.therapy_goals || "",
          disorders: data.disorders || [],
        });
      }
    };
    fetchProfile();
  }, [user]);

  // ✅ Save / update profile
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    const { error } = await supabase.from("patient_profiles").upsert({
      user_id: user.id,
      bio: form.bio,
      age: form.age ? parseInt(form.age, 10) : null,
      gender: form.gender,
      weight: form.weight ? parseFloat(form.weight) : null,
      height: form.height ? parseFloat(form.height) : null,
      medical_history: form.medical_history,
      current_medications: form.current_medications,
      therapy_goals: form.therapy_goals,
      disorders: form.disorders,
    });

    setLoading(false);

    if (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile.");
    } else {
      alert("Profile updated successfully!");
    }
  };

  const handleDisorderChange = (disorder) => {
    setForm((prev) => ({
      ...prev,
      disorders: prev.disorders.includes(disorder)
        ? prev.disorders.filter((d) => d !== disorder)
        : [...prev.disorders, disorder],
    }));
  };

  return (
    <div className="card p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Patient Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bio */}
        <div>
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            className="input-field w-full"
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
          />
        </div>

        {/* Age, Gender, Weight, Height */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              className="input-field w-full"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Gender</label>
            <select
              className="input-field w-full"
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Weight (kg)</label>
            <input
              type="number"
              className="input-field w-full"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Height (cm)</label>
            <input
              type="number"
              className="input-field w-full"
              value={form.height}
              onChange={(e) => setForm({ ...form, height: e.target.value })}
            />
          </div>
        </div>

        {/* Disorders */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Select Disorders (if any)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DISORDERS.map((disorder) => (
              <label key={disorder} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.disorders.includes(disorder)}
                  onChange={() => handleDisorderChange(disorder)}
                  className="form-checkbox text-primary-600"
                />
                <span className="text-sm">{disorder}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Medical History */}
        <div>
          <label className="block text-sm font-medium mb-1">Medical History</label>
          <textarea
            className="input-field w-full"
            value={form.medical_history}
            onChange={(e) =>
              setForm({ ...form, medical_history: e.target.value })
            }
          />
        </div>

        {/* Current Medications */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Current Medications
          </label>
          <textarea
            className="input-field w-full"
            value={form.current_medications}
            onChange={(e) =>
              setForm({ ...form, current_medications: e.target.value })
            }
          />
        </div>

        {/* Therapy Goals */}
        <div>
          <label className="block text-sm font-medium mb-1">Therapy Goals</label>
          <textarea
            className="input-field w-full"
            value={form.therapy_goals}
            onChange={(e) =>
              setForm({ ...form, therapy_goals: e.target.value })
            }
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full py-2"
        >
          {loading ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default PatientProfileForm;
