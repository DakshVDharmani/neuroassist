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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const PatientProfileForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    bio: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
    medical_history: "",
    current_medications: "",
    therapy_goals: "",
    disorders: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      setLoading(true);
      const { data, error } = await supabase
        .from("patient_profiles")
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
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    const toastId = toast.loading("Saving profile...");

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
      toast.error("Failed to save profile.", { id: toastId });
      console.error("Error saving profile:", error);
    } else {
      toast.success("Profile saved successfully!", { id: toastId });
      navigate('/profile');
    }
  };

  const handleDisorderChange = (disorder: string) => {
    setForm((prev) => ({
      ...prev,
      disorders: prev.disorders.includes(disorder)
        ? prev.disorders.filter((d) => d !== disorder)
        : [...prev.disorders, disorder],
    }));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Edit Your Profile</CardTitle>
          <CardDescription>Keep your information up to date for better care.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="A little about yourself..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={form.gender} onValueChange={(value) => setForm({ ...form, gender: value })}>
                  <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Diagnosed Disorders (if any)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-md">
                {DISORDERS.map((disorder) => (
                  <div key={disorder} className="flex items-center space-x-2">
                    <Checkbox id={`disorder-${disorder}`} checked={form.disorders.includes(disorder)} onCheckedChange={() => handleDisorderChange(disorder)} />
                    <Label htmlFor={`disorder-${disorder}`} className="font-normal">{disorder}</Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="medical_history">Medical History</Label>
              <Textarea id="medical_history" value={form.medical_history} onChange={(e) => setForm({ ...form, medical_history: e.target.value })} placeholder="Any relevant medical history..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_medications">Current Medications</Label>
              <Textarea id="current_medications" value={form.current_medications} onChange={(e) => setForm({ ...form, current_medications: e.target.value })} placeholder="List any medications you are taking..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="therapy_goals">Therapy Goals</Label>
              <Textarea id="therapy_goals" value={form.therapy_goals} onChange={(e) => setForm({ ...form, therapy_goals: e.target.value })} placeholder="What do you hope to achieve?" />
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

export default PatientProfileForm;
