'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface StudentProfile {
  education_level?: string;
  current_grade?: string;
  field_of_interest?: string;
  budget_min?: number;
  budget_max?: number;
  budget_currency?: string;
  preferred_countries?: string[];
  test_scores?: {
    ielts?: number;
    toefl?: number;
    sat?: number;
    gre?: number;
  };
  preferences?: {
    climate?: string;
    city_size?: string;
    language?: string;
    work_opportunities?: boolean;
  };
  goals?: {
    degree_type?: string;
    research_focused?: boolean;
    immigration_intent?: boolean;
    scholarship_needed?: boolean;
  };
  timeline?: string;
  documents_ready?: string[];
}

interface ProfileContextType {
  profile: StudentProfile | null;
  setProfile: (profile: StudentProfile | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  return (
    <ProfileContext.Provider value={{ profile, setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
