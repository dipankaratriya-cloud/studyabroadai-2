'use client';

import { ExternalLink, MapPin, Calendar, DollarSign, Clock, GraduationCap, Award, Globe, CheckCircle, GitCompare, Check, Bookmark, BookmarkCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import type { CollegeRecommendation } from '@/lib/xmlParser';

interface CollegeCardProps {
  college: CollegeRecommendation;
  onCompare?: (college: CollegeRecommendation) => void;
  onSave?: (college: CollegeRecommendation) => void;
  isSelected?: boolean;
  isSaved?: boolean;
  compareDisabled?: boolean;
}

export function CollegeCard({ college, onCompare, onSave, isSelected, isSaved, compareDisabled }: CollegeCardProps) {
  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl mb-2 flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              {college.name}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              {college.city}, {college.country}
            </CardDescription>
          </div>
          {college.ranking && (
            <Badge variant="secondary" className="ml-2">
              <Award className="h-3 w-3 mr-1" />
              {college.ranking}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Program */}
        <div>
          <h4 className="font-semibold text-lg mb-1">{college.program}</h4>
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {college.duration}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {college.language}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {college.intake_seasons}
            </span>
          </div>
        </div>

        <Separator />

        {/* Cost Information */}
        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Annual Tuition:</span>
            <span className="font-bold text-primary">{college.tuition_annual}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Living Costs:</span>
            <span>{college.living_cost_annual}</span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="font-semibold">Total Annual Cost:</span>
            <span className="font-bold text-lg">{college.total_cost_annual}</span>
          </div>
        </div>

        {/* Requirements */}
        <div>
          <h5 className="font-semibold mb-2">Requirements</h5>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-muted-foreground">GRE:</span>{' '}
              <Badge variant={college.gre_required === 'No' || college.gre_required === 'Optional' ? 'secondary' : 'outline'}>
                {college.gre_required}
              </Badge>
            </div>
            <div>
              <span className="text-muted-foreground">IELTS:</span>{' '}
              <span className="font-medium">{college.ielts_minimum}</span>
            </div>
            <div>
              <span className="text-muted-foreground">TOEFL:</span>{' '}
              <span className="font-medium">{college.toefl_minimum}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Deadline:</span>{' '}
              <span className="font-medium">{college.application_deadline}</span>
            </div>
          </div>
        </div>

        {/* Scholarships */}
        {college.scholarships_available && college.scholarships_available !== 'No' && (
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-green-900 dark:text-green-100">Scholarships Available</p>
                <p className="text-sm text-green-700 dark:text-green-300">{college.scholarships_available}</p>
              </div>
            </div>
          </div>
        )}

        {/* Industry Connections */}
        {college.industry_connections && (
          <div>
            <h5 className="font-semibold mb-2 text-sm">Industry Connections</h5>
            <p className="text-sm text-muted-foreground">{college.industry_connections}</p>
          </div>
        )}

        {/* Why Good Fit */}
        <div className="bg-primary/5 border border-primary/20 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm mb-1">Why This Is A Great Fit</p>
              <p className="text-sm">{college.why_good_fit}</p>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-2">
        {onSave && (
          <Button
            variant={isSaved ? "secondary" : "outline"}
            size="icon"
            className={`flex-shrink-0 ${isSaved ? 'bg-amber-100 border-amber-400 text-amber-600 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-400' : ''}`}
            onClick={() => onSave(college)}
          >
            {isSaved ? (
              <BookmarkCheck className="h-4 w-4" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
        )}
        {onCompare && (
          <Button
            variant={isSelected ? "secondary" : "outline"}
            className={`flex-1 ${isSelected ? 'bg-primary/10 border-primary' : ''}`}
            onClick={() => onCompare(college)}
            disabled={compareDisabled && !isSelected}
          >
            {isSelected ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Selected
              </>
            ) : (
              <>
                <GitCompare className="mr-2 h-4 w-4" />
                Compare
              </>
            )}
          </Button>
        )}
        <Button asChild className="flex-1" variant="default">
          <a href={college.official_link} target="_blank" rel="noopener noreferrer">
            Visit Page <ExternalLink className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
}
