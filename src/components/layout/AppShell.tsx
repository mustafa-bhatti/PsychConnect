import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { NavLink } from '@/components/NavLink';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useMindConnect } from '@/context/MindConnectContext';
import { LogOut } from 'lucide-react';

interface AppShellProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const AppShell = ({
  title,
  description,
  children,
  className,
}: AppShellProps) => {
  const { role, isAuthenticated, logout } = useMindConnect();
  const router = useRouter();

  const roleLabel =
    role === 'patient'
      ? 'Patient'
      : role === 'psychologist'
        ? 'Psychologist'
        : role === 'admin'
          ? 'Admin'
          : null;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  // Role-based navigation links
  const navLinks: { to: string; label: string }[] = [];
  if (role === 'patient') {
    navLinks.push(
      { to: '/patient/dashboard', label: 'Dashboard' },
      { to: '/patient/assessment', label: 'Assessment' },
      { to: '/patient/booking', label: 'Booking' },
      { to: '/patient/matchmaking', label: 'Find Therapist' },
    );
  } else if (role === 'psychologist') {
    navLinks.push({ to: '/psych/dashboard', label: 'Dashboard' });
  } else if (role === 'admin') {
    navLinks.push({ to: '/admin/dashboard', label: 'Dashboard' });
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
        <div className="container flex items-center justify-between py-3">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-[hsl(var(--mint))] via-[hsl(var(--soft-blue))] to-[hsl(var(--lavender))] shadow-soft" />
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold">PsychConnect</span>
              <span className="text-xs text-muted-foreground">
                AI Telepsychology
              </span>
            </div>
          </NavLink>
          {isAuthenticated && navLinks.length > 0 && (
            <nav className="hidden items-center gap-4 text-sm md:flex">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className="text-muted-foreground hover:text-foreground"
                  activeClassName="text-foreground font-medium"
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          )}
          <div className="flex items-center gap-3">
            {isAuthenticated && roleLabel && (
              <Badge variant="secondary" className="hidden sm:inline-flex">
                {roleLabel}
              </Badge>
            )}
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-sm text-muted-foreground hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            ) : (
              <NavLink
                to="/auth"
                className="text-sm text-primary hover:underline"
              >
                Login / Signup
              </NavLink>
            )}
          </div>
        </div>
      </header>

      <main className={cn('container pb-10 pt-4 md:pt-6', className)}>
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
