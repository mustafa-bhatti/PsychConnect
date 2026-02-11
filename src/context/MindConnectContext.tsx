import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { createClient } from '@/lib/supabase/client';

export type MindConnectRole = 'patient' | 'psychologist' | 'admin';

export interface PatientProfile {
  age?: number;
  gender?: string;
  location?: string;
  language?: 'Urdu' | 'English';
  budgetRange?: string;
  availability?: string;
}

interface MindConnectContextValue {
  role: MindConnectRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setRole: (role: MindConnectRole | null) => void;
  patientProfile: PatientProfile;
  updatePatientProfile: (profile: Partial<PatientProfile>) => void;
  logout: () => Promise<void>;
}

const MindConnectContext = createContext<MindConnectContextValue | undefined>(
  undefined,
);

export const MindConnectProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<MindConnectRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({});

  // Sync role from Supabase session on mount
  useEffect(() => {
    const supabase = createClient();

    const syncUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const userRole = user.user_metadata?.role as
          | MindConnectRole
          | undefined;
        setRole(userRole ?? 'patient');
      } else {
        setRole(null);
      }
      setIsLoading(false);
    };

    syncUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const userRole = session.user.user_metadata?.role as
          | MindConnectRole
          | undefined;
        setRole(userRole ?? 'patient');
      } else {
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const updatePatientProfile = (patch: Partial<PatientProfile>) => {
    setPatientProfile((prev) => ({ ...prev, ...patch }));
  };

  const logout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setRole(null);
    setPatientProfile({});
  }, []);

  return (
    <MindConnectContext.Provider
      value={{
        role,
        isAuthenticated: role !== null,
        isLoading,
        setRole,
        patientProfile,
        updatePatientProfile,
        logout,
      }}
    >
      {children}
    </MindConnectContext.Provider>
  );
};

export const useMindConnect = () => {
  const ctx = useContext(MindConnectContext);
  if (!ctx) {
    throw new Error('useMindConnect must be used within MindConnectProvider');
  }
  return ctx;
};
