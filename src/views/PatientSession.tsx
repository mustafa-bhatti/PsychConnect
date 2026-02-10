'use client';

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";


const PatientSession = () => {
  const router = useRouter();

  return (
    <AppShell
      title="Video consultation"
      description="End-to-end encrypted video between you and your psychologist."
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
        <Card className="aspect-video overflow-hidden rounded-2xl border bg-muted/80 shadow-soft">
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Secure video call placeholder
          </div>
        </Card>
        <Card className="shadow-subtle">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Session controls</CardTitle>
            <CardDescription>Only you and your psychologist can see or hear this call.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex gap-2">
              <Button variant="subtle" size="lg" className="flex-1">
                Toggle camera
              </Button>
              <Button variant="subtle" size="lg" className="flex-1">
                Mute / unmute
              </Button>
            </div>
            <Button variant="destructive" size="lg" className="w-full" onClick={() => router.push("/patient/dashboard")}>
              End session
            </Button>
            <p className="text-[11px]">
              After you end the session, you will see a short feedback form and your updated progress
              timeline.
            </p>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
};

export default PatientSession;
