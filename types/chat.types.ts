export interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: string
}

export interface ChatSession {
  id: string
  user_id: string
  title: string | null
  created_at: string
  updated_at: string
  student_profile: StudentProfile | null
  messages: Message[]
  status: 'active' | 'archived'
}

export interface StudentProfile {
  education_level?: string
  current_grade?: string
  field_of_interest?: string
  budget_min?: number
  budget_max?: number
  budget_currency?: string
  preferred_countries?: string[]
  test_scores?: {
    ielts?: number
    toefl?: number
    sat?: number
    gre?: number
  }
  preferences?: {
    climate?: string
    city_size?: string
    language?: string
    work_opportunities?: boolean
  }
  goals?: {
    degree_type?: string
    research_focused?: boolean
    immigration_intent?: boolean
    scholarship_needed?: boolean
  }
  timeline?: string
  documents_ready?: string[]
}
