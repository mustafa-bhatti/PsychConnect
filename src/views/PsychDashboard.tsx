'use client';

import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const SESSIONS = [
  {
    id: 1,
    patient: "Ali R.",
    time: "7:00 pm",
    concern: "Moderate depression, somatic complaints",
    risk: "Moderate",
    status: "Upcoming",
  },
  {
    id: 2,
    patient: "Sara K.",
    time: "8:30 pm",
    concern: "Anxiety, work stress",
    risk: "Low",
    status: "Upcoming",
  },
  {
    id: 3,
    patient: "Usman T.",
    time: "6:15 pm",
    concern: "Panic episodes, sleep issues",
    risk: "High",
    status: "Completed",
  },
  {
    id: 4,
    patient: "Zara B.",
    time: "5:30 pm",
    concern: "Adjustment to relocation",
    risk: "Low",
    status: "Completed",
  },
];

const SESSIONS_TREND = [
  { label: "Mon", sessions: 3 },
  { label: "Tue", sessions: 4 },
  { label: "Wed", sessions: 2 },
  { label: "Thu", sessions: 5 },
  { label: "Fri", sessions: 3 },
  { label: "Sat", sessions: 1 },
  { label: "Sun", sessions: 0 },
];

const CASE_MIX = [
  { label: "Depression", value: 14 },
  { label: "Anxiety", value: 11 },
  { label: "Stress / burnout", value: 7 },
  { label: "Other", value: 4 },
];

const PsychDashboard = () => {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<"patient" | "time" | "risk">("time");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const filteredSessions = useMemo(() => {
    return SESSIONS.filter((row) => {
      const matchesStatus = statusFilter === "all" || row.status === statusFilter;
      const matchesRisk = riskFilter === "all" || row.risk === riskFilter;
      const matchesSearch = !search
        ? true
        : row.patient.toLowerCase().includes(search.toLowerCase()) ||
          row.concern.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesRisk && matchesSearch;
    }).sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "time") {
        return a.time.localeCompare(b.time) * dir;
      }
      if (sortKey === "patient") {
        return a.patient.localeCompare(b.patient) * dir;
      }
      return a.risk.localeCompare(b.risk) * dir;
    });
  }, [statusFilter, riskFilter, search, sortKey, sortDir]);

  const toggleSort = (key: "patient" | "time" | "risk") => {
    setSortKey((prevKey) => {
      if (prevKey === key) {
        setSortDir((prevDir) => (prevDir === "asc" ? "desc" : "asc"));
        return prevKey;
      }
      setSortDir("asc");
      return key;
    });
  };

  return (
    <AppShell
      title="Psychologist dashboard"
      description="Clean overview of sessions, risk signals, and AI summaries."
    >
      <div className="grid gap-6 md:grid-cols-[minmax(0,1.7fr)_minmax(0,1.1fr)]">
        <div className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today&apos;s sessions</CardTitle>
              <CardDescription>Sortable and filterable view of your schedule.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex min-w-[160px] flex-1 items-center gap-2">
                  <span className="text-muted-foreground">Search</span>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Name or concern"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Status</span>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 w-[120px] text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Upcoming">Upcoming</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-muted-foreground">Risk</span>
                  <Select value={riskFilter} onValueChange={setRiskFilter}>
                    <SelectTrigger className="h-8 w-[120px] text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                      <SelectItem value="Moderate">Moderate</SelectItem>
                      <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"
                        onClick={() => toggleSort("patient")}
                      >
                        Patient
                        <SortIndicator active={sortKey === "patient"} dir={sortDir} />
                      </button>
                    </TableHead>
                    <TableHead>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"
                        onClick={() => toggleSort("time")}
                      >
                        Time
                        <SortIndicator active={sortKey === "time"} dir={sortDir} />
                      </button>
                    </TableHead>
                    <TableHead>Presenting concerns</TableHead>
                    <TableHead>
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground"
                        onClick={() => toggleSort("risk")}
                      >
                        Risk
                        <SortIndicator active={sortKey === "risk"} dir={sortDir} />
                      </button>
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right text-xs text-muted-foreground">
                      AI pre-session report
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((row) => (
                    <TableRow key={row.id} className="text-xs">
                      <TableCell className="font-medium text-foreground">{row.patient}</TableCell>
                      <TableCell className="text-muted-foreground">{row.time}</TableCell>
                      <TableCell className="text-muted-foreground">{row.concern}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            row.risk === "High" ? "destructive" : row.risk === "Moderate" ? "secondary" : "outline"
                          }
                          className="text-[10px]"
                        >
                          {row.risk} risk
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={row.status === "Upcoming" ? "secondary" : "outline"}
                          className="text-[10px]"
                        >
                          {row.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="subtle"
                          className="h-7 px-2 text-[11px]"
                          onClick={() => router.push(`/psych/report/${row.id}`)}
                        >
                          View AI report
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableCaption className="text-[11px]">
                  AI highlights are visible in the detailed pre-session report inside each session.
                </TableCaption>
              </Table>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Availability management</CardTitle>
              <CardDescription>Keep your online clinic hours tidy and predictable.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p>Weekly template: Mon–Thu, 7:00–10:00 pm (online)</p>
              <p>Exceptions: Upcoming Eid week blocked; Saturday trial slots enabled.</p>
              <Button variant="subtle" size="sm" className="mt-2">
                Edit availability
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Clinical workload overview</CardTitle>
              <CardDescription>Weekly session volume and presenting concerns mix.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <MiniStat label="This week" value="14" detail="sessions" />
                <MiniStat label="High-risk flagged" value="3" detail="by AI triage" />
                <MiniStat label="Avg. session length" value="52" detail="minutes" />
              </div>

              <ChartContainer
                config={{
                  sessions: {
                    label: "Sessions",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="mt-2"
              >
                <LineChart data={SESSIONS_TREND} margin={{ left: 0, right: 0, top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} dy={6} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} dx={-4} width={24} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="sessions" stroke="var(--color-sessions)" strokeWidth={2} dot />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Case mix (last 30 days)</CardTitle>
              <CardDescription>High-level pattern of presenting concerns.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  cases: {
                    label: "Cases",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <BarChart data={CASE_MIX} margin={{ left: 0, right: 0, top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} dx={-4} width={28} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Bar dataKey="value" fill="var(--color-cases)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg">Session notes</CardTitle>
              <CardDescription>Structured, clinician-owned notes linked to AI reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-muted-foreground">
              <p className="text-[11px] font-medium text-foreground">Example: Ali R.  b7 Session 3</p>
              <textarea
                className="min-h-[120px] w-full rounded-lg border border-input bg-background px-3 py-2 text-xs"
                placeholder="Type formulation, interventions, risk assessment, and follow-up plan..."
              />
              <Button variant="hero" size="sm" className="mt-2 w-full">
                Save notes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

const SortIndicator = ({ active, dir }: { active: boolean; dir: "asc" | "desc" }) => (
  <span className="inline-flex flex-col text-[9px] leading-none text-muted-foreground/70">
    <span className={active && dir === "asc" ? "text-foreground" : undefined}>▲</span>
    <span className={active && dir === "desc" ? "text-foreground" : undefined}>▼</span>
  </span>
);

const MiniStat = ({ label, value, detail }: { label: string; value: string; detail: string }) => (
  <div className="rounded-xl border border-border/60 bg-muted/60 px-3 py-2 text-xs">
    <p className="text-[11px] text-muted-foreground">{label}</p>
    <p className="text-lg font-semibold text-foreground">{value}</p>
    <p className="text-[11px] text-muted-foreground">{detail}</p>
  </div>
);

export default PsychDashboard;
