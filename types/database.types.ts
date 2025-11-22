export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          id: string
          user_id: string
          title: string | null
          created_at: string
          updated_at: string
          student_profile: Json | null
          messages: Json[] | null
          status: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          created_at?: string
          updated_at?: string
          student_profile?: Json | null
          messages?: Json[] | null
          status?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          created_at?: string
          updated_at?: string
          student_profile?: Json | null
          messages?: Json[] | null
          status?: string
        }
      }
      universities_cache: {
        Row: {
          id: string
          name: string
          country: string
          ranking: number | null
          programs: Json[] | null
          tuition_fees: Json | null
          admission_requirements: Json | null
          deadlines: Json | null
          scholarships: Json[] | null
          acceptance_rate: number | null
          location: Json | null
          source_url: string | null
          last_fetched: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          country: string
          ranking?: number | null
          programs?: Json[] | null
          tuition_fees?: Json | null
          admission_requirements?: Json | null
          deadlines?: Json | null
          scholarships?: Json[] | null
          acceptance_rate?: number | null
          location?: Json | null
          source_url?: string | null
          last_fetched?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          country?: string
          ranking?: number | null
          programs?: Json[] | null
          tuition_fees?: Json | null
          admission_requirements?: Json | null
          deadlines?: Json | null
          scholarships?: Json[] | null
          acceptance_rate?: number | null
          location?: Json | null
          source_url?: string | null
          last_fetched?: string
          created_at?: string
        }
      }
      countries_cache: {
        Row: {
          id: string
          name: string
          visa_requirements: Json | null
          cost_of_living: Json | null
          post_study_work_rights: Json | null
          language_requirements: Json | null
          popular_cities: Json[] | null
          job_market_data: Json | null
          climate: string | null
          source_urls: string[] | null
          last_fetched: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          visa_requirements?: Json | null
          cost_of_living?: Json | null
          post_study_work_rights?: Json | null
          language_requirements?: Json | null
          popular_cities?: Json[] | null
          job_market_data?: Json | null
          climate?: string | null
          source_urls?: string[] | null
          last_fetched?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          visa_requirements?: Json | null
          cost_of_living?: Json | null
          post_study_work_rights?: Json | null
          language_requirements?: Json | null
          popular_cities?: Json[] | null
          job_market_data?: Json | null
          climate?: string | null
          source_urls?: string[] | null
          last_fetched?: string
          created_at?: string
        }
      }
      saved_comparisons: {
        Row: {
          id: string
          user_id: string
          session_id: string | null
          comparison_type: string | null
          items: Json[] | null
          chart_data: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          session_id?: string | null
          comparison_type?: string | null
          items?: Json[] | null
          chart_data?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          session_id?: string | null
          comparison_type?: string | null
          items?: Json[] | null
          chart_data?: Json | null
          created_at?: string
        }
      }
    }
  }
}
