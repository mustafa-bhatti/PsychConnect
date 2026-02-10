'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AppShell } from '@/components/layout/AppShell';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMindConnect } from '@/context/MindConnectContext';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'psychologist'>(
    'patient'
  );
  const { setRole } = useMindConnect();
  const router = useRouter();

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = (formData.get('email') as string).trim();
    const password = (formData.get('password') as string).trim();
    const supabase = createClient();

    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert(error.message); // Replace with toast later
      } else {
        setRole(selectedRole); // Optimistic UI update
        router.refresh(); // Refresh to let middleware handle redirect
      }
    } else {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: selectedRole,
            // Add other profile fields here if needed
          },
        },
      });
      if (error) {
        if (error.message.includes('rate limit')) {
          alert(
            "Too many attempts! Please disable 'Confirm Email' in Supabase dashboard or wait a while."
          );
        } else {
          alert(error.message);
        }
      } else {
        alert('Account created! Please check your email/login.');
        setMode('login');
      }
    }
  };

  return (
    <AppShell
      title={
        mode === 'login' ? 'Welcome back' : 'Create your MindConnect account'
      }
      description="Choose your role and continue to secure, AI-assisted care."
    >
      <div className="mx-auto grid max-w-3xl gap-8 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">
              {mode === 'login' ? 'Login' : 'Sign up'}
            </CardTitle>
            <CardDescription>
              Use your email and password to access patient or psychologist
              tools.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              value={selectedRole}
              onValueChange={(v) =>
                setSelectedRole(v as 'patient' | 'psychologist')
              }
            >
              <TabsList className="mb-4">
                <TabsTrigger value="patient">Patient</TabsTrigger>
                <TabsTrigger value="psychologist">Psychologist</TabsTrigger>
              </TabsList>
              <TabsContent value="patient" className="space-y-4">
                <AuthForm mode={mode} setMode={setMode} onSubmit={handleAuth} />
              </TabsContent>
              <TabsContent value="psychologist" className="space-y-4">
                <AuthForm mode={mode} setMode={setMode} onSubmit={handleAuth} />
              </TabsContent>
            </Tabs>
            <p className="mt-4 text-xs text-muted-foreground">
              By continuing you agree to AI-assisted assessment, supervised by
              licensed psychologists.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-muted/60 shadow-subtle">
          <CardHeader>
            <CardTitle className="text-sm">Security & Compliance</CardTitle>
            <CardDescription>
              MindConnect is built for PDPA 2023 alignment and encrypted video
              consultations.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground">
            <ul className="space-y-2 list-disc pl-4">
              <li>
                Role-based access for patients, psychologists, and admins.
              </li>
              <li>
                AI assessments are visible to psychologists, never used to
                replace care.
              </li>
              <li>
                Session notes and reports are stored securely with access logs.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

interface AuthFormProps {
  mode: 'login' | 'signup';
  setMode: (mode: 'login' | 'signup') => void;
  onSubmit: (event: React.FormEvent) => void;
}

const AuthForm = ({ mode, setMode, onSubmit }: AuthFormProps) => {
  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
        />
      </div>
      <Button type="submit" variant="hero" size="lg" className="w-full">
        {mode === 'login' ? 'Continue' : 'Create account'}
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        {mode === 'login'
          ? "Don't have an account? "
          : 'Already have an account? '}
        <button
          type="button"
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="font-medium text-primary hover:underline hover:text-primary/90"
        >
          {mode === 'login' ? 'Sign up' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default Auth;
