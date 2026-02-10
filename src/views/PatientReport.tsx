'use client';

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";


const PatientReport = () => {
  const router = useRouter();

  return (
    <AppShell
      title="AI Pre-Session Report"
      description="A calm summary of your assessment results for your psychologist."
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Emotional scores</CardTitle>
            <CardDescription>Scores are for screening only, not a formal diagnosis.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <ScoreCard label="Depression" score={18} severity="Moderate" />
            <ScoreCard label="Anxiety" score={12} severity="Mild" />
            <ScoreCard label="Stress" score={22} severity="Moderate" />
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-lg">AI confidence</CardTitle>
            <CardDescription>How confident the AI is in its patterns, not in any diagnosis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Questionnaires</span>
                <span>High</span>
              </div>
              <Progress value={86} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Drawings</span>
                <span>Medium</span>
              </div>
              <Progress value={64} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Voice tone</span>
                <span>Medium</span>
              </div>
              <Progress value={58} />
            </div>
            <p className="text-[11px]">
              Disclaimer: AI supports psychologists, it never replaces clinical judgement. Your clinician
              can override or ignore any AI suggestion.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-lg">Cultural & somatic insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              Reported symptoms include low mood, loss of interest, disturbed sleep, and physical
              complaints like headaches and body pain.
            </p>
            <p>
              These may be culturally expressed as laziness, sara dard, or thakan rather than
              directly naming depression or anxiety.
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-subtle">
          <CardHeader>
            <CardTitle className="text-lg">Drawing interpretation summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              HTP drawings show a small house with few windows and a tree with thin branches,
              suggesting themes of withdrawal and low perceived support.
            </p>
            <p>
              PPAT drawing indicates effortful reaching, with the apple high above the person, which can
              symbolise feeling that goals are hard to access.
            </p>
            <p className="text-[11px]">
              Only trained psychologists interpret projective tests. These notes are prompts, not final
              conclusions.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex flex-wrap justify-between gap-3">
        <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
          <Badge variant="secondary">Licensed psychologists</Badge>
          <Badge variant="secondary">PDPA 2023 aligned</Badge>
        </div>
        <Button variant="hero" onClick={() => router.push("/patient/matchmaking")}>
          Continue to psychologist matching
        </Button>
      </div>
    </AppShell>
  );
};

interface ScoreCardProps {
  label: string;
  score: number;
  severity: string;
}

const ScoreCard = ({ label, score, severity }: ScoreCardProps) => {
  const percentage = Math.min(100, Math.round((score / 27) * 100));
  return (
    <div className="rounded-xl bg-muted/60 p-4 text-sm">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-medium">{label}</span>
        <Badge>{severity}</Badge>
      </div>
      <Progress value={percentage} />
      <p className="mt-1 text-[11px] text-muted-foreground">Score: {score}</p>
    </div>
  );
};

export default PatientReport;
