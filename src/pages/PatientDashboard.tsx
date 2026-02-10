import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const PatientDashboard = () => {
  return (
    <AppShell
      title="Patient dashboard"
      description="See your upcoming sessions, past history, and AI-assisted progress over time."
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Upcoming session</CardTitle>
                <CardDescription>Today, 7:00 pm with Dr. Ayesha Khan</CardDescription>
              </div>
              <Badge variant="secondary">Confirmed</Badge>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Button variant="hero" size="sm">
                Join session
              </Button>
              <Button variant="subtle" size="sm">
                Reschedule
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg">Progress timeline</CardTitle>
              <CardDescription>How your scores and sessions change over time.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <TimelineItem label="Session 3 completed" detail="Stress score decreased from 22  18" />
              <TimelineItem label="Session 2 completed" detail="Introduced breathing exercises for sleep." />
              <TimelineItem label="Initial AI assessment" detail="Moderate depression, mild anxiety" />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg">Reports & downloads</CardTitle>
              <CardDescription>Ask your psychologist if you need a formal report.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Button variant="subtle" size="sm" className="w-full justify-between">
                Download session summaries (zip)
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg">Profile & settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>Language: Urdu &amp; English</p>
              <p>Preferred slots: Weekday evenings</p>
              <p>AI assessment: Enabled</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

interface TimelineItemProps {
  label: string;
  detail: string;
}

const TimelineItem = ({ label, detail }: TimelineItemProps) => (
  <div className="flex gap-3">
    <div className="mt-1 h-2 w-2 rounded-full bg-primary" />
    <div>
      <p className="text-xs font-medium text-foreground">{label}</p>
      <p className="text-[11px] text-muted-foreground">{detail}</p>
    </div>
  </div>
);

export default PatientDashboard;
