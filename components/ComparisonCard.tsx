'use client';

import { X, MapPin, DollarSign, Clock, GraduationCap, Award, Globe, Calendar, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CollegeRecommendation } from '@/lib/xmlParser';

interface ComparisonCardProps {
  colleges: CollegeRecommendation[];
  onClose: () => void;
  onRemoveCollege: (collegeName: string) => void;
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

export function ComparisonCard({ colleges, onClose, onRemoveCollege }: ComparisonCardProps) {
  if (colleges.length === 0) return null;

  return (
    <Card className="w-full border-2 border-primary/20 bg-gradient-to-b from-primary/5 to-transparent">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            College Comparison ({colleges.length}/3)
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {/* College Headers */}
        <div className="grid gap-4 pb-4 border-b-2" style={{ gridTemplateColumns: `180px repeat(${colleges.length}, 1fr)` }}>
          <div></div>
          {colleges.map((college, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">{college.name}</h3>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {college.city}, {college.country}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  onClick={() => onRemoveCollege(college.name)}
                >
                  <X className="h-3 w-3" />
                </Button>
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
        <div className="mt-4">
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
        <div className="mt-4">
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
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Financial Aid</h4>
          <ComparisonRow
            label="Scholarships"
            icon={<DollarSign className="h-4 w-4" />}
            values={colleges.map(c => c.scholarships_available)}
          />
        </div>

        {/* Why Good Fit */}
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">Why It&apos;s a Good Fit</h4>
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${colleges.length}, 1fr)` }}>
            {colleges.map((college, idx) => (
              <div key={idx} className="bg-primary/5 p-3 rounded-lg text-sm">
                <p className="font-semibold mb-1">{college.name}</p>
                <p className="text-muted-foreground">{college.why_good_fit}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="mt-6 grid gap-2" style={{ gridTemplateColumns: `repeat(${colleges.length}, 1fr)` }}>
          {colleges.map((college, idx) => (
            <Button key={idx} asChild variant="outline" size="sm">
              <a href={college.official_link} target="_blank" rel="noopener noreferrer">
                Visit {college.name.split(' ')[0]} <ExternalLink className="ml-2 h-3 w-3" />
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
