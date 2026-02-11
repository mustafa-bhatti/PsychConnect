'use client';

import { useState } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  useMindConnect,
  type MindConnectRole,
} from '@/context/MindConnectContext';

const Auth = () => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [selectedRole, setSelectedRole] = useState<'patient' | 'psychologist'>(
    'patient',
  );
  const { setRole } = useMindConnect();

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const email = (formData.get('email') as string).trim();
    const password = (formData.get('password') as string).trim();
    const patientProfile = {
      full_name: (formData.get('full_name') as string | null)?.trim() || '',
      gender: (formData.get('gender') as string | null)?.trim() || '',
      date_of_birth: (formData.get('dob') as string | null) || '',
      medical_history:
        (formData.get('medical_history') as string | null)?.trim() || '',
      preferences_text:
        (formData.get('preferences') as string | null)?.trim() || '',
    };
    const supabase = createClient();

    if (mode === 'login') {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        alert(error.message); // Replace with toast later
      } else {
        // Read the actual role from user metadata, not the UI tab
        const userRole = data.user?.user_metadata?.role as
          | MindConnectRole
          | undefined;
        const resolvedRole = userRole ?? 'patient';
        setRole(resolvedRole);
        const pendingProfile = localStorage.getItem('pendingPatientProfile');
        if (pendingProfile && resolvedRole === 'patient') {
          const response = await fetch('/api/patients', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: pendingProfile,
          });
          if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            alert(data.error || 'Failed to create patient profile.');
          } else {
            localStorage.removeItem('pendingPatientProfile');
          }
        }
        const dashboardPath =
          resolvedRole === 'psychologist'
            ? '/psych/dashboard'
            : resolvedRole === 'admin'
              ? '/admin/dashboard'
              : '/patient/dashboard';
        window.location.href = dashboardPath;
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: selectedRole,
            ...(selectedRole === 'patient' && patientProfile.full_name
              ? { full_name: patientProfile.full_name }
              : {}),
          },
        },
      });
      if (error) {
        if (error.message.includes('rate limit')) {
          alert(
            "Too many attempts! Please disable 'Confirm Email' in Supabase dashboard or wait a while.",
          );
        } else {
          alert(error.message);
        }
      } else {
        if (selectedRole === 'patient') {
          const payload = JSON.stringify(patientProfile);
          if (data.session?.user) {
            const response = await fetch('/api/patients', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: payload,
            });
            if (!response.ok) {
              const data = await response.json().catch(() => ({}));
              alert(data.error || 'Failed to create patient profile.');
            }
          } else {
            // Store locally until the user logs in after email confirmation
            localStorage.setItem('pendingPatientProfile', payload);
          }
        }
        if (data.session?.user) {
          const dashboardPath =
            selectedRole === 'psychologist'
              ? '/psych/dashboard'
              : '/patient/dashboard';
          window.location.href = dashboardPath;
          return;
        }
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
                <AuthForm
                  mode={mode}
                  selectedRole={selectedRole}
                  setMode={setMode}
                  onSubmit={handleAuth}
                />
              </TabsContent>
              <TabsContent value="psychologist" className="space-y-4">
                <AuthForm
                  mode={mode}
                  selectedRole={selectedRole}
                  setMode={setMode}
                  onSubmit={handleAuth}
                />
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
  selectedRole: 'patient' | 'psychologist';
  setMode: (mode: 'login' | 'signup') => void;
  onSubmit: (event: React.FormEvent) => void;
}

const AuthForm = ({ mode, selectedRole, setMode, onSubmit }: AuthFormProps) => {
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
      {mode === 'signup' && selectedRole === 'patient' && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full name</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Your full name"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dob">Date of birth</Label>
            <Input id="dob" name="dob" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              name="gender"
              aria-label="Gender"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              <option value="">Select gender</option>
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Non-binary">Non-binary</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="medical_history">Medical history</Label>
            <Textarea
              id="medical_history"
              name="medical_history"
              placeholder="Share any diagnoses, medications, or relevant history"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="preferences">Preferences</Label>
            <Textarea
              id="preferences"
              name="preferences"
              placeholder="Language, therapy style, availability, or other preferences"
              required
            />
          </div>
        </div>
      )}
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
