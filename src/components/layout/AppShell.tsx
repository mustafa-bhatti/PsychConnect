import { ReactNode } from "react";
import { NavLink } from "@/components/NavLink";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMindConnect } from "@/context/MindConnectContext";

interface AppShellProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const AppShell = ({ title, description, children, className }: AppShellProps) => {
  const { role } = useMindConnect();

  const roleLabel =
    role === "patient" ? "Patient" : role === "psychologist" ? "Psychologist" : "Admin";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="container flex items-center justify-between py-3">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[hsl(var(--mint))] via-[hsl(var(--soft-blue))] to-[hsl(var(--lavender))] shadow-soft" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">MindConnect</span>
              <span className="text-xs text-muted-foreground">AI Telepsychology</span>
            </div>
          </NavLink>
          <nav className="hidden items-center gap-4 text-sm md:flex">
            <NavLink
              to="/patient/dashboard"
              className="text-muted-foreground hover:text-foreground"
              activeClassName="text-foreground"
            >
              Patient
            </NavLink>
            <NavLink
              to="/psych/dashboard"
              className="text-muted-foreground hover:text-foreground"
              activeClassName="text-foreground"
            >
              Psychologist
            </NavLink>
            <NavLink
              to="/admin/dashboard"
              className="text-muted-foreground hover:text-foreground"
              activeClassName="text-foreground"
            >
              Admin
            </NavLink>
            <NavLink
              to="/system-flow"
              className="text-muted-foreground hover:text-foreground"
              activeClassName="text-foreground"
            >
              System Flow
            </NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Role: {roleLabel}
            </Badge>
            <NavLink to="/auth" className="text-sm text-primary hover:underline">
              Login / Signup
            </NavLink>
          </div>
        </div>
      </header>

      <main className={cn("container pb-10 pt-4 md:pt-6", className)}>
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 md:mb-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl lg:text-3xl">
              {title}
            </h1>
            {description && (
              <p className="mt-1 max-w-2xl text-xs text-muted-foreground md:text-sm lg:text-base">
                {description}
              </p>
            )}
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};
