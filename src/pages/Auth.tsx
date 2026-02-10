import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMindConnect } from "@/context/MindConnectContext";

const Auth = () => {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [selectedRole, setSelectedRole] = useState<"patient" | "psychologist">("patient");
  const { setRole } = useMindConnect();
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setRole(selectedRole);
    if (selectedRole === "patient") {
      navigate("/patient/onboarding");
    } else {
      navigate("/psych/dashboard");
    }
  };

  return (
    <AppShell
      title={mode === "login" ? "Welcome back" : "Create your MindConnect account"}
      description="Choose your role and continue to secure, AI-assisted care."
    >
      <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">{mode === "login" ? "Login" : "Sign up"}</CardTitle>
            <CardDescription>
              Use your email and password to access patient or psychologist tools.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={selectedRole}
              onValueChange={(v) => setSelectedRole(v as "patient" | "psychologist")}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="psychologist">Psychologist</TabsTrigger>
              </TabsList>
              <TabsContent value="patient" className="space-y-4">
                <AuthForm mode={mode} onSubmit={handleSubmit} />
              </TabsContent>
              <TabsContent value="psychologist" className="space-y-4">
                <AuthForm mode={mode} onSubmit={handleSubmit} />
              </TabsContent>
            </Tabs>
            <p className="mt-4 text-xs text-muted-foreground">
              By continuing you agree to AI-assisted assessment, supervised by licensed psychologists.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted/60 shadow-subtle">
          <CardHeader>
            <CardTitle className="text-sm">Security & Compliance</CardTitle>
            <CardDescription>
              MindConnect is built for PDPA 2023 alignment and encrypted video consultations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground">
            <ul className="space-y-2 list-disc pl-4">
              <li>Role-based access for patients, psychologists, and admins.</li>
              <li>AI assessments are visible to psychologists, never used to replace care.</li>
              <li>Session notes and reports are stored securely with access logs.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

interface AuthFormProps {
  mode: "login" | "signup";
  onSubmit: (event: React.FormEvent) => void;
}

const AuthForm = ({ mode, onSubmit }: AuthFormProps) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="you@example.com" required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" minLength={8} required />
      </div>
      {mode === "signup" && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" type="password" minLength={8} required />
        </div>
      )}
      <Button type="submit" variant="hero" size="lg" className="w-full">
        {mode === "login" ? "Continue" : "Create account"}
      </Button>
      <button
        type="button"
        className="w-full text-center text-xs text-muted-foreground hover:text-foreground"
        onClick={() => {
          // Toggle between login and signup by interacting with the Tabs parent via DOM event
          const nextMode = mode === "login" ? "signup" : "login";
          // No state here; handled in parent via setMode when needed. This is a static placeholder.
          console.info("Switch mode in parent to", nextMode);
        }}
      >
        {mode === "login" ? "New to MindConnect? Sign up" : "Already have an account? Log in"}
      </button>
    </form>
  );
};

export default Auth;
