'use client';

import { useState } from 'react';
import { ExternalLink, MapPin, Calendar, DollarSign, Clock, GraduationCap, Award, Globe, CheckCircle, GitCompare, Check, Bookmark, BookmarkCheck, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { CollegeRecommendation } from '@/lib/xmlParser';

interface CollegeCardProps {
  college: CollegeRecommendation;
  onCompare?: (college: CollegeRecommendation) => void;
  onSave?: (college: CollegeRecommendation) => void;
  isSelected?: boolean;
  isSaved?: boolean;
  compareDisabled?: boolean;
  defaultExpanded?: boolean;
}

export function CollegeCard({ college, onCompare, onSave, isSelected, isSaved, compareDisabled, defaultExpanded = false }: CollegeCardProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="card-elevated overflow-hidden group hover:border-primary/20 transition-all duration-300">
      {/* Compact Header - Always Visible */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          {/* University Icon */}
          <div className="icon-box icon-box-md gradient-primary flex-shrink-0">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>

          {/* Main Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-base truncate group-hover:text-primary transition-colors">
                  {college.name}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" />
                  {college.city}, {college.country}
                </p>
              </div>
              {college.ranking && (
                <div className="badge-primary text-xs flex-shrink-0">
                  <Award className="h-3 w-3" />
                  {college.ranking}
                </div>
              )}
            </div>

            {/* Compact Info Row */}
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span className="truncate font-medium text-foreground">{college.program}</span>
              <span className="flex items-center gap-1 flex-shrink-0">
                <DollarSign className="h-3 w-3" />
                <span className="font-semibold text-primary">{college.total_cost_annual}</span>
              </span>
            </div>
          </div>

          {/* Expand Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-lg hover:bg-muted transition-colors flex-shrink-0"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </div>

        {/* Quick Action Buttons - Always Visible */}
        <div className="flex gap-2 mt-3">
          {onSave && (
            <Button
              variant={isSaved ? "secondary" : "outline"}
              size="sm"
              className={`h-8 px-3 rounded-lg text-xs transition-all ${
                isSaved
                  ? 'bg-amber-100 border-amber-300 text-amber-600 hover:bg-amber-200 dark:bg-amber-950 dark:border-amber-700 dark:text-amber-400'
                  : 'hover:border-amber-300 hover:text-amber-600'
              }`}
              onClick={() => onSave(college)}
            >
              {isSaved ? (
                <BookmarkCheck className="h-3.5 w-3.5 mr-1" />
              ) : (
                <Bookmark className="h-3.5 w-3.5 mr-1" />
              )}
              {isSaved ? 'Saved' : 'Save'}
            </Button>
          )}
          {onCompare && (
            <Button
              variant={isSelected ? "secondary" : "outline"}
              size="sm"
              className={`h-8 px-3 rounded-lg text-xs transition-all ${
                isSelected
                  ? 'bg-primary/10 border-primary text-primary hover:bg-primary/20'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onCompare(college)}
              disabled={compareDisabled && !isSelected}
            >
              {isSelected ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1" />
                  Comparing
                </>
              ) : (
                <>
                  <GitCompare className="h-3.5 w-3.5 mr-1" />
                  Compare
                </>
              )}
            </Button>
          )}
          <Button asChild size="sm" className="h-8 px-3 rounded-lg text-xs btn-primary ml-auto">
            <a href={college.official_link} target="_blank" rel="noopener noreferrer">
              Visit
              <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </a>
          </Button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t animate-fade-in">
          {/* Program Info */}
          <div className="p-4 bg-muted/30">
            <h4 className="font-semibold text-sm mb-2">{college.program}</h4>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                {college.duration}
              </span>
              <span className="flex items-center gap-1">
                <Globe className="h-3.5 w-3.5" />
                {college.language}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {college.intake_seasons}
              </span>
            </div>
          </div>

          {/* Cost Section */}
          <div className="p-4">
            <div className="bg-gradient-to-br from-primary/5 to-primary/5 border border-primary/10 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-medium text-primary mb-3">
                <DollarSign className="h-3.5 w-3.5" />
                Annual Cost Breakdown
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tuition Fee</span>
                  <span className="font-medium">{college.tuition_annual}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Living Costs</span>
                  <span className="font-medium text-muted-foreground">{college.living_cost_annual}</span>
                </div>
                <div className="h-px bg-border my-1" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Annual</span>
                  <span className="text-lg font-bold text-primary">{college.total_cost_annual}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          <div className="px-4 pb-4">
            <h5 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5 text-primary" />
              Entry Requirements
            </h5>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-xs">
                <span className="text-muted-foreground">GRE</span>
                <span className={`font-medium ${college.gre_required === 'No' || college.gre_required === 'Optional' ? 'text-emerald-600' : ''}`}>
                  {college.gre_required}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-xs">
                <span className="text-muted-foreground">IELTS</span>
                <span className="font-medium">{college.ielts_minimum}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-xs">
                <span className="text-muted-foreground">TOEFL</span>
                <span className="font-medium">{college.toefl_minimum}</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-muted/50 rounded-lg text-xs">
                <span className="text-muted-foreground">Deadline</span>
                <span className="font-medium">{college.application_deadline}</span>
              </div>
            </div>
          </div>

          {/* Scholarships */}
          {college.scholarships_available && college.scholarships_available !== 'No' && (
            <div className="px-4 pb-4">
              <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 p-3 rounded-xl">
                <div className="flex items-start gap-2">
                  <Sparkles className="h-4 w-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-xs text-emerald-700 dark:text-emerald-400">Scholarships Available</p>
                    <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80 mt-0.5">{college.scholarships_available}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Industry Connections */}
          {college.industry_connections && (
            <div className="px-4 pb-4">
              <h5 className="text-xs font-semibold mb-1">Industry Connections</h5>
              <p className="text-xs text-muted-foreground">{college.industry_connections}</p>
            </div>
          )}

          {/* Why Good Fit */}
          <div className="px-4 pb-4">
            <div className="bg-gradient-to-br from-primary/5 to-primary/5 border border-primary/10 p-3 rounded-xl">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-xs mb-0.5">Why This Is A Great Fit</p>
                  <p className="text-xs text-muted-foreground">{college.why_good_fit}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
