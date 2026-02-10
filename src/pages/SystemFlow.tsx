import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  "Patient",
  "Assessment",
  "AI analysis",
  "Matchmaking",
  "Booking",
  "Payment",
  "Session",
  "Notes",
];

const SystemFlow = () => {
  return (
    <AppShell
      title="MindConnect system flow"
      description="How data moves through assessments, AI, and human care across all roles."
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)]">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">End-to-end journey</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              {steps.map((step, index) => (
                <div key={step} className="relative flex flex-col items-center text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                    {index + 1}
                  </div>
                  <p className="mt-2 text-xs font-medium text-foreground">{step}</p>
                  {index < steps.length - 1 && (
                    <span className="absolute right-[-18px] top-5 hidden h-[1px] w-8 bg-border md:inline-block" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-lg">Role perspectives</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Patient:</span> sees onboarding, AI
              assessment, psychologist list, booking, payments, sessions, and progress dashboard.
            </p>
            <p>
              <span className="font-medium text-foreground">Psychologist:</span> sees upcoming sessions,
              AI pre-session reports, secure video, and structured note-taking.
            </p>
            <p>
              <span className="font-medium text-foreground">Admin:</span> sees user management,
              verification workflow, and compliance & analytics panels.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default SystemFlow;
