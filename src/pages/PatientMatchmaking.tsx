import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const recommended = [
  {
    id: 1,
    name: "Dr. Ayesha Khan",
    specialization: "Depression, young adults",
    language: "Urdu, English",
    matchScore: 92,
    fee: "PKR 2,800",
    tags: ["Language match", "Evening slots", "Female therapist"],
  },
  {
    id: 2,
    name: "Dr. Bilal Haider",
    specialization: "Anxiety, work stress",
    language: "Urdu, Punjabi, English",
    matchScore: 87,
    fee: "PKR 2,200",
    tags: ["Budget friendly", "Weekend slots"],
  },
  {
    id: 3,
    name: "Dr. Sana Mir",
    specialization: "Trauma-informed care",
    language: "Urdu, English",
    matchScore: 81,
    fee: "PKR 3,200",
    tags: ["Trauma", "Women&apos;s mental health"],
  },
];

const PatientMatchmaking = () => {
  const navigate = useNavigate();

  return (
    <AppShell
      title="Recommended psychologists"
      description="Based on your assessment, preferences, budget, and availability."
    >
      <div className="mb-4 rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">
        These matches prioritise language, gender preference, symptom focus, and budget. You can change
        your preferences anytime from your dashboard.
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {recommended.map((psych) => (
          <Card key={psych.id} className="flex flex-col justify-between shadow-subtle">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{psych.name}</CardTitle>
              <CardDescription>{psych.specialization}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span>Match score</span>
                <span className="font-medium">{psych.matchScore}%</span>
              </div>
              <Progress value={psych.matchScore} />
              <p className="text-xs text-muted-foreground">Languages: {psych.language}</p>
              <p className="text-xs font-medium text-foreground">Session fee: {psych.fee}</p>
              <div className="flex flex-wrap gap-1">
                {psych.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
              <details className="mt-1 text-[11px] text-muted-foreground">
                <summary className="cursor-pointer font-medium text-xs text-foreground">
                  Why this match?
                </summary>
                <p>
                  AI compared your assessment scores, language preference, availability, and budget with
                  this psychologist&apos;s profile and past session outcomes.
                </p>
              </details>
              <Button
                variant="hero"
                size="sm"
                className="mt-2 w-full"
                onClick={() => navigate("/patient/booking")}
              >
                Select &amp; view availability
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </AppShell>
  );
};

export default PatientMatchmaking;
