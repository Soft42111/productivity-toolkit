import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cloud, X, Sparkles, Shield } from "lucide-react";
import type { User } from '@supabase/supabase-js';

interface AuthPromptProps {
  appName: string;
  onDismiss?: () => void;
}

const AuthPrompt = ({ appName, onDismiss }: AuthPromptProps) => {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const checkUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);

      // Check if user has dismissed this prompt before
      const dismissedKey = `auth-prompt-dismissed-${appName}`;
      const wasDismissed = localStorage.getItem(dismissedKey);

      // Show prompt only if not authenticated and not previously dismissed
      if (!currentUser && !wasDismissed) {
        // Delay the prompt slightly for better UX
        setTimeout(() => setOpen(true), 1000);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        setOpen(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [appName]);

  const handleDismiss = () => {
    setOpen(false);
    const dismissedKey = `auth-prompt-dismissed-${appName}`;
    localStorage.setItem(dismissedKey, "true");
    onDismiss?.();
  };

  const handleSignUp = () => {
    navigate("/auth");
  };

  if (user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleDismiss}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <Cloud className="h-6 w-6 text-primary" />
            </div>
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3 w-3" />
              Premium Feature
            </Badge>
          </div>
          <DialogTitle className="text-2xl">Save Your Work in the Cloud</DialogTitle>
          <DialogDescription className="text-base pt-2">
            Sign up to unlock cloud storage and sync your {appName} data across all devices.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10">
              <Shield className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Secure Cloud Storage</p>
                <p className="text-xs text-muted-foreground">Your data is encrypted and backed up automatically</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10">
              <Cloud className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Sync Across Devices</p>
                <p className="text-xs text-muted-foreground">Access your work from anywhere, anytime</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/10">
              <Sparkles className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-sm">Never Lose Progress</p>
                <p className="text-xs text-muted-foreground">Automatic save and version history</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button onClick={handleSignUp} className="w-full" size="lg">
              Sign Up for Free
            </Button>
            <Button onClick={handleDismiss} variant="ghost" className="w-full">
              Continue Without Saving
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            Without an account, your data is stored locally and may be lost if you clear your browser data.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthPrompt;
