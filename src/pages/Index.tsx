import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useMindConnect } from "@/context/MindConnectContext";

const Index = () => {
  const { setRole } = useMindConnect();
  const navigate = useNavigate();

  useEffect(() => {
    setRole("patient");
  }, [setRole]);

  return (
    <AppShell
      title="Accessible Mental Healthcare for Everyone in Pakistan"
      description="A warm, stigma-free space connecting you to licensed psychologists across Pakistan."
    >
      <section className="relative grid items-center gap-8 md:gap-10 md:grid-cols-[minmax(0,1.9fr)_minmax(0,1.3fr)] overflow-hidden">
        {/* Soft hero background illustration */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -right-20 bottom-[-4rem] h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
        </div>
        {/* LEFT: EMOTIONAL HERO */}
        <div className="space-y-6 md:space-y-8 lg:space-y-10 animate-fade-in">
          <div className="space-y-6">
            <Badge variant="secondary" className="rounded-full px-4 py-1 text-[11px] flex items-center gap-2">
              <span className="inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              <span>Urdu &amp; English</span>
              <span className="opacity-50">•</span>
              <span>Secure video</span>
              <span className="opacity-50">•</span>
              <span>Made for Pakistan</span>
            </Badge>

            <div className="space-y-3 md:space-y-4">
              <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl lg:text-5xl">
                A calm place to say,
                <span className="block text-primary">“I&apos;m not okay” and still feel safe.</span>
              </h1>

              <p className="max-w-xl text-xs text-muted-foreground sm:text-sm md:text-base">
                MindConnect is a soft, stigma-free space that gently guides you from heavy feelings to a
                psychologist who understands your language, culture, and everyday life in Pakistan.
              </p>
            </div>

            {/* PRIMARY ACTIONS */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant="hero"
                size="lg"
                className="hover-scale"
                onClick={() => {
                  setRole("patient");
                  navigate("/patient/onboarding");
                }}
             >
                Start with a few quiet questions
              </Button>
              <Button
                variant="subtle"
                size="lg"
                className="hover-scale"
                onClick={() => {
                  setRole("patient");
                  navigate("/patient/matchmaking");
                }}
              >
                See psychologists who feel like a fit
              </Button>
            </div>
          </div>

          {/* THREE CORE FEELINGS */}
          <div className="grid gap-3 md:gap-4 md:grid-cols-3">
            <EmotionChip
              icon={ShieldCheck}
              title="This is safe"
              body="Private, encrypted, and built so you stay in control of what you share."
              delayClass="delay-0"
            />
            <EmotionChip
              icon={HeartHandshake}
              title="This is friendly"
              body="Soft colours, everyday words, and no scary clinical labels on the screen."
              delayClass="delay-100"
            />
            <EmotionChip
              icon={Sparkles}
              title="This understands me"
              body="Made for how people in Pakistan actually talk about stress, family, and feeling low."
              delayClass="delay-200"
            />
          </div>

          {/* GENTLE PREVIEW OF THE JOURNEY */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-subtle hover-scale transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">It starts quietly</CardTitle>
                <CardDescription className="text-xs">
                  Tap through a few short, gentle check-ins — pause anytime you need.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <Progress value={35} />
                <p>Most people finish in under 10 minutes, with breaks whenever things feel heavy.</p>
              </CardContent>
            </Card>

            <Card className="shadow-subtle hover-scale transition-colors">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Then meet your person</CardTitle>
                <CardDescription className="text-xs">
                  We suggest psychologists who match your language, budget, and comfort level.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <Progress value={80} />
                <p>You stay in charge — you always choose who to talk to and when.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* RIGHT: WARM GUIDED SNAPSHOT */}
        <div className="relative max-md:order-first">
          {/* Soft gradient aura */}
          <div className="pointer-events-none absolute inset-0 rounded-3xl bg-mindconnect-hero opacity-80" />

          <Card className="relative h-full overflow-hidden border-none bg-card/80 shadow-soft backdrop-blur animate-fade-in">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="flex items-center justify-between text-base">
                <span>What your first visit feels like</span>
                <Badge className="text-[10px]">Soft preview</Badge>
              </CardTitle>
              <CardDescription className="text-xs">
                A gentle, step-by-step path from “Maybe I need help” to a first conversation that feels safe.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <JourneyRow
                step="1"
                label="Answer a few simple questions"
                detail="No medical jargon — just how your days, sleep, and energy have really been."
                delayClass="delay-0"
              />
              <JourneyRow
                step="2"
                label="See a small list of psychologists"
                detail="Clear reasons for each match: language, fee range, and what they&apos;re experienced with."
                delayClass="delay-75"
              />
              <JourneyRow
                step="3"
                label="Pick a time that feels doable"
                detail="Evenings, weekends, and after-work slots if weekdays already feel too full."
                delayClass="delay-150"
              />
              <JourneyRow
                step="4"
                label="Join a secure video call"
                detail="One tap from your phone or laptop, with your name and story kept private."
                delayClass="delay-200"
              />
              <JourneyRow
                step="5"
                label="Come back to your progress"
                detail="Watch how your moods and sessions change over time in calm, simple visuals."
                delayClass="delay-300"
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </AppShell>
  );
};

interface EmotionChipProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  body: string;
  delayClass?: string;
}

const EmotionChip = ({ icon: Icon, title, body, delayClass }: EmotionChipProps) => (
  <article className={`space-y-2 rounded-2xl border border-border/70 bg-muted/70 px-4 py-3 text-xs hover-scale animate-fade-in ${delayClass ?? ""}`}>
    <header className="flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <p className="font-medium text-foreground">{title}</p>
    </header>
    <p className="text-[11px] text-muted-foreground">{body}</p>
  </article>
);

interface JourneyRowProps {
  step: string;
  label: string;
  detail: string;
  delayClass?: string;
}

const JourneyRow = ({ step, label, detail, delayClass }: JourneyRowProps) => (
  <div className={`flex items-start gap-3 rounded-2xl bg-background/70 p-3 shadow-subtle animate-fade-in ${delayClass ?? ""}`}>
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
      {step}
    </div>
    <div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{detail}</p>
    </div>
  </div>
);

export default Index;
