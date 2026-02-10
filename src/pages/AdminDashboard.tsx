import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
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

const USERS = [
  { id: 1, name: "Ali R.", role: "Patient", status: "Active", sessions: 5, created: "2024-10-12" },
  { id: 2, name: "Dr. Ayesha Khan", role: "Psychologist", status: "Verified", sessions: 142, created: "2024-02-03" },
  { id: 3, name: "Sara K.", role: "Patient", status: "Active", sessions: 2, created: "2024-11-01" },
  { id: 4, name: "Dr. Bilal Haider", role: "Psychologist", status: "Pending docs", sessions: 18, created: "2024-05-17" },
  { id: 5, name: "Admin", role: "Admin", status: "Active", sessions: 0, created: "2024-01-10" },
];

const SESSIONS_ANALYTICS = [
  { label: "Week 1", sessions: 82, aiReports: 65 },
  { label: "Week 2", sessions: 96, aiReports: 78 },
  { label: "Week 3", sessions: 104, aiReports: 86 },
  { label: "Week 4", sessions: 91, aiReports: 72 },
];

const COMPLIANCE_STATS = [
  { label: "PDPA checks", value: 98 },
  { label: "Encryption coverage", value: 100 },
  { label: "Access log completeness", value: 92 },
];

const AdminDashboard = () => {
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");

  const filteredUsers = useMemo(() => {
    return USERS.filter((user) => {
      const matchesRole = roleFilter === "all" || user.role === roleFilter;
      const matchesStatus = statusFilter === "all" || user.status === statusFilter;
      const matchesSearch = !search
        ? true
        : user.name.toLowerCase().includes(search.toLowerCase()) ||
          user.role.toLowerCase().includes(search.toLowerCase());
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [roleFilter, statusFilter, search]);

  return (
    <AppShell
      title="Admin console"
      description="Operational view across users, sessions, AI usage, and compliance."
    >
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1.2fr)]">
        <div className="space-y-4">
          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Platform analytics</CardTitle>
              <CardDescription>Sessions and AI-assisted reports across the last month.</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  sessions: {
                    label: "Sessions",
                    color: "hsl(var(--primary))",
                  },
                  aiReports: {
                    label: "AI reports",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <LineChart data={SESSIONS_ANALYTICS} margin={{ left: 0, right: 0, top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis allowDecimals={false} tickLine={false} axisLine={false} dx={-4} width={34} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Line type="monotone" dataKey="sessions" stroke="var(--color-sessions)" strokeWidth={2} dot />
                  <Line type="monotone" dataKey="aiReports" stroke="var(--color-aiReports)" strokeWidth={2} dot />
                </LineChart>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">User management</CardTitle>
              <CardDescription>Search, filter, and audit platform accounts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3 text-xs">
                <div className="flex flex-1 min-w-[160px] items-center gap-2">
                  <span className="text-muted-foreground">Search</span>
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Name or role"
                    className="h-8 text-xs"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Role</span>
                  <Select value={roleFilter} onValueChange={setRoleFilter}>
                    <SelectTrigger className="h-8 w-[130px] text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Patient">Patient</SelectItem>
                      <SelectItem value="Psychologist">Psychologist</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Status</span>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-8 w-[140px] text-xs">
                      <SelectValue placeholder="All" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Verified">Verified</SelectItem>
                      <SelectItem value="Pending docs">Pending docs</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Sessions</TableHead>
                    <TableHead>Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id} className="text-xs">
                      <TableCell className="font-medium text-foreground">{user.name}</TableCell>
                      <TableCell className="text-muted-foreground">{user.role}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "Active"
                              ? "secondary"
                              : user.status === "Verified"
                                ? "outline"
                                : "destructive"
                          }
                          className="text-[10px]"
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right tabular-nums text-muted-foreground">{user.sessions}</TableCell>
                      <TableCell className="text-muted-foreground">{user.created}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="shadow-subtle">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Compliance indicators</CardTitle>
              <CardDescription>High-level PDPA 2023 and security posture.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-xs text-muted-foreground">
              <ChartContainer
                config={{
                  compliance: {
                    label: "Compliance score",
                    color: "hsl(var(--chart-3))",
                  },
                }}
              >
                <BarChart data={COMPLIANCE_STATS} margin={{ left: 0, right: 0, top: 8 }}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
                  <YAxis tickLine={false} axisLine={false} dx={-4} width={34} domain={[0, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value" fill="var(--color-compliance)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ChartContainer>

              <div className="space-y-2 text-[11px]">
                <p>
                  <span className="font-medium text-foreground">PDPA 2023 data residency</span>  b7 Logs confirm all
                  production data remains within approved regions.
                </p>
                <p>
                  <span className="font-medium text-foreground">Encryption at rest</span>  b7 Storage buckets and
                  database volumes fully encrypted.
                </p>
                <p>
                  <span className="font-medium text-foreground">AI report access logs</span>  b7 Review needed on 1
                  integration sending summaries to email.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-subtle">
            <CardHeader>
              <CardTitle className="text-lg">Psychologist verification</CardTitle>
              <CardDescription>Track licensing and identity checks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-muted-foreground">
              <VerificationRow name="Dr. Ayesha Khan" doc="PMC license" status="Verified" />
              <VerificationRow name="Dr. Bilal Haider" doc="PMC license, CNIC" status="Pending review" />
              <VerificationRow name="Dr. Sana Mir" doc="Pending document upload" status="Awaiting upload" />
            </CardContent>
          </Card>
        </div>
      </div>
    </AppShell>
  );
};

const VerificationRow = ({
  name,
  doc,
  status,
}: {
  name: string;
  doc: string;
  status: string;
}) => (
  <div className="flex items-center justify-between rounded-lg bg-muted/70 p-3">
    <div>
      <p className="text-xs font-medium text-foreground">{name}</p>
      <p className="text-[11px] text-muted-foreground">Documents: {doc}</p>
    </div>
    <Badge variant="secondary" className="text-[10px]">
      {status}
    </Badge>
  </div>
);

export default AdminDashboard;
