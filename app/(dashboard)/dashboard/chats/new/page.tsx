'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function NewChatPage() {
  const router = useRouter();
  const hasCreated = useRef(false);

  useEffect(() => {
    async function createSession() {
      if (hasCreated.current) return;
      hasCreated.current = true;

      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          router.push('/login');
          return;
        }

        const { data: session, error } = await supabase
          .from('chat_sessions')
          .insert({
            user_id: user.id,
            title: 'New Conversation',
            messages: [],
          })
          .select()
          .single();

        if (error) throw error;

        router.push(`/dashboard/chats/${session.id}`);
      } catch (error) {
        console.error('Error creating session:', error);
        hasCreated.current = false;
      }
    }

    createSession();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Creating your chat session...</p>
      </div>
    </div>
  );
}
