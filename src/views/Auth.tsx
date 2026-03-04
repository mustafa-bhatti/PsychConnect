'use client';

import { useState, useRef } from 'react';
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
      <div className="relative mx-auto flex w-full max-w-md flex-col justify-center mt-10">
        {/* Background ambient blobs for glass effect */}
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-blue-400/30 mix-blend-multiply blur-3xl filter dark:bg-blue-600/20" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-purple-400/30 mix-blend-multiply blur-3xl filter dark:bg-purple-600/20" />

        <Card className="relative z-10 overflow-hidden rounded-[2rem] border border-white/40 bg-white/40 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)] backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
          <CardHeader className="text-center pb-8 pt-6">
            <CardTitle className="text-2xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </CardTitle>
            <CardDescription className="text-foreground/60 font-medium">
              Join MindConnect to access secure, AI-assisted care
            </CardDescription>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <Tabs
              value={selectedRole}
              onValueChange={(v) =>
                setSelectedRole(v as 'patient' | 'psychologist')
              }
            >
              <TabsList className="mb-6 grid w-full grid-cols-2 rounded-2xl bg-white/20 p-1 backdrop-blur-md dark:bg-black/20 self-center border border-white/20 dark:border-white/10 shadow-inner">
                <TabsTrigger
                  value="patient"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:dark:bg-black/50 transition-all font-medium py-2"
                >
                  Patient
                </TabsTrigger>
                <TabsTrigger
                  value="psychologist"
                  className="rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:dark:bg-black/50 transition-all font-medium py-2"
                >
                  Psychologist
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="patient"
                className="space-y-4 animate-in fade-in-50 zoom-in-95 duration-200"
              >
                <AuthForm
                  mode={mode}
                  selectedRole={selectedRole}
                  setMode={setMode}
                  onSubmit={handleAuth}
                />
              </TabsContent>
              <TabsContent
                value="psychologist"
                className="space-y-4 animate-in fade-in-50 zoom-in-95 duration-200"
              >
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
  const [step, setStep] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);

  const isPatientSignup = mode === 'signup' && selectedRole === 'patient';
  const totalSteps = isPatientSignup ? 3 : 1;

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    // Validate current step elements
    const stepEl = formRef.current.querySelector(`.step-container-${step}`);
    const inputs = stepEl?.querySelectorAll('input, select, textarea');
    let allValid = true;

    if (inputs) {
      for (const input of Array.from(inputs)) {
        const el = input as HTMLInputElement;
        if (!el.checkValidity()) {
          el.reportValidity();
          allValid = false;
          break;
        }
      }
    }

    if (allValid) {
      setStep((s) => Math.min(s + 1, totalSteps));
    }
  };

  const handleBack = () => setStep((s) => Math.max(s - 1, 1));

  // Reset step if mode changes to avoid UI glitches
  if (!isPatientSignup && step !== 1) {
    setStep(1);
  }

  return (
    <form ref={formRef} className="space-y-6 relative" onSubmit={onSubmit}>
      {isPatientSignup && (
        <div className="flex items-center justify-center gap-3 mb-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${step >= i ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30' : 'bg-zinc-200 text-muted-foreground dark:bg-zinc-800'}`}
              >
                {i}
              </div>
              {i < 3 && (
                <div
                  className={`h-1 w-8 sm:w-12 ml-3 rounded-full transition-all duration-300 ${step > i ? 'bg-blue-600' : 'bg-zinc-200 dark:bg-zinc-800'}`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Step 1: Account Info */}
      <div
        className={`step-container-1 space-y-5 ${isPatientSignup && step !== 1 ? 'hidden' : 'animate-in sm:zoom-in-95 slide-in-from-right-4 fade-in duration-300'}`}
      >
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground/80 font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            required
            className="rounded-xl border-zinc-200 bg-white/80 shadow-sm backdrop-blur-md transition-all placeholder:text-muted-foreground/70 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-900 dark:focus:bg-zinc-900"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password" className="text-foreground/80 font-medium">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            minLength={8}
            required
            className="rounded-xl border-zinc-200 bg-white/80 shadow-sm backdrop-blur-md transition-all placeholder:text-muted-foreground/70 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-900 dark:focus:bg-zinc-900"
          />
        </div>
      </div>

      {mode === 'signup' && selectedRole === 'patient' && (
        <>
          {/* Step 2: Personal details */}
          <div
            className={`step-container-2 rounded-2xl bg-zinc-50/50 p-5 border border-zinc-200/50 backdrop-blur-sm dark:bg-zinc-950/50 dark:border-zinc-800/50 ${step !== 2 ? 'hidden' : 'animate-in sm:zoom-in-95 slide-in-from-right-4 fade-in duration-300'}`}
          >
            <h3 className="font-semibold text-lg mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Personal Profile
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2 col-span-1 sm:col-span-2">
                <Label
                  htmlFor="full_name"
                  className="text-foreground/80 font-medium"
                >
                  Full name
                </Label>
                <Input
                  id="full_name"
                  name="full_name"
                  type="text"
                  placeholder="Your full name"
                  required
                  className="rounded-xl border-zinc-200 bg-white/80 shadow-sm backdrop-blur-md transition-all hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-900 dark:focus:bg-zinc-900"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-foreground/80 font-medium">
                  Date of birth
                </Label>
                <Input
                  id="dob"
                  name="dob"
                  type="date"
                  required
                  className="rounded-xl border-zinc-200 bg-white/80 shadow-sm backdrop-blur-md transition-all hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-900 dark:focus:bg-zinc-900"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="gender"
                  className="text-foreground/80 font-medium"
                >
                  Gender
                </Label>
                <select
                  id="gender"
                  name="gender"
                  aria-label="Gender"
                  required
                  className="flex h-10 w-full rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-sm text-foreground shadow-sm backdrop-blur-md transition-all hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-900 dark:focus:bg-zinc-900"
                >
                  <option value="">Select gender</option>
                  <option value="Female">Female</option>
                  <option value="Male">Male</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 3: Medical & Preferences */}
          <div
            className={`step-container-3 rounded-2xl bg-zinc-50/50 p-5 border border-zinc-200/50 backdrop-blur-sm dark:bg-zinc-950/50 dark:border-zinc-800/50 ${step !== 3 ? 'hidden' : 'animate-in sm:zoom-in-95 slide-in-from-right-4 fade-in duration-300'}`}
          >
            <h3 className="font-semibold text-lg mb-4 bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
              Care Preferences
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2 sm:col-span-2">
                <Label
                  htmlFor="medical_history"
                  className="text-foreground/80 font-medium"
                >
                  Medical history
                </Label>
                <Textarea
                  id="medical_history"
                  name="medical_history"
                  placeholder="Share any diagnoses, medications, or relevant history"
                  required
                  className="rounded-xl border-zinc-200 bg-white/80 shadow-sm backdrop-blur-md transition-all placeholder:text-muted-foreground/70 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-900 dark:focus:bg-zinc-900 min-h-[90px]"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="language_preference"
                  className="text-foreground/80 font-medium"
                >
                  Language
                </Label>
                <select
                  id="language_preference"
                  name="language_preference"
                  aria-label="Language preference"
                  required
                  className="flex h-10 w-full rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-sm text-foreground shadow-sm backdrop-blur-md transition-all hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-900 dark:focus:bg-zinc-900"
                >
                  <option value="">Preferred language</option>
                  <option value="English">English</option>
                  <option value="Urdu">Urdu</option>
                  <option value="Punjabi">Punjabi</option>
                  <option value="Sindhi">Sindhi</option>
                  <option value="Pashto">Pashto</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="therapy_style"
                  className="text-foreground/80 font-medium"
                >
                  Therapy style
                </Label>
                <select
                  id="therapy_style"
                  name="therapy_style"
                  aria-label="Therapy style preference"
                  className="flex h-10 w-full rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-sm text-foreground shadow-sm backdrop-blur-md transition-all hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-900 dark:focus:bg-zinc-900"
                >
                  <option value="">Style (optional)</option>
                  <option value="CBT">CBT</option>
                  <option value="Psychodynamic">Psychodynamic</option>
                  <option value="Humanistic">Humanistic</option>
                  <option value="Integrative">Integrative</option>
                  <option value="No preference">No preference</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label
                  htmlFor="availability_preference"
                  className="text-foreground/80 font-medium"
                >
                  Availability
                </Label>
                <select
                  id="availability_preference"
                  name="availability_preference"
                  aria-label="Availability preference"
                  className="flex h-10 w-full rounded-xl border border-zinc-200 bg-white/80 px-3 py-2 text-sm text-foreground shadow-sm backdrop-blur-md transition-all hover:bg-white focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-900 dark:focus:bg-zinc-900"
                >
                  <option value="">Time preference (optional)</option>
                  <option value="Morning">Morning (8AM - 12PM)</option>
                  <option value="Afternoon">Afternoon (12PM - 5PM)</option>
                  <option value="Evening">Evening (5PM - 9PM)</option>
                  <option value="Flexible">Flexible</option>
                </select>
              </div>
              <div className="space-y-2 sm:col-span-2 hidden">
                {/* Additional Prefs removed to save even more space, simplified into Medical History */}
                <Textarea
                  id="additional_preferences"
                  name="additional_preferences"
                  placeholder="Any other preferences or requirements (optional)"
                  className="rounded-xl border-zinc-200 bg-white/80 shadow-sm backdrop-blur-md transition-all placeholder:text-muted-foreground/70 hover:bg-white focus:bg-white focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900/80 dark:hover:bg-zinc-900 dark:focus:bg-zinc-900 min-h-[100px]"
                />
              </div>
            </div>
          </div>
        </>
      )}

      <div className="pt-2 flex flex-col sm:flex-row gap-3">
        {isPatientSignup && step > 1 && (
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            className="rounded-xl font-semibold w-full sm:w-1/3 hover:-translate-y-0.5 transition-transform"
          >
            Back
          </Button>
        )}

        {step < totalSteps && isPatientSignup ? (
          <Button
            type="button"
            onClick={handleNext}
            size="lg"
            className="w-full rounded-xl bg-blue-600/90 hover:bg-blue-600 font-semibold shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5"
          >
            Continue
          </Button>
        ) : (
          <Button
            type="submit"
            size="lg"
            className={`w-full rounded-xl bg-blue-600/90 hover:bg-blue-600 font-semibold shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-all hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 ${isPatientSignup && step > 1 ? 'sm:w-2/3' : ''}`}
          >
            {mode === 'login' ? 'Continue to dashboard' : 'Create account'}
          </Button>
        )}
      </div>

      <div className="text-center text-sm font-medium text-muted-foreground/80 pt-2">
        {mode === 'login'
          ? "Don't have an account? "
          : 'Already have an account? '}
        <button
          type="button"
          onClick={() => {
            setMode(mode === 'login' ? 'signup' : 'login');
            setStep(1); // Reset step on mode change
          }}
          className="font-bold text-blue-600 hover:text-blue-500 transition-colors"
        >
          {mode === 'login' ? 'Sign up' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default Auth;
