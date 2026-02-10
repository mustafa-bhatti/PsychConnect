import { createContext, ReactNode, useContext, useState } from "react";

export type MindConnectRole = "patient" | "psychologist" | "admin";

export interface PatientProfile {
  age?: number;
  gender?: string;
  location?: string;
  language?: "Urdu" | "English";
  budgetRange?: string;
  availability?: string;
}

interface MindConnectContextValue {
  role: MindConnectRole;
  setRole: (role: MindConnectRole) => void;
  patientProfile: PatientProfile;
  updatePatientProfile: (profile: Partial<PatientProfile>) => void;
}

const MindConnectContext = createContext<MindConnectContextValue | undefined>(undefined);

export const MindConnectProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<MindConnectRole>("patient");
  const [patientProfile, setPatientProfile] = useState<PatientProfile>({});

  const updatePatientProfile = (patch: Partial<PatientProfile>) => {
    setPatientProfile((prev) => ({ ...prev, ...patch }));
  };

  return (
    <MindConnectContext.Provider value={{ role, setRole, patientProfile, updatePatientProfile }}>
      {children}
    </MindConnectContext.Provider>
  );
};

export const useMindConnect = () => {
  const ctx = useContext(MindConnectContext);
  if (!ctx) {
    throw new Error("useMindConnect must be used within MindConnectProvider");
  }
  return ctx;
};
