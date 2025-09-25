import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loading from "../Loading/Loading";

const PatientProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("patient_profiles")
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
    return <Loading />;
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
        <p className="mb-4 text-muted-foreground">
          You haven’t created your detailed profile yet.
        </p>
        <Button onClick={() => navigate("/profile/edit")}>
          Create Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{user?.profile?.display_name || "Patient"}</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold">Bio</h3>
            <p className="mt-1 text-muted-foreground">{profile.bio || "No bio provided."}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium text-muted-foreground">Age</h4>
              <p className="mt-1 text-lg font-semibold">{profile.age || "—"}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium text-muted-foreground">Gender</h4>
              <p className="mt-1 text-lg font-semibold capitalize">{profile.gender || "—"}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium text-muted-foreground">Weight</h4>
              <p className="mt-1 text-lg font-semibold">{profile.weight ? `${profile.weight} kg` : "—"}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium text-muted-foreground">Height</h4>
              <p className="mt-1 text-lg font-semibold">{profile.height ? `${profile.height} cm` : "—"}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Disorders</h3>
            {profile.disorders && profile.disorders.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.disorders.map((disorder: string, i: number) => (
                  <Badge key={i}>{disorder}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">None specified.</p>
            )}
          </div>

          <div>
            <h3 className="font-semibold">Medical History</h3>
            <p className="mt-1 text-muted-foreground">{profile.medical_history || "No medical history provided."}</p>
          </div>

          <div>
            <h3 className="font-semibold">Current Medications</h3>
            <p className="mt-1 text-muted-foreground">{profile.current_medications || "No current medications listed."}</p>
          </div>

          <div>
            <h3 className="font-semibold">Therapy Goals</h3>
            <p className="mt-1 text-muted-foreground">{profile.therapy_goals || "No therapy goals provided."}</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => navigate("/profile/edit")}>Edit Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PatientProfile;
