import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

const VerifyEmail = () => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");
  const [resending, setResending] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  const resendCode = async () => {
    if (!userId || !email) {
      toast({
        title: "Error",
        description: "Missing user information",
        variant: "destructive",
      });
      return;
    }

    try {
      setResending(true);

      // Generate new code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();

      // Store new code
      const { error: codeError } = await supabase.rpc('insert_verification_code', {
        p_user_id: userId,
        p_code: verificationCode,
        p_expires_at: expiresAt,
      });

      if (codeError) throw codeError;

      // Send email
      const { error: emailError } = await supabase.functions.invoke('send-verification-email', {
        body: { email, code: verificationCode },
      });

      if (emailError) throw emailError;

      toast({
        title: "Code resent!",
        description: "Check your inbox for the new verification code",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend code",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    // Check if already verified/logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email_confirmed_at) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || !userId) {
      toast({
        title: "Missing information",
        description: "Please enter the verification code",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('verify_email_code', {
        p_user_id: userId,
        p_code: code,
      });

      if (error) throw error;

      if (data && data[0]?.success) {
        // Email is now confirmed in Supabase auth
        toast({
          title: "Email verified!",
          description: "Signing you in...",
        });
        
        // Redirect to home - user is now verified
        setTimeout(() => {
          navigate("/auth");
        }, 1000);
      } else {
        toast({
          title: "Verification failed",
          description: data?.[0]?.message || "Invalid or expired code",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Verification failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-accent/5 to-primary/5 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.1),transparent_50%)]" />
      
      <Card className="w-full max-w-md relative z-10 border-primary/20 shadow-2xl backdrop-blur-sm bg-card/80">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <CheckCircle2 className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-base">
            {email ? (
              <>Enter the 6-digit code sent to <strong>{email}</strong></>
            ) : (
              "Enter the 6-digit code sent to your email"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Verification Code</Label>
              <Input
                id="code"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                disabled={loading}
                maxLength={6}
                className="text-center text-2xl font-mono tracking-wider"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 text-lg font-semibold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify Email"
              )}
            </Button>
            <div className="text-center space-y-2">
              <Button
                type="button"
                variant="link"
                onClick={() => navigate("/auth")}
                disabled={loading || resending}
                className="text-sm"
              >
                Back to sign in
              </Button>
              <div className="text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <Button
                  type="button"
                  variant="link"
                  onClick={resendCode}
                  disabled={loading || resending}
                  className="text-sm p-0 h-auto font-normal"
                >
                  {resending ? "Sending..." : "Resend code"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
