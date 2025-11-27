'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { GraduationCap, Calendar, Trash2, Eye, ArrowRight } from 'lucide-react';
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

export default function ComparisonsPage() {
  const [comparisons, setComparisons] = useState<SavedComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchComparisons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchComparisons = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    // Use the API route which transforms the data properly
    try {
      const response = await fetch('/api/comparisons');
      if (response.ok) {
        const { comparisons: data } = await response.json();
        setComparisons(data || []);
      }
    } catch (error) {
      console.error('Error fetching comparisons:', error);
    }
    setLoading(false);
  };

  const deleteComparison = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmed = window.confirm('Are you sure you want to delete this comparison?');
    if (!confirmed) return;

    await supabase.from('saved_comparisons').delete().eq('id', id);
    setComparisons(comparisons.filter(c => c.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Comparisons</h1>
        <p className="text-muted-foreground mt-1">
          View and manage your saved university comparisons
        </p>
      </div>

      {/* Comparisons Grid */}
      {comparisons.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {comparisons.map((comparison) => (
            <Link key={comparison.id} href={`/dashboard/comparisons/${comparison.id}`}>
              <Card className="h-full hover:shadow-lg transition-all hover:border-primary/50 cursor-pointer group">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <GraduationCap className="h-5 w-5 text-primary" />
                      </div>
                      <Badge variant="secondary">{comparison.colleges?.length || 0} colleges</Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      onClick={(e) => deleteComparison(comparison.id, e)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <CardTitle className="text-lg mt-3 line-clamp-2">
                    {comparison.comparison_title || 'Untitled Comparison'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* College Names */}
                  <div className="flex flex-wrap gap-1 mb-3">
                    {comparison.colleges?.slice(0, 3).map((college, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {college.name?.split(' ').slice(0, 2).join(' ')}
                      </Badge>
                    ))}
                  </div>

                  {/* Summary */}
                  {comparison.comparison_summary && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {comparison.comparison_summary}
                    </p>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {new Date(comparison.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-primary group-hover:underline">
                      <Eye className="h-3 w-3" />
                      View Details
                      <ArrowRight className="h-3 w-3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">No comparisons saved yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Start a chat with our AI advisor and compare universities.
              Your comparisons will be saved here for future reference.
            </p>
            <Link href="/dashboard/chats/new">
              <Button size="lg">
                Start Comparing Colleges
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
