'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewChatPage() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    async function createSession() {
      if (isCreating) return
      setIsCreating(true)

      try {
        const response = await fetch('/api/chat/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'New Conversation' }),
        })

        const { session } = await response.json()
        router.push(`/dashboard/chats/${session.id}`)
      } catch (error) {
        console.error('Error creating session:', error)
        setIsCreating(false)
      }
    }

    createSession()
  }, [router, isCreating])

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Creating your chat session...</p>
      </div>
    </div>
  )
}
