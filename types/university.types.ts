export interface University {
  id: string
  name: string
  country: string
  ranking: number | null
  programs: string[]
  tuition_fees: TuitionFees
  admission_requirements: AdmissionRequirements
  deadlines: Deadlines
  scholarships: string[]
  acceptance_rate: number | null
  location: Location
  source_url: string | null
  last_fetched: string
  created_at: string
}

export interface TuitionFees {
  currency: string
  undergraduate?: number
  graduate?: number
}

export interface AdmissionRequirements {
  undergraduate?: {
    gpa_min?: number
    sat_min?: number
    toefl_min?: number
    ielts_min?: number
    [key: string]: any
  }
  graduate?: {
    gpa_min?: number
    gre_quantitative_min?: number
    toefl_min?: number
    ielts_min?: number
    [key: string]: any
  }
}

export interface Deadlines {
  fall_undergrad?: string
  fall_graduate?: string
  spring_undergrad?: string
  spring_graduate?: string
  [key: string]: string | undefined
}

export interface Location {
  city: string
  state?: string
  region?: string
}
