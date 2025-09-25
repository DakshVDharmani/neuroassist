import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import { DISORDERS } from "../../lib/disorders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PsychologistProfileForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    bio: "",
    years_experience: "",
    charges_per_hour: "",
    skills: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("psychologist_profiles")
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
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const toastId = toast.loading("Saving profile...");

    const { error } = await supabase.from("psychologist_profiles").upsert({
      user_id: user.id,
      bio: form.bio,
      years_experience: form.years_experience ? parseInt(form.years_experience, 10) : null,
      charges_per_hour: form.charges_per_hour ? parseFloat(form.charges_per_hour) : null,
      skills: form.skills,
    });

    setLoading(false);
    if (error) {
      toast.error("Failed to save profile.", { id: toastId });
      console.error("Error saving profile:", error);
    } else {
      toast.success("Profile saved successfully!", { id: toastId });
      navigate('/psychologist-profile');
    }
  };

  const handleSkillChange = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Psychologist Profile</CardTitle>
          <CardDescription>Update your professional information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell patients about yourself..." />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years_experience">Years of Experience</Label>
                <Input id="years_experience" type="number" value={form.years_experience} onChange={(e) => setForm({ ...form, years_experience: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="charges_per_hour">Charges per hour ($)</Label>
                <Input id="charges_per_hour" type="number" step="0.01" value={form.charges_per_hour} onChange={(e) => setForm({ ...form, charges_per_hour: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Expertise</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-md">
                {DISORDERS.map((disorder) => (
                  <div key={disorder} className="flex items-center space-x-2">
                    <Checkbox id={`skill-${disorder}`} checked={form.skills.includes(disorder)} onCheckedChange={() => handleSkillChange(disorder)} />
                    <Label htmlFor={`skill-${disorder}`} className="font-normal">{disorder}</Label>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PsychologistProfileForm;
