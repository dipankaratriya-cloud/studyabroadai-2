'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft,
  Trash2,
  Share2,
  Download,
  MapPin,
  DollarSign,
  Clock,
  GraduationCap,
  Award,
  Globe,
  Calendar,
  ExternalLink,
  Lightbulb
} from 'lucide-react';
import type { CollegeRecommendation } from '@/lib/xmlParser';

interface SavedComparison {
  id: string;
  user_id: string;
  session_id: string;
  comparison_title: string;
  comparison_summary: string;
  colleges: CollegeRecommendation[];
  recommendation: string;
  created_at: string;
}

interface ComparisonRowProps {
  label: string;
  icon?: React.ReactNode;
  values: (string | undefined)[];
  highlight?: 'lowest' | 'highest' | 'none';
}

function ComparisonRow({ label, icon, values, highlight = 'none' }: ComparisonRowProps) {
  const parseNumber = (val: string | undefined): number => {
    if (!val) return Infinity;
    const num = parseFloat(val.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? Infinity : num;
  };

  const numbers = values.map(parseNumber);
  const minIdx = highlight === 'lowest' ? numbers.indexOf(Math.min(...numbers.filter(n => n !== Infinity))) : -1;
  const maxIdx = highlight === 'highest' ? numbers.indexOf(Math.max(...numbers.filter(n => n !== Infinity && n !== 0))) : -1;

  return (
    <div className="grid gap-4 py-3 border-b last:border-b-0" style={{ gridTemplateColumns: `180px repeat(${values.length}, 1fr)` }}>
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        {icon}
        {label}
      </div>
      {values.map((value, idx) => (
        <div
          key={idx}
          className={`text-sm ${
            (highlight === 'lowest' && idx === minIdx) || (highlight === 'highest' && idx === maxIdx)
              ? 'font-bold text-green-600 dark:text-green-400'
              : ''
          }`}
        >
          {value || 'N/A'}
        </div>
      ))}
    </div>
  );
}

export default function ComparisonDetailPage() {
  const [comparison, setComparison] = useState<SavedComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();
  const comparisonId = params.comparisonId as string;

  useEffect(() => {
    fetchComparison();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [comparisonId]);

  const fetchComparison = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const { data, error } = await supabase
      .from('saved_comparisons')
      .select('*')
      .eq('id', comparisonId)
      .eq('user_id', user.id)
      .single();

    if (error || !data) {
      router.push('/dashboard/comparisons');
      return;
    }

    // Transform data to match expected format (map schema columns to UI fields)
    const transformedData: SavedComparison = {
      ...data,
      colleges: data.items || [],
      comparison_title: data.chart_data?.comparison_title || 'College Comparison',
      comparison_summary: data.chart_data?.comparison_summary || '',
      recommendation: data.chart_data?.recommendation || '',
    };

    setComparison(transformedData);
    setLoading(false);
  };

  const deleteComparison = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this comparison?');
    if (!confirmed) return;

    await supabase.from('saved_comparisons').delete().eq('id', comparisonId);
    router.push('/dashboard/comparisons');
  };

  const shareComparison = () => {
    if (navigator.share) {
      navigator.share({
        title: comparison?.comparison_title || 'College Comparison',
        text: comparison?.comparison_summary || 'Check out this college comparison',
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const exportComparison = () => {
    if (!comparison) return;

    const data = JSON.stringify(comparison, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comparison-${comparisonId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!comparison) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Comparison not found</p>
      </div>
    );
  }

  const colleges = comparison.colleges || [];

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/comparisons">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Comparisons
            </Button>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={shareComparison}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={exportComparison}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="destructive" size="sm" onClick={deleteComparison}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Title Card */}
      <Card className="mb-6 border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <Badge variant="secondary">{colleges.length} colleges compared</Badge>
            <span className="text-sm text-muted-foreground">
              Created {new Date(comparison.created_at).toLocaleDateString()}
            </span>
          </div>
          <CardTitle className="text-2xl">{comparison.comparison_title || 'College Comparison'}</CardTitle>
          {comparison.comparison_summary && (
            <p className="text-muted-foreground mt-2">{comparison.comparison_summary}</p>
          )}
        </CardHeader>
      </Card>

      {/* Main Comparison Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          {/* College Headers */}
          <div className="grid gap-4 pb-4 border-b-2" style={{ gridTemplateColumns: `180px repeat(${colleges.length}, 1fr)` }}>
            <div></div>
            {colleges.map((college, idx) => (
              <div key={idx} className="space-y-2">
                <div>
                  <h3 className="font-bold text-lg">{college.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {college.city}, {college.country}
                  </p>
                </div>
                {college.ranking && (
                  <Badge variant="secondary" className="text-xs">
                    <Award className="h-3 w-3 mr-1" />
                    {college.ranking}
                  </Badge>
                )}
              </div>
            ))}
          </div>

          {/* Program Info */}
          <div className="mt-4">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Program Details</h4>
            <ComparisonRow
              label="Program"
              icon={<GraduationCap className="h-4 w-4" />}
              values={colleges.map(c => c.program)}
            />
            <ComparisonRow
              label="Duration"
              icon={<Clock className="h-4 w-4" />}
              values={colleges.map(c => c.duration)}
            />
            <ComparisonRow
              label="Language"
              icon={<Globe className="h-4 w-4" />}
              values={colleges.map(c => c.language)}
            />
            <ComparisonRow
              label="Intake"
              icon={<Calendar className="h-4 w-4" />}
              values={colleges.map(c => c.intake_seasons)}
            />
          </div>

          {/* Cost Info */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Costs (Annual)</h4>
            <ComparisonRow
              label="Tuition"
              icon={<DollarSign className="h-4 w-4" />}
              values={colleges.map(c => c.tuition_annual)}
              highlight="lowest"
            />
            <ComparisonRow
              label="Living Cost"
              icon={<DollarSign className="h-4 w-4" />}
              values={colleges.map(c => c.living_cost_annual)}
              highlight="lowest"
            />
            <ComparisonRow
              label="Total Cost"
              icon={<DollarSign className="h-4 w-4" />}
              values={colleges.map(c => c.total_cost_annual)}
              highlight="lowest"
            />
          </div>

          {/* Requirements */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Requirements</h4>
            <ComparisonRow
              label="GRE Required"
              values={colleges.map(c => c.gre_required)}
            />
            <ComparisonRow
              label="IELTS Min"
              values={colleges.map(c => c.ielts_minimum)}
              highlight="lowest"
            />
            <ComparisonRow
              label="TOEFL Min"
              values={colleges.map(c => c.toefl_minimum)}
              highlight="lowest"
            />
            <ComparisonRow
              label="Deadline"
              values={colleges.map(c => c.application_deadline)}
            />
          </div>

          {/* Scholarships */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Financial Aid</h4>
            <ComparisonRow
              label="Scholarships"
              icon={<DollarSign className="h-4 w-4" />}
              values={colleges.map(c => c.scholarships_available)}
            />
          </div>

          {/* Why Good Fit */}
          <div className="mt-6">
            <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Why It&apos;s a Good Fit</h4>
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${colleges.length}, 1fr)` }}>
              {colleges.map((college, idx) => (
                <div key={idx} className="bg-primary/5 p-4 rounded-lg">
                  <p className="font-semibold mb-2">{college.name}</p>
                  <p className="text-sm text-muted-foreground">{college.why_good_fit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 grid gap-2" style={{ gridTemplateColumns: `repeat(${colleges.length}, 1fr)` }}>
            {colleges.map((college, idx) => (
              <Button key={idx} asChild variant="outline">
                <a href={college.official_link} target="_blank" rel="noopener noreferrer">
                  Visit {college.name?.split(' ')[0]} <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendation */}
      {comparison.recommendation && (
        <Card className="border-2 border-yellow-500/30 bg-gradient-to-b from-yellow-500/10 to-transparent">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="h-5 w-5 text-yellow-500" />
              AI Recommendation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{comparison.recommendation}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
