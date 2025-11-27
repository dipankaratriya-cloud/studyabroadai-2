export interface CollegeRecommendation {
  name: string;
  country: string;
  city: string;
  program: string;
  tuition_annual: string;
  living_cost_annual: string;
  total_cost_annual: string;
  duration: string;
  language: string;
  ranking: string;
  gre_required: string;
  ielts_minimum: string;
  toefl_minimum: string;
  application_deadline: string;
  intake_seasons: string;
  industry_connections: string;
  scholarships_available: string;
  why_good_fit: string;
  official_link: string;
}

export interface CollegeComparison {
  comparison_title: string;
  comparison_summary: string;
  colleges: CollegeRecommendation[];
  recommendation: string;
}

export function parseCollegeRecommendations(text: string): { colleges: CollegeRecommendation[]; cleanedText: string } {
  const colleges: CollegeRecommendation[] = [];
  
  // Find all <college_recommendation> blocks
  const regex = /<college_recommendation>([\s\S]*?)<\/college_recommendation>/g;
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const xmlBlock = match[1];
    const college: Partial<CollegeRecommendation> = {};
    
    // Extract each field
    const fields = [
      'name', 'country', 'city', 'program', 'tuition_annual', 'living_cost_annual',
      'total_cost_annual', 'duration', 'language', 'ranking', 'gre_required',
      'ielts_minimum', 'toefl_minimum', 'application_deadline', 'intake_seasons',
      'industry_connections', 'scholarships_available', 'why_good_fit', 'official_link'
    ];
    
    fields.forEach(field => {
      const fieldRegex = new RegExp(`<${field}>([\\s\\S]*?)<\\/${field}>`, 'i');
      const fieldMatch = xmlBlock.match(fieldRegex);
      if (fieldMatch) {
        college[field as keyof CollegeRecommendation] = fieldMatch[1].trim();
      }
    });
    
    if (college.name) {
      colleges.push(college as CollegeRecommendation);
    }
  }
  
  // Remove XML blocks from text for cleaner display
  const cleanedText = text.replace(regex, '').trim();
  
  return { colleges, cleanedText };
}

export function hasCollegeRecommendations(text: string): boolean {
  return /<college_recommendation>/.test(text);
}

export function hasCollegeComparison(text: string): boolean {
  return /<college_comparison>/.test(text);
}

export function parseCollegeComparison(text: string): { comparison: CollegeComparison | null; cleanedText: string } {
  const comparisonRegex = /<college_comparison>([\s\S]*?)<\/college_comparison>/;
  const match = text.match(comparisonRegex);

  if (!match) {
    return { comparison: null, cleanedText: text };
  }

  const comparisonBlock = match[1];

  // Extract comparison title
  const titleMatch = comparisonBlock.match(/<comparison_title>([\s\S]*?)<\/comparison_title>/);
  const comparison_title = titleMatch ? titleMatch[1].trim() : '';

  // Extract comparison summary
  const summaryMatch = comparisonBlock.match(/<comparison_summary>([\s\S]*?)<\/comparison_summary>/);
  const comparison_summary = summaryMatch ? summaryMatch[1].trim() : '';

  // Extract recommendation
  const recommendationMatch = comparisonBlock.match(/<recommendation>([\s\S]*?)<\/recommendation>/);
  const recommendation = recommendationMatch ? recommendationMatch[1].trim() : '';

  // Extract colleges from within the comparison block
  const { colleges } = parseCollegeRecommendations(comparisonBlock);

  // Remove the comparison block from text for cleaner display
  const cleanedText = text.replace(comparisonRegex, '').trim();

  return {
    comparison: {
      comparison_title,
      comparison_summary,
      colleges,
      recommendation
    },
    cleanedText
  };
}
