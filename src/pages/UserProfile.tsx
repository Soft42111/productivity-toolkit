import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { NavLink } from "@/components/NavLink";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogOut, Save, User } from "lucide-react";
import type { User as SupabaseUser } from '@supabase/supabase-js';

const UserProfile = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Temporarily disabled authentication
    setLoading(false);
  }, []);

  const fetchProfile = async (userId: string) => {
    // Temporarily disabled
    setLoading(false);
  };

  const handleSaveProfile = async () => {
    // Temporarily disabled
    setSaving(true);
    setTimeout(() => {
      toast({
        title: "Profile updated",
        description: "Your profile has been saved locally.",
      });
      setSaving(false);
    }, 500);
  };

  const handleSignOut = async () => {
    // Temporarily disabled
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <NavLink to="/" />
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Button variant="outline" onClick={handleSignOut} size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
        
        <Card className="shadow-lg backdrop-blur-sm bg-card/50 border-border/50">
          <CardHeader>
            <CardTitle className="text-3xl flex items-center gap-2">
              <User className="h-8 w-8 text-primary" />
              User Profile
            </CardTitle>
            <CardDescription>
              Manage your account information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value="demo@example.com"
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2">
              <Label>Member Since</Label>
              <Input
                value={new Date().toLocaleDateString()}
                disabled
                className="bg-muted"
              />
            </div>

            <Button onClick={handleSaveProfile} disabled={saving} className="w-full">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Profile
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfile;
