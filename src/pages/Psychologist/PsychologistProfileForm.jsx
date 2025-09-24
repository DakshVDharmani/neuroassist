// src/pages/Psychologist/PsychologistProfileForm.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabase";
import { useAuth } from "../../contexts/AuthContext";
import { DISORDERS } from "../../lib/disorders";

const PsychologistProfileForm = () => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    bio: "",
    years_experience: "",
    charges_per_hour: "",
    skills: [],
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch existing profile if available
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from("doctor_profiles") // ✅ fixed table name
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Error loading profile:", error);
      } else if (data) {
        setForm({
          bio: data.bio || "",
          years_experience: data.years_experience || "",
          charges_per_hour: data.charges_per_hour || "",
          skills: data.skills || [],
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

    const { error } = await supabase.from("doctor_profiles").upsert({
      user_id: user.id,
      bio: form.bio,
      years_experience: form.years_experience
        ? parseInt(form.years_experience, 10)
        : null,
      charges_per_hour: form.charges_per_hour
        ? parseFloat(form.charges_per_hour)
        : null,
      skills: form.skills,
    });

    setLoading(false);

    if (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile.");
    } else {
      alert("Profile updated successfully!");
    }
  };

  const handleSkillChange = (skill) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  return (
    <div className="card p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Psychologist Profile</h2>
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

        {/* Years of Experience */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Years of Experience
          </label>
          <input
            type="number"
            className="input-field w-full"
            value={form.years_experience}
            onChange={(e) =>
              setForm({ ...form, years_experience: e.target.value })
            }
          />
        </div>

        {/* Charges per hour */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Charges (per hour in $)
          </label>
          <input
            type="number"
            step="0.01"
            className="input-field w-full"
            value={form.charges_per_hour}
            onChange={(e) =>
              setForm({ ...form, charges_per_hour: e.target.value })
            }
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Expertise (Select disorders you specialize in)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {DISORDERS.map((disorder) => (
              <label key={disorder} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={form.skills.includes(disorder)}
                  onChange={() => handleSkillChange(disorder)}
                  className="form-checkbox text-primary-600"
                />
                <span className="text-sm">{disorder}</span>
              </label>
            ))}
          </div>
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

export default PsychologistProfileForm;
