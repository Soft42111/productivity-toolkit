import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff, RefreshCw } from "lucide-react";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [tempUserId, setTempUserId] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    
    // Ensure at least one of each required type
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    password += "0123456789"[Math.floor(Math.random() * 10)];
    password += "!@#$%^&*"[Math.floor(Math.random() * 8)];
    
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    setPassword(password);
    toast({
      title: "Password Generated",
      description: "A strong password has been generated for you.",
    });
  };

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) return "Password must be at least 8 characters long";
    if (!/[A-Z]/.test(pwd)) return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pwd)) return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
    if (!/[!@#$%^&*]/.test(pwd)) return "Password must contain at least one special character (!@#$%^&*)";
    return null;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast({
        title: "Invalid Password",
        description: passwordError,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
    } else if (data.user) {
      setTempUserId(data.user.id);
      
      // Send verification email
      try {
        // Generate verification code
        const code = Math.floor(10000 + Math.random() * 90000).toString();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

        console.log(`Generated verification code: ${code} for user: ${data.user.id}`);

        // Try to store verification code using RPC function approach
        // This bypasses RLS by using a proper database function
        let codeStored = false;
        try {
          const { data: insertResult, error: rpcError } = await (supabase as any).rpc('insert_verification_code', {
            p_user_id: data.user.id,
            p_code: code,
            p_expires_at: expiresAt.toISOString(),
          });

          if (!rpcError && insertResult) {
            console.log('✅ Verification code stored via RPC function');
            codeStored = true;
          }
        } catch (rpcErr) {
          console.warn('RPC not available, trying fallback method');
        }

        // Fallback: Try direct insert if RPC doesn't exist
        if (!codeStored) {
          console.log('Attempting direct insert as fallback...');
          const { error: dbError } = await supabase
            .from("email_verifications")
            .insert({
              user_id: data.user.id,
              code,
              expires_at: expiresAt.toISOString(),
            });

          if (dbError) {
            console.error('Direct insert error:', dbError);
            
            // If both fail, give detailed error
            toast({
              title: "Verification email failed",
              description: `Database error: ${dbError.message || dbError.code || "Unknown error"}. Make sure the RLS policy allows inserts.`,
              variant: "destructive",
            });
            
            // Delete the auth user since we couldn't create verification
            await (supabase.auth as any).admin.deleteUser(data.user.id).catch((e: any) => console.log('Could not delete user'));
            
            setLoading(false);
            return;
          }
          console.log('✅ Verification code stored via direct insert');
          codeStored = true;
        }


        // For now, log the code to console for development only
        console.log(`✅ Verification code for ${email}: ${code}`);
        
        // Try to send email - this is REQUIRED, not optional
        try {
          const { data: emailResult, error: emailError } = await supabase.functions.invoke('send-verification-email', {
            body: { email, userId: data.user.id }
          });

          if (emailError) {
            throw new Error(emailError.message);
          }

          // Check if email sending actually failed
          if (emailResult?.error) {
            throw new Error(emailResult.error);
          }

          // Email sent successfully
          setVerificationStep(true);
          setLoading(false);
          toast({
            title: "Check your email",
            description: `We've sent a verification code to ${email}`,
          });
        } catch (emailErr: any) {
          console.error('Email sending failed:', emailErr);
          
          // Delete the user since we couldn't send the email
          await supabase.auth.admin.deleteUser(data.user.id).catch(console.error);
          
          // Show error to user with instructions
          toast({
            title: "Email sending failed",
            description: "Could not send verification email. Please verify your domain at resend.com/domains and update the 'from' address.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error('Unexpected error:', err);
        toast({
          title: "Verification email failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (verificationCode.length !== 5) {
      toast({
        title: "Invalid Code",
        description: "Please enter the 5-digit code from your email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Try to use RPC function first for verification
      try {
        const { data: result, error: rpcError } = await (supabase as any).rpc('verify_email_code', {
          p_user_id: tempUserId,
          p_code: verificationCode,
        });

        if (!rpcError && result && result[0]?.success) {
          // RPC verification succeeded
          toast({
            title: "Email verified!",
            description: "Your account has been created. You can now sign in.",
          });
          setVerificationStep(false);
          setVerificationCode("");
          setEmail("");
          setPassword("");
          setLoading(false);
          return;
        }
      } catch (rpcErr) {
        console.warn('RPC verification not available, falling back to direct query');
      }

      // Fallback: Query verification code directly from database
      const { data: verification, error: fetchError } = await supabase
        .from("email_verifications")
        .select("*")
        .eq("user_id", tempUserId)
        .eq("code", verificationCode)
        .eq("verified", false)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error('Fetch error:', fetchError);
        toast({
          title: "Verification failed",
          description: "Database error. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (!verification) {
        toast({
          title: "Verification failed",
          description: "Invalid or expired verification code",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Mark as verified
      const { error: updateError } = await supabase
        .from("email_verifications")
        .update({ verified: true })
        .eq("id", verification.id);

      if (updateError) {
        console.error('Update error:', updateError);
        toast({
          title: "Verification failed",
          description: "Failed to verify code. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Try to invoke function if available, but don't fail if it's not deployed
      try {
        await supabase.functions.invoke('verify-email-code', {
          body: { userId: tempUserId, code: verificationCode }
        });
      } catch (funcErr) {
        console.warn('Edge Function not available, but verification succeeded locally');
        // Function failed but verification is already done, so continue anyway
      }

      toast({
        title: "Email verified!",
        description: "Your account has been created. You can now sign in.",
      });
      setVerificationStep(false);
      setVerificationCode("");
      setEmail("");
      setPassword("");
      setLoading(false);
    } catch (err) {
      console.error('Unexpected error:', err);
      toast({
        title: "Verification failed",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
    }

    setLoading(false);
  };

  if (verificationStep) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Verify Your Email</CardTitle>
            <CardDescription className="text-center">
              Enter the 5-digit code sent to {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="12345"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                  maxLength={5}
                  required
                  className="text-center text-2xl tracking-widest"
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading || verificationCode.length !== 5}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  setVerificationStep(false);
                  setVerificationCode("");
                  setTempUserId("");
                }}
              >
                Back to Sign Up
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Productivity Toolkit</CardTitle>
          <CardDescription className="text-center">
            Sign in or create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Password requirements:</p>
                    <ul className="list-disc list-inside space-y-0.5">
                      <li>At least 8 characters long</li>
                      <li>One uppercase letter</li>
                      <li>One lowercase letter</li>
                      <li>One number</li>
                      <li>One special character (!@#$%^&*)</li>
                    </ul>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={generatePassword}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Generate Strong Password
                </Button>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
