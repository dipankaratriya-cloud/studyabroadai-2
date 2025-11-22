export interface Comparison {
  id: string
  user_id: string
  session_id: string | null
  comparison_type: 'university' | 'country' | 'program'
  items: ComparisonItem[]
  chart_data: ChartData | null
  created_at: string
}

export interface ComparisonItem {
  id: string
  name: string
  type: string
  data: any
}

export interface ChartData {
  type: 'bar' | 'radar' | 'line'
  datasets: Dataset[]
  labels: string[]
}

export interface Dataset {
  label: string
  data: number[]
  backgroundColor?: string
  borderColor?: string
}
