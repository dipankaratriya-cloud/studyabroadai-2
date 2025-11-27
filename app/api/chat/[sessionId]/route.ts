import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: session } = await supabase.from('chat_sessions').select('*').eq('id', sessionId).eq('user_id', user.id).single();
  return Response.json({ session });
}
