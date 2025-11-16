import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, RefreshCw, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import ThemeToggle from "@/components/ThemeToggle";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const PasswordGenerator = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([16]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (charset === "") {
      toast({
        title: "Error",
        description: "Please select at least one character type",
        variant: "destructive",
      });
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length[0]; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Password copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getPasswordStrength = () => {
    if (!password) return { label: "", color: "" };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (password.length >= 16) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) return { label: "Weak", color: "text-destructive" };
    if (strength <= 4) return { label: "Medium", color: "text-yellow-500" };
    return { label: "Strong", color: "text-accent" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-background p-6 animate-fade-in flex flex-col">
      <div className="max-w-2xl mx-auto flex-1">
        <div className="flex justify-between items-center mb-6">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <ThemeToggle />
        </div>

        <Card className="p-6 shadow-[var(--shadow-soft)]">
          <h1 className="text-2xl font-bold text-foreground mb-6">
            Password Generator
          </h1>

          <Card className="p-4 bg-secondary mb-6">
            <div className="flex items-center gap-3">
              <Input
                value={password}
                readOnly
                placeholder="Click generate to create password"
                className="flex-1 font-mono text-lg"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                disabled={!password}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-accent" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            {password && (
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Password Strength:
                </span>
                <span className={`text-sm font-semibold ${strength.color}`}>
                  {strength.label}
                </span>
              </div>
            )}
          </Card>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium text-foreground">
                  Password Length
                </label>
                <span className="text-sm font-bold text-primary">{length[0]}</span>
              </div>
              <Slider
                value={length}
                onValueChange={setLength}
                min={4}
                max={32}
                step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="uppercase"
                  checked={includeUppercase}
                  onCheckedChange={(checked) => setIncludeUppercase(checked as boolean)}
                />
                <label
                  htmlFor="uppercase"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Include Uppercase Letters (A-Z)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="lowercase"
                  checked={includeLowercase}
                  onCheckedChange={(checked) => setIncludeLowercase(checked as boolean)}
                />
                <label
                  htmlFor="lowercase"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Include Lowercase Letters (a-z)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="numbers"
                  checked={includeNumbers}
                  onCheckedChange={(checked) => setIncludeNumbers(checked as boolean)}
                />
                <label
                  htmlFor="numbers"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Include Numbers (0-9)
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="symbols"
                  checked={includeSymbols}
                  onCheckedChange={(checked) => setIncludeSymbols(checked as boolean)}
                />
                <label
                  htmlFor="symbols"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Include Symbols (!@#$%^&*)
                </label>
              </div>
            </div>

            <Button onClick={generatePassword} className="w-full gap-2" size="lg">
              <RefreshCw className="h-5 w-5" />
              Generate Password
            </Button>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default PasswordGenerator;
