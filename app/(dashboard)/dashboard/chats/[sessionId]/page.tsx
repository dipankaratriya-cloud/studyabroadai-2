'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { parseCollegeRecommendations, hasCollegeRecommendations, CollegeRecommendation } from '@/lib/xmlParser';
import { CollegeCard } from '@/components/CollegeCard';
import { ComparisonCard } from '@/components/ComparisonCard';
import { Button } from '@/components/ui/button';
import { GitCompare, X, Bookmark, MapPin, Check } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface MessageContentProps {
  content: string;
  onCompare: (college: CollegeRecommendation) => void;
  onSave: (college: CollegeRecommendation) => void;
  selectedColleges: CollegeRecommendation[];
  savedColleges: CollegeRecommendation[];
  isStreaming?: boolean;
}

// Helper to detect if content has partial/incomplete XML
function hasPartialXml(content: string): boolean {
  // Check if there's an opening tag without matching closing tag
  const openTags = (content.match(/<college_recommendation>/g) || []).length;
  const closeTags = (content.match(/<\/college_recommendation>/g) || []).length;
  return openTags > closeTags;
}

// Helper to filter out XML content from display during streaming
function getStreamingDisplayText(content: string): string {
  // Remove any complete XML blocks
  let text = content.replace(/<college_recommendation>[\s\S]*?<\/college_recommendation>/g, '');
  // Remove any partial XML that's being streamed (from opening tag onwards)
  const partialXmlStart = text.indexOf('<college_recommendation>');
  if (partialXmlStart !== -1) {
    text = text.substring(0, partialXmlStart);
  }
  // Also remove any partial tags like "<college" or "<college_rec..."
  const partialTagMatch = text.match(/<college[^>]*$/);
  if (partialTagMatch) {
    text = text.substring(0, text.length - partialTagMatch[0].length);
  }
  return text.trim();
}

function MessageContent({ content, onCompare, onSave, selectedColleges, savedColleges, isStreaming }: MessageContentProps) {
  // During streaming, check if XML is being generated
  const hasXmlContent = /<college/.test(content);
  const isXmlComplete = hasCollegeRecommendations(content) && !hasPartialXml(content);

  // If streaming and XML is being generated but not complete, show loading state
  if (isStreaming && hasXmlContent && !isXmlComplete) {
    const displayText = getStreamingDisplayText(content);
    return (
      <div className="space-y-4">
        {displayText && (
          <div className="whitespace-pre-wrap mb-4">{displayText}</div>
        )}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <div className="flex items-center gap-3">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full"></div>
            <div>
              <p className="font-medium">Generating university recommendations...</p>
              <p className="text-sm text-muted-foreground">Analyzing best matches for your profile</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasCollegeRecommendations(content)) {
    return <div className="whitespace-pre-wrap">{content}</div>;
  }

  const { colleges, cleanedText } = parseCollegeRecommendations(content);
  const compareDisabled = selectedColleges.length >= 3;

  return (
    <div className="space-y-4">
      {cleanedText && (
        <div className="whitespace-pre-wrap mb-4">{cleanedText}</div>
      )}
      {colleges.length > 0 && (
        <div className="space-y-4 max-w-3xl">
          {colleges.map((college, idx) => (
            <CollegeCard
              key={idx}
              college={college}
              onCompare={onCompare}
              onSave={onSave}
              isSelected={selectedColleges.some(c => c.name === college.name)}
              isSaved={savedColleges.some(c => c.name === college.name)}
              compareDisabled={compareDisabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedColleges, setSelectedColleges] = useState<CollegeRecommendation[]>([]);
  const [savedColleges, setSavedColleges] = useState<CollegeRecommendation[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [comparisonSaved, setComparisonSaved] = useState(false);
  const [savingComparison, setSavingComparison] = useState(false);

  const handleSaveToggle = useCallback((college: CollegeRecommendation) => {
    setSavedColleges(prev => {
      const isAlreadySaved = prev.some(c => c.name === college.name);
      if (isAlreadySaved) {
        return prev.filter(c => c.name !== college.name);
      }
      return [...prev, college];
    });
  }, []);

  const handleRemoveFromSaved = useCallback((collegeName: string) => {
    setSavedColleges(prev => prev.filter(c => c.name !== collegeName));
  }, []);

  const handleCompareToggle = useCallback((college: CollegeRecommendation) => {
    setSelectedColleges(prev => {
      const isAlreadySelected = prev.some(c => c.name === college.name);
      if (isAlreadySelected) {
        return prev.filter(c => c.name !== college.name);
      }
      if (prev.length >= 3) return prev;
      return [...prev, college];
    });
  }, []);

  const handleRemoveFromComparison = useCallback((collegeName: string) => {
    setSelectedColleges(prev => prev.filter(c => c.name !== collegeName));
  }, []);

  const handleShowComparison = useCallback(async () => {
    if (selectedColleges.length >= 2) {
      setShowComparison(true);
      setComparisonSaved(false);
      setSavingComparison(true);

      // Automatically save comparison to database
      try {
        const response = await fetch('/api/comparisons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            colleges: selectedColleges,
            comparisonTitle: `Comparing ${selectedColleges.map(c => c.name?.split(' ')[0]).join(' vs ')}`,
            comparisonSummary: `Comparison of ${selectedColleges.length} universities: ${selectedColleges.map(c => c.name).join(', ')}`,
          }),
        });

        if (response.ok) {
          setComparisonSaved(true);
        }
      } catch (error) {
        console.error('Error saving comparison:', error);
      } finally {
        setSavingComparison(false);
      }
    }
  }, [selectedColleges, sessionId]);

  const handleCloseComparison = useCallback(() => {
    setShowComparison(false);
    setComparisonSaved(false);
  }, []);

  useEffect(() => {
    async function loadSession() {
      const res = await fetch(`/api/chat/${sessionId}`);
      const { session } = await res.json();
      setMessages(session?.messages || []);
      setProfile(session?.student_profile);
      setLoading(false);
    }
    loadSession();
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: Message = { role: 'user', content: input, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsStreaming(true);

    try {
      const response = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input, sessionId }),
      });

      if (!response.ok || !response.body) throw new Error('Stream failed');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                aiMessage += parsed.content;
                setMessages(prev => {
                  const lastMsg = prev[prev.length - 1];
                  if (lastMsg?.role === 'assistant') {
                    return [...prev.slice(0, -1), { ...lastMsg, content: aiMessage }];
                  }
                  return [...prev, { role: 'assistant', content: aiMessage, timestamp: new Date().toISOString() }];
                });
              }
            } catch {}
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, error occurred.', timestamp: new Date().toISOString() }]);
    } finally {
      setIsStreaming(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-screen"><div className="text-gray-600">Loading...</div></div>;

  return (
    <div className="flex h-full w-full">
      {/* Main Chat */}
      <main className="flex-1 flex flex-col bg-gray-50 dark:bg-gray-900">
        <header className="h-16 border-b bg-white dark:bg-gray-800 flex items-center px-6">
          <h1 className="font-semibold">Chat with Aanya</h1>
          {isStreaming && <div className="ml-3 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>}
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">🤖</div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm max-w-2xl">
                Hello! I&apos;m Aanya, your study abroad advisor. What stage of education are you in right now?
              </div>
            </div>
          )}

          {messages.map((msg, i) => {
            const isLastMessage = i === messages.length - 1;
            const isStreamingMessage = isStreaming && isLastMessage && msg.role === 'assistant';

            return (
              <div key={i} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">🤖</div>}
                <div className={`rounded-lg p-4 ${msg.role === 'user' ? 'max-w-2xl bg-primary text-white' : 'max-w-full'} ${msg.role === 'assistant' && !hasCollegeRecommendations(msg.content) ? 'max-w-2xl bg-white dark:bg-gray-800 shadow-sm' : ''}`}>
                  {msg.role === 'user' ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <MessageContent
                      content={msg.content}
                      onCompare={handleCompareToggle}
                      onSave={handleSaveToggle}
                      selectedColleges={selectedColleges}
                      savedColleges={savedColleges}
                      isStreaming={isStreamingMessage}
                    />
                  )}
                </div>
                {msg.role === 'user' && <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">👤</div>}
              </div>
            );
          })}

          {/* Only show Thinking... if streaming hasn't produced any content yet */}
          {isStreaming && (!messages.length || messages[messages.length - 1]?.role !== 'assistant') && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">🤖</div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm flex items-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full"></div>
                Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white dark:bg-gray-800 border-t">
          <div className="relative">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
              placeholder="Ask about universities, costs, visa..."
              disabled={isStreaming}
              className="w-full h-12 pl-4 pr-14 rounded-lg border focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={sendMessage}
              disabled={isStreaming || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded bg-primary text-white disabled:opacity-50 flex items-center justify-center"
            >
              →
            </button>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-[280px] border-l bg-white dark:bg-gray-800 flex flex-col overflow-hidden">
        {/* Compare Section - Top Half */}
        <div className="p-4 flex-1 overflow-y-auto border-b">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <GitCompare className="h-4 w-4" />
            Compare Colleges
          </h2>

          {selectedColleges.length === 0 ? (
            <div className="text-sm text-gray-500">
              <p>Select up to 3 colleges to compare.</p>
              <p className="mt-2 text-xs">Click &quot;Compare&quot; on any college card.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{selectedColleges.length}/3 selected</p>
              {selectedColleges.map((college, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-primary/5 rounded-lg border border-primary/20"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{college.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {college.city}, {college.country}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-2 flex-shrink-0"
                    onClick={() => handleRemoveFromComparison(college.name)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              {selectedColleges.length >= 2 && (
                <Button
                  className="w-full mt-3"
                  size="sm"
                  onClick={handleShowComparison}
                >
                  <GitCompare className="mr-2 h-4 w-4" />
                  Compare {selectedColleges.length} Colleges
                </Button>
              )}

              {selectedColleges.length === 1 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Select at least one more to compare.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Saved Universities Section - Bottom Half */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Saved Universities
          </h2>

          {savedColleges.length === 0 ? (
            <div className="text-sm text-gray-500">
              <p>No universities saved yet.</p>
              <p className="mt-2 text-xs">Click the bookmark icon on any college card to save it.</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">{savedColleges.length} saved</p>
              {savedColleges.map((college, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{college.name}</p>
                    <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {college.city}, {college.country}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-2 flex-shrink-0 hover:text-destructive"
                    onClick={() => handleRemoveFromSaved(college.name)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Floating Comparison Bar */}
      {selectedColleges.length >= 2 && !showComparison && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
          <Button
            size="lg"
            className="shadow-lg"
            onClick={handleShowComparison}
          >
            <GitCompare className="mr-2 h-5 w-5" />
            Compare {selectedColleges.length} Colleges
          </Button>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            {/* Save Status Indicator */}
            <div className="mb-2 flex justify-center">
              {savingComparison && (
                <div className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg">
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving to Comparisons...
                </div>
              )}
              {comparisonSaved && !savingComparison && (
                <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm flex items-center gap-2 shadow-lg">
                  <Check className="h-4 w-4" />
                  Saved to Comparisons
                  <button
                    onClick={() => router.push('/dashboard/comparisons')}
                    className="ml-2 underline hover:no-underline"
                  >
                    View All
                  </button>
                </div>
              )}
            </div>
            <ComparisonCard
              colleges={selectedColleges}
              onClose={handleCloseComparison}
              onRemoveCollege={handleRemoveFromComparison}
            />
          </div>
        </div>
      )}
    </div>
  );
}
