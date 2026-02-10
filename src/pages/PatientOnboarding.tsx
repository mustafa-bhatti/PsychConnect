import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useMindConnect } from "@/context/MindConnectContext";

const PatientOnboarding = () => {
  const { updatePatientProfile } = useMindConnect();
  const navigate = useNavigate();
  const [consent, setConsent] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    updatePatientProfile({
      age: Number(formData.get("age") || 0),
      gender: String(formData.get("gender") || ""),
      location: String(formData.get("location") || ""),
      language: (formData.get("language") as "Urdu" | "English") || "English",
      budgetRange: String(formData.get("budget") || ""),
      availability: String(formData.get("availability") || ""),
    });
    navigate("/patient/assessment");
  };

  return (
    <AppShell
      title="Patient Onboarding"
      description="Tell us a little about yourself so we can match you with the right psychologist."
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-4xl gap-6 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]"
      >
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">Personal details</CardTitle>
            <CardDescription>These details are only shared with your psychologist.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" min={10} max={120} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input id="gender" name="gender" placeholder="Female / Male / Non-binary" required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="location">City / Region</Label>
              <Input id="location" name="location" placeholder="Karachi, Lahore, Islamabad…" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Preferred language</Label>
              <select
                id="language"
                name="language"
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                defaultValue="English"
              >
                <option value="Urdu">Urdu</option>
                <option value="English">English</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="budget">Budget per session (PKR)</Label>
              <Input id="budget" name="budget" placeholder="e.g. 1500–3000" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="availability">Preferred days & times</Label>
              <Input id="availability" name="availability" placeholder="e.g. Weekday evenings" />
            </div>
          </CardContent>
        </Card>

        <Card className="h-max shadow-subtle">
          <CardHeader>
            <CardTitle className="text-lg">Consent & preferences</CardTitle>
            <CardDescription>
              MindConnect uses AI to support your psychologist before and after sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Your answers to assessments, drawings, and voice recordings are analyzed to create a
              pre-session report. Only verified psychologists and admins can access this report.
            </p>
            <div className="flex items-start gap-2 rounded-lg bg-muted/60 p-3">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(checked) => setConsent(Boolean(checked))}
              />
              <label htmlFor="consent" className="cursor-pointer text-xs leading-relaxed">
                I consent to AI-assisted assessment for MindConnect, supervised by a licensed
                psychologist. I understand AI does not replace human clinical judgement.
              </label>
            </div>
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={!consent}
            >
              Continue to AI assessment
            </Button>
          </CardContent>
        </Card>
      </form>
    </AppShell>
  );
};

export default PatientOnboarding;
