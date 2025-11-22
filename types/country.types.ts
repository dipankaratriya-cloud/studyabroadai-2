export interface Country {
  id: string
  name: string
  visa_requirements: VisaRequirements | null
  cost_of_living: CostOfLiving | null
  post_study_work_rights: WorkRights | null
  language_requirements: LanguageRequirements | null
  popular_cities: string[]
  job_market_data: JobMarketData | null
  climate: string | null
  source_urls: string[]
  last_fetched: string
  created_at: string
}

export interface VisaRequirements {
  visa_type: string
  processing_time: string
  success_rate?: number
  documents_needed: string[]
  financial_proof_amount?: number
  [key: string]: any
}

export interface CostOfLiving {
  currency: string
  housing_min: number
  housing_max: number
  food_monthly: number
  transport_monthly: number
  total_monthly_estimate: number
}

export interface WorkRights {
  during_study_hours_per_week?: number
  post_study_duration?: string
  requirements?: string[]
}

export interface LanguageRequirements {
  primary_language: string
  english_proficiency_needed: boolean
  accepted_tests?: string[]
}

export interface JobMarketData {
  employment_rate?: number
  average_starting_salary?: number
  currency?: string
  top_industries?: string[]
}
