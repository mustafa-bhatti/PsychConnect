'use client';

import Link from 'next/link';
import {
  ArrowRight,
  Shield,
  Clock,
  Users,
  Brain,
  Palette,
  FileText,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-teal-100">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-50/80 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              PsychConnect
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/auth"
              className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
            >
              Log in
            </Link>
            <Link href="/auth">
              <Button className="rounded-full bg-teal-600 hover:bg-teal-700 text-white shadow-lg shadow-teal-600/20">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="px-6 max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center py-20 lg:py-32">
          {/* Left: Typography */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-sm font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
              </span>
              Now accepting new patients
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] text-slate-900">
              Mental Healthcare,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-teal-400">
                Reimagined
              </span>{' '}
              for Pakistan.
            </h1>

            <p className="text-xl text-slate-600 max-w-lg leading-relaxed">
              Secure video consultations matched with AI-assisted clinical
              insights. High-quality care, accessible from your home.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/patient/onboarding">
                <Button
                  size="lg"
                  className="rounded-full h-14 px-8 text-lg bg-teal-600 hover:bg-teal-700 text-white shadow-xl shadow-teal-600/20 transform hover:-translate-y-1 transition-all duration-300"
                >
                  Start Free Assessment
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Shield className="h-4 w-4 text-teal-600" />
                PDPA Compliant & Secure
              </div>
            </div>
          </div>

          {/* Right: Glassmorphic Card */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none perspective-1000">
            {/* Background blobs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-teal-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl" />

            {/* Main Card */}
            <div className="relative bg-white/40 backdrop-blur-xl border border-white/50 p-6 rounded-3xl shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                    AI
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      Analysis Complete
                    </h3>
                    <p className="text-xs text-slate-500">Just now</p>
                  </div>
                </div>
                <div className="h-8 px-3 rounded-full bg-green-100 text-green-700 text-xs font-medium flex items-center">
                  98% Confidence
                </div>
              </div>

              {/* Content Mockup */}
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="w-1/3 aspect-square bg-slate-100 rounded-xl overflow-hidden relative group">
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                      <Palette className="h-8 w-8" />
                    </div>
                    {/* Simulated scanning effect */}
                    <div className="absolute inset-x-0 top-0 h-1 bg-teal-500/50 shadow-[0_0_15px_rgba(20,184,166,0.5)] animate-scan" />
                  </div>
                  <div className="w-2/3 space-y-2">
                    <div className="h-2 w-24 bg-slate-200 rounded-full" />
                    <div className="h-2 w-full bg-slate-100 rounded-full" />
                    <div className="h-2 w-5/6 bg-slate-100 rounded-full" />
                    <div className="h-2 w-4/6 bg-slate-100 rounded-full" />
                  </div>
                </div>

                <div className="bg-white/60 rounded-xl p-4 border border-white/60">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-5 w-5 text-teal-600 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">
                        Clinical Insight
                      </h4>
                      <p className="text-sm text-slate-600 mt-1">
                        Patient shows strong indicators of resilience.
                        Recommended matching with specialists in CBT.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Notification Overlay */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-slate-100 max-w-[200px] animate-bounce-slow">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="h-10 w-10 bg-indigo-100 rounded-full overflow-hidden">
                      <Users className="h-full w-full p-2 text-indigo-500" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      Perfect Match Found
                    </p>
                    <p className="text-sm font-bold text-slate-900">
                      Dr. Sarah Ahmed
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem/Solution Ticker */}
        <div className="w-full bg-slate-900 text-slate-300 py-6 overflow-hidden border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-center md:justify-between text-sm uppercase tracking-widest font-medium">
            <div className="hidden md:flex items-center gap-2">
              <Shield className="h-4 w-4 text-teal-500" />
              <span>PDPA Compliant</span>
            </div>
            <span className="hidden md:block text-slate-700">•</span>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-teal-500" />
              <span>24/7 Access</span>
            </div>
            <span className="hidden md:block text-slate-700">•</span>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-teal-500" />
              <span>Licensed Psychologists</span>
            </div>
            <span className="hidden md:block text-slate-700">•</span>
            <div className="hidden md:flex items-center gap-2">
              <Brain className="h-4 w-4 text-teal-500" />
              <span>AI-Assisted</span>
            </div>
          </div>
        </div>

        {/* How It Works (Bento Grid) */}
        <section className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
              Your Journey to Wellness
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg">
              We&apos;ve redesigned the entire therapy experience to be more
              intuitive, effective, and secure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-6 h-auto md:h-[600px]">
            {/* Card 1 (Large) - The Digital Canvas */}
            <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-8 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 transition-all duration-300">
              <div className="absolute top-0 right-0 -mt-8 -mr-8 h-64 w-64 bg-teal-50 rounded-full blur-3xl group-hover:bg-teal-100 transition-colors" />
              <div className="relative h-full flex flex-col">
                <div className="mb-6">
                  <div className="h-12 w-12 bg-teal-100 text-teal-600 rounded-2xl flex items-center justify-center mb-4">
                    <Palette className="h-6 w-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    The Digital Canvas
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Express yourself beyond words. Our proprietary
                    House-Tree-Person (HTP) digital assessment allows you to
                    draw on screen, while our AI analyzes patterns to provide
                    your therapist with deeper clinical insights before the
                    first hello.
                  </p>
                </div>

                <div className="mt-auto relative w-full h-64 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
                  {/* Simulated Drawing UI */}
                  <div className="absolute inset-4 border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center">
                    <p className="text-slate-400 text-sm font-medium">
                      Interactive Canvas Area
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 (Tall) - Intelligent Matching */}
            <div className="md:col-span-1 md:row-span-2 group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 text-white hover:shadow-xl hover:shadow-slate-900/20 transition-all duration-300">
              <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-teal-900/20 to-transparent" />
              <div className="relative h-full flex flex-col">
                <div className="h-12 w-12 bg-slate-800 text-teal-400 rounded-2xl flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Intelligent Matching</h3>
                <p className="text-slate-400 text-sm mb-8">
                  Our algorithm considers over 20 data points to find your
                  perfect clinical fit.
                </p>

                <div className="mt-auto space-y-4">
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Clinical Fit</span>
                      <span className="text-teal-400">92%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-700 rounded-full">
                      <div className="h-1.5 w-[92%] bg-teal-500 rounded-full shadow-[0_0_10px_rgba(20,184,166,0.5)]" />
                    </div>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-3">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-300">Availability</span>
                      <span className="text-teal-400">100%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-700 rounded-full">
                      <div className="h-1.5 w-full bg-teal-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 (Small) - Secure Video */}
            <div className="md:col-span-1 md:col-start-1 md:row-start-3 group relative overflow-hidden rounded-3xl bg-white border border-slate-200 p-6 hover:border-teal-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    Secure Video
                  </h3>
                  <p className="text-slate-500 text-sm mt-1">
                    End-to-end encrypted sessions.
                  </p>
                </div>
                <div className="h-10 w-10 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center">
                  <Lock className="h-5 w-5" />
                </div>
              </div>
            </div>

            {/* Card 4 (Medium) - Pre-Session Reports */}
            <div className="md:col-span-2 md:col-start-2 md:row-start-3 group relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-50 to-white border border-slate-200 p-6 hover:border-teal-200 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-900">
                    Pre-Session Reports
                  </h3>
                  <p className="text-slate-600 text-sm mt-2">
                    We generate helpful summaries for your therapist so you
                    don&apos;t have to repeat your story every time.
                  </p>
                </div>
                <div className="h-16 w-16 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center rotate-3 group-hover:rotate-6 transition-transform">
                  <FileText className="h-8 w-8 text-teal-600" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-teal-600" />
              <span className="text-lg font-bold text-slate-900">
                PsychConnect
              </span>
            </div>

            <div className="flex items-center gap-8 text-sm font-medium text-slate-500">
              <Link href="#" className="hover:text-teal-600 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="hover:text-teal-600 transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="hover:text-teal-600 transition-colors">
                Contact Support
              </Link>
            </div>

            <div className="text-xs text-slate-400">
              © 2026 PsychConnect Pakistan. All rights reserved.
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default LandingPage;
