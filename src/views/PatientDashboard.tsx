'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { AppShell } from '@/components/layout/AppShell';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const PatientDashboard = () => {
  const router = useRouter();

  const { data: profileStats, isLoading } = useQuery({
    queryKey: ['patientProfileStats'],
    queryFn: async () => {
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error('Not authenticated');

      const { data: patient, error: patientError } = await supabase
        .from('patients')
        .select('preferences')
        .eq('user_id', authData.user.id)
        .single();

      if (patientError && patientError.code !== 'PGRST116') throw patientError;

      const { count, error: countError } = await supabase
        .from('assessments')
        .select('*', { count: 'exact', head: true })
        .eq('patient_id', authData.user.id);

      if (countError) console.error(countError);

      return {
        preferences: patient?.preferences as Record<string, string> | null,
        assessmentCount: count || 0,
      };
    },
  });

  return (
    <AppShell
      title="Patient dashboard"
      description="See your upcoming sessions, past history, and AI-assisted progress over time."
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <Card className="shadow-soft bg-primary/5 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-base">Monthly Assessment</CardTitle>
                <CardDescription>
                  It's time for your monthly mental health check-in.
                </CardDescription>
              </div>
              <Button
                onClick={() => router.push('/patient/assessment')}
                variant="hero"
                size="sm"
              >
                Start Now
              </Button>
            </CardHeader>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle className="text-lg">Upcoming session</CardTitle>
                <CardDescription>
                  Today, 7:00 pm with Dr. Ayesha Khan
                </CardDescription>
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
              <CardDescription>
                How your scores and sessions change over time.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <TimelineItem
                label="Session 3 completed"
                detail="Stress score decreased from 22  18"
              />
              <TimelineItem
                label="Session 2 completed"
                detail="Introduced breathing exercises for sleep."
              />
              <TimelineItem
                label="Initial AI assessment"
                detail="Moderate depression, mild anxiety"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg">Reports & downloads</CardTitle>
              <CardDescription>
                Ask your psychologist if you need a formal report.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <Button
                variant="subtle"
                size="sm"
                className="w-full justify-between"
              >
                Download session summaries (zip)
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg">Profile & settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              {isLoading ? (
                <>
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-2/5" />
                </>
              ) : (
                <>
                  <p>
                    Language:{' '}
                    {profileStats?.preferences?.language_preference ||
                      'Not specified'}
                  </p>
                  <p>
                    Preferred slots:{' '}
                    {profileStats?.preferences?.availability_preference ||
                      'Flexible'}
                  </p>
                  <p>
                    Therapy style:{' '}
                    {profileStats?.preferences?.therapy_style ||
                      'Not specified'}
                  </p>
                  <p>
                    Assessments completed: {profileStats?.assessmentCount || 0}
                  </p>
                </>
              )}
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
