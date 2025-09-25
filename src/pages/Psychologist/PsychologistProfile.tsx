import React, { useState, useEffect } from "react";
import { supabase } from "../../services/supabaseClient";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Loading from "../Loading/Loading";

const PsychologistProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
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
    return <Loading />;
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
        <p className="mb-4 text-muted-foreground">
          You haven’t created your professional profile yet.
        </p>
        <Button onClick={() => navigate("/psychologist-profile/edit")}>
          Create Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{user?.profile?.display_name || "Psychologist"}</CardTitle>
          <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold">Bio</h3>
            <p className="mt-1 text-muted-foreground">{profile.bio || "No bio provided."}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <h4 className="font-semibold">Years of Experience</h4>
                <p className="text-muted-foreground">{profile.years_experience || "—"}</p>
            </div>
            <div>
                <h4 className="font-semibold">Charges per Hour</h4>
                <p className="text-muted-foreground">{profile.charges_per_hour ? `$${profile.charges_per_hour}` : "—"}</p>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Expertise</h3>
            {profile.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill: string, i: number) => (
                  <Badge key={i} variant="secondary">{skill}</Badge>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No expertise listed.</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={() => navigate("/psychologist-profile/edit")}>Edit Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PsychologistProfile;
