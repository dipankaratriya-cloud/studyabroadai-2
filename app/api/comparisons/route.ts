import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { sessionId, colleges, comparisonTitle, comparisonSummary, recommendation } = await req.json();

    // Generate a title if not provided
    const title = comparisonTitle ||
      `Comparing ${colleges.map((c: any) => c.name?.split(' ')[0]).join(' vs ')}`;

    // Generate a summary if not provided
    const summary = comparisonSummary ||
      `Comparison of ${colleges.length} universities: ${colleges.map((c: any) => c.name).join(', ')}`;

    // Save comparison to database using the actual schema columns
    // items: array of college objects, chart_data: metadata (title, summary, recommendation)
    const { data: comparison, error } = await supabase
      .from('saved_comparisons')
      .insert({
        user_id: user.id,
        session_id: sessionId || null,
        comparison_type: 'university',
        items: colleges,
        chart_data: {
          comparison_title: title,
          comparison_summary: summary,
          recommendation: recommendation || null,
        },
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving comparison:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform the response to match expected format
    const transformedComparison = {
      ...comparison,
      colleges: comparison.items,
      comparison_title: comparison.chart_data?.comparison_title,
      comparison_summary: comparison.chart_data?.comparison_summary,
      recommendation: comparison.chart_data?.recommendation,
    };

    return NextResponse.json({ comparison: transformedComparison, success: true });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: comparisons, error } = await supabase
      .from('saved_comparisons')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform comparisons to match expected format
    const transformedComparisons = (comparisons || []).map((comp: any) => ({
      ...comp,
      colleges: comp.items,
      comparison_title: comp.chart_data?.comparison_title,
      comparison_summary: comp.chart_data?.comparison_summary,
      recommendation: comp.chart_data?.recommendation,
    }));

    return NextResponse.json({ comparisons: transformedComparisons });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
