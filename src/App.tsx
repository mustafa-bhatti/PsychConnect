import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import PatientOnboarding from "./pages/PatientOnboarding";
import PatientAssessment from "./pages/PatientAssessment";
import PatientMatchmaking from "./pages/PatientMatchmaking";
import PatientBooking from "./pages/PatientBooking";
import PatientSession from "./pages/PatientSession";
import PatientDashboard from "./pages/PatientDashboard";
import PsychDashboard from "./pages/PsychDashboard";
import PsychSessionReport from "./pages/PsychSessionReport";
import AdminDashboard from "./pages/AdminDashboard";
import SystemFlow from "./pages/SystemFlow";
import { MindConnectProvider } from "./context/MindConnectContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MindConnectProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/patient/onboarding" element={<PatientOnboarding />} />
            <Route path="/patient/assessment" element={<PatientAssessment />} />
            <Route path="/patient/matchmaking" element={<PatientMatchmaking />} />
            <Route path="/patient/booking" element={<PatientBooking />} />
            <Route path="/patient/session" element={<PatientSession />} />
            <Route path="/patient/dashboard" element={<PatientDashboard />} />
            <Route path="/psych/dashboard" element={<PsychDashboard />} />
            <Route path="/psych/report/:sessionId" element={<PsychSessionReport />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/system-flow" element={<SystemFlow />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MindConnectProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
