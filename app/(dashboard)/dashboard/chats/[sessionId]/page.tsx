'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { UniversityCard } from '@/components/chat/UniversityCard'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  universities?: University[]
}

interface University {
  name: string
  country: string
  ranking?: number
  tuition?: string
  acceptanceRate?: string
  logo?: string
}

interface StudentProfile {
  education_level?: string
  field_of_interest?: string
  budget_min?: number
  budget_max?: number
  budget_currency?: string
  preferred_countries?: string[]
}

export default function ChatPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = params.sessionId as string
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [profile, setProfile] = useState<StudentProfile | null>(null)
  const [sessionTitle, setSessionTitle] = useState('New Conversation')
  const [savedUniversities, setSavedUniversities] = useState<University[]>([])
  const [savedCountries, setSavedCountries] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Load session
  useEffect(() => {
    async function loadSession() {
      try {
        const response = await fetch(`/api/chat/${sessionId}`)
        const { session } = await response.json()
        setMessages(session.messages || [])
        setProfile(session.student_profile)
        setSessionTitle(session.title || 'New Conversation')
        setIsLoading(false)
      } catch (error) {
        console.error('Error loading session:', error)
        setIsLoading(false)
      }
    }

    loadSession()
  }, [sessionId])

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsStreaming(true)

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, sessionId }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        throw new Error(errorData.error || `Server error: ${response.status}`)
      }

      if (!response.body) throw new Error('No response body')

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let aiMessage = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') break

            try {
              const parsed = JSON.parse(data)
              if (parsed.error) {
                console.error('Stream error:', parsed.error)
                aiMessage = `Error: ${parsed.error}`
                setMessages((prev) => [
                  ...prev,
                  {
                    role: 'assistant',
                    content: aiMessage,
                    timestamp: new Date().toISOString(),
                  },
                ])
                break
              }
              if (parsed.content) {
                aiMessage += parsed.content
                setMessages((prev) => {
                  const lastMsg = prev[prev.length - 1]
                  if (lastMsg?.role === 'assistant') {
                    return [
                      ...prev.slice(0, -1),
                      { ...lastMsg, content: aiMessage },
                    ]
                  }
                  return [
                    ...prev,
                    {
                      role: 'assistant',
                      content: aiMessage,
                      timestamp: new Date().toISOString(),
                    },
                  ]
                })
              }
            } catch (e) {
              console.error('JSON parse error:', e)
            }
          }
        }
      }

      if (aiMessage.length === 0) {
        throw new Error('No response received from the AI')
      }
    } catch (error) {
      console.error('Error streaming:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Sorry, I encountered an error: ${errorMessage}. Please try again.`,
          timestamp: new Date().toISOString(),
        },
      ])
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleClearChat = async () => {
    if (confirm('Are you sure you want to clear this chat?')) {
      try {
        await fetch(`/api/chat/${sessionId}`, {
          method: 'DELETE',
        })
        router.push('/dashboard/chats')
      } catch (error) {
        console.error('Error clearing chat:', error)
      }
    }
  }

  const handleSaveUniversity = (university: University) => {
    setSavedUniversities((prev) => {
      const exists = prev.find((u) => u.name === university.name)
      if (exists) return prev
      return [...prev, university]
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading chat...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full font-display">
      {/* Left Sidebar */}
      <aside className="flex h-full w-[280px] shrink-0 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col gap-6">
            {/* Session Title */}
            <div className="flex items-center gap-2 group">
              <h1 className="text-base font-semibold">{sessionTitle}</h1>
              <span className="material-symbols-outlined text-lg text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                edit
              </span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-1 text-sm font-medium text-gray-600 dark:text-gray-400">
              <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 text-left">
                <span className="material-symbols-outlined text-lg">download</span>
                <span>Download PDF Report</span>
              </button>
              <button
                onClick={handleClearChat}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 text-left"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
                <span>Clear Chat</span>
              </button>
              <button className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 text-left">
                <span className="material-symbols-outlined text-lg">archive</span>
                <span>Archive</span>
              </button>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            {/* Student Profile */}
            <div>
              <h2 className="px-3 text-sm font-semibold mb-2">Student Profile</h2>
              <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-3 text-sm">
                {profile?.education_level && (
                  <>
                    <p className="text-gray-500 dark:text-gray-400">Education</p>
                    <p className="font-medium">{profile.education_level}</p>
                  </>
                )}
                {profile?.field_of_interest && (
                  <>
                    <p className="text-gray-500 dark:text-gray-400">Field</p>
                    <p className="font-medium">{profile.field_of_interest}</p>
                  </>
                )}
                {profile?.budget_min && profile?.budget_max && (
                  <>
                    <p className="text-gray-500 dark:text-gray-400">Budget</p>
                    <p className="font-medium">
                      {profile.budget_currency} {profile.budget_min} - {profile.budget_max}/year
                    </p>
                  </>
                )}
                {profile?.preferred_countries && profile.preferred_countries.length > 0 && (
                  <>
                    <p className="text-gray-500 dark:text-gray-400">Preferences</p>
                    <p className="font-medium">{profile.preferred_countries.join(', ')}</p>
                  </>
                )}
                {!profile?.education_level && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 col-span-2">
                    Profile will be built as we chat
                  </p>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 my-2"></div>

            {/* Saved Items */}
            <div>
              <h2 className="px-3 text-sm font-semibold mb-2">Saved Items</h2>
              <div className="flex flex-col gap-1 text-sm font-medium">
                <button className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 bg-primary/10 text-primary text-left">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg">school</span>
                    <span>Universities</span>
                  </div>
                  <span className="text-xs font-semibold bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                    {savedUniversities.length}
                  </span>
                </button>
                <button className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg hover:bg-primary/10 text-left">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-lg">public</span>
                    <span>Countries</span>
                  </div>
                  <span className="text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">
                    {savedCountries.length}
                  </span>
                </button>
              </div>
            </div>
          </div>

          <button className="flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary/90">
            <span>Edit Profile</span>
          </button>
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex flex-1 flex-col h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 bg-white dark:bg-gray-800">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold">{sessionTitle}</h1>
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">share</span>
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
              <span className="material-symbols-outlined text-gray-600 dark:text-gray-400">settings</span>
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {messages.length === 0 && (
            <div className="flex items-start gap-3 max-w-2xl">
              <div className="bg-primary/10 rounded-full size-8 shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">smart_toy</span>
              </div>
              <div className="flex flex-1 flex-col gap-2 items-start">
                <p className="text-sm font-semibold">StudyAbroadAI</p>
                <p className="text-base font-normal leading-relaxed flex rounded-lg rounded-tl-none px-4 py-3 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
                  Hello! I'm Aanya, your study abroad advisor. What stage of education are you in right now?
                </p>
              </div>
            </div>
          )}

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                message.role === 'user' ? 'justify-end' : 'max-w-2xl'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="bg-primary/10 rounded-full size-8 shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">smart_toy</span>
                </div>
              )}
              <div className={`flex flex-1 flex-col gap-2 ${message.role === 'user' ? 'items-end max-w-2xl' : 'items-start w-full'}`}>
                <p className="text-sm font-semibold">
                  {message.role === 'user' ? 'You' : 'StudyAbroadAI'}
                </p>
                <p
                  className={`text-base font-normal leading-relaxed flex rounded-lg ${
                    message.role === 'user'
                      ? 'rounded-br-none px-4 py-3 bg-primary text-white'
                      : 'rounded-tl-none px-4 py-3 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700'
                  } whitespace-pre-wrap`}
                >
                  {message.content}
                </p>
                {message.universities && message.universities.length > 0 && (
                  <div className="w-full space-y-3 mt-2">
                    {message.universities.map((university, idx) => (
                      <UniversityCard
                        key={idx}
                        {...university}
                        onCompare={() => handleSaveUniversity(university)}
                      />
                    ))}
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <div className="bg-gray-300 dark:bg-gray-700 rounded-full size-8 shrink-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">person</span>
                </div>
              )}
            </div>
          ))}

          {isStreaming && (
            <div className="flex items-start gap-3 max-w-2xl">
              <div className="bg-primary/10 rounded-full size-8 shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary">smart_toy</span>
              </div>
              <div className="flex flex-1 flex-col gap-2 items-start">
                <p className="text-sm font-semibold">StudyAbroadAI</p>
                <div className="flex items-center gap-2 text-base font-normal leading-relaxed rounded-lg rounded-tl-none px-4 py-3 bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700">
                  <svg
                    className="animate-spin h-5 w-5 text-primary"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 pb-6 pt-4 shrink-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
          <div className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about universities, costs, visa requirements..."
              disabled={isStreaming}
              className="w-full h-12 pl-4 pr-14 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-primary transition-shadow shadow-sm"
              type="text"
            />
            <button
              onClick={sendMessage}
              disabled={isStreaming || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center size-8 rounded-md bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined text-xl">send</span>
            </button>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="flex h-full w-[280px] shrink-0 flex-col border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <div className="flex flex-col h-full">
          <h2 className="text-base font-semibold mb-4">Quick Reference</h2>
          <div className="flex-1 space-y-4 overflow-y-auto">
            {/* Saved Universities */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Saved Universities
              </h3>
              <div className="space-y-2">
                {savedUniversities.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Universities you save will appear here
                  </p>
                ) : (
                  savedUniversities.map((university, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full size-8 shrink-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">school</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{university.name}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {university.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Saved Countries */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                Saved Countries
              </h3>
              <div className="space-y-2">
                {savedCountries.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Countries you save will appear here
                  </p>
                ) : (
                  savedCountries.map((country, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900"
                    >
                      <div className="flex items-center gap-3">
                        <div className="bg-gray-200 dark:bg-gray-700 rounded-full size-8 shrink-0 flex items-center justify-center">
                          <span className="material-symbols-outlined text-sm">public</span>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">{country}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
          <button className="flex w-full cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm font-bold mt-4 hover:bg-gray-300 dark:hover:bg-gray-600">
            <span>Export Chat</span>
          </button>
        </div>
      </aside>
    </div>
  )
}
