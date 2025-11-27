'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { parseCollegeRecommendations, hasCollegeRecommendations, CollegeRecommendation } from '@/lib/xmlParser';
import { CollegeCard } from '@/components/CollegeCard';
import { ComparisonCard } from '@/components/ComparisonCard';
import { Button } from '@/components/ui/button';
import { GitCompare, X, Bookmark, MapPin, Check, Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';

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

function hasPartialXml(content: string): boolean {
  const openTags = (content.match(/<college_recommendation>/g) || []).length;
  const closeTags = (content.match(/<\/college_recommendation>/g) || []).length;
  return openTags > closeTags;
}

function getStreamingDisplayText(content: string): string {
  let text = content.replace(/<college_recommendation>[\s\S]*?<\/college_recommendation>/g, '');
  const partialXmlStart = text.indexOf('<college_recommendation>');
  if (partialXmlStart !== -1) {
    text = text.substring(0, partialXmlStart);
  }
  const partialTagMatch = text.match(/<college[^>]*$/);
  if (partialTagMatch) {
    text = text.substring(0, text.length - partialTagMatch[0].length);
  }
  return text.trim();
}

function MessageContent({ content, onCompare, onSave, selectedColleges, savedColleges, isStreaming }: MessageContentProps) {
  const hasXmlContent = /<college/.test(content);
  const isXmlComplete = hasCollegeRecommendations(content) && !hasPartialXml(content);

  if (isStreaming && hasXmlContent && !isXmlComplete) {
    const displayText = getStreamingDisplayText(content);
    return (
      <div className="space-y-4">
        {displayText && (
          <div className="whitespace-pre-wrap leading-relaxed">{displayText}</div>
        )}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white animate-pulse" />
            </div>
            <div>
              <p className="font-semibold">Finding best universities for you...</p>
              <p className="text-sm text-muted-foreground">Analyzing your profile and preferences</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!hasCollegeRecommendations(content)) {
    return <div className="whitespace-pre-wrap leading-relaxed">{content}</div>;
  }

  const { colleges, cleanedText } = parseCollegeRecommendations(content);
  const compareDisabled = selectedColleges.length >= 3;

  return (
    <div className="space-y-4">
      {cleanedText && (
        <div className="whitespace-pre-wrap leading-relaxed mb-4">{cleanedText}</div>
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
  const inputRef = useRef<HTMLInputElement>(null);
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
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, an error occurred. Please try again.', timestamp: new Date().toISOString() }]);
    } finally {
      setIsStreaming(false);
      inputRef.current?.focus();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full bg-background">
      {/* Main Chat */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 border-b bg-card flex items-center px-6 gap-3">
          <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold">Aanya - AI Advisor</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              {isStreaming ? (
                <>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Responding...
                </>
              ) : (
                'Online'
              )}
            </p>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-card rounded-2xl rounded-tl-none p-5 shadow-sm border max-w-2xl">
                  <p className="leading-relaxed">
                    Hello! I&apos;m Aanya, your AI study abroad advisor. I&apos;m here to help you find the perfect university and guide you through the entire application process.
                  </p>
                  <p className="mt-3 leading-relaxed">
                    To get started, could you tell me what stage of education you&apos;re currently in?
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg, i) => {
              const isLastMessage = i === messages.length - 1;
              const isStreamingMessage = isStreaming && isLastMessage && msg.role === 'assistant';

              return (
                <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'assistant' ? 'gradient-primary' : 'bg-muted'
                  }`}>
                    {msg.role === 'assistant' ? (
                      <Bot className="h-5 w-5 text-white" />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div className={`max-w-2xl ${msg.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-5 shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-none'
                        : hasCollegeRecommendations(msg.content)
                          ? 'bg-transparent shadow-none p-0'
                          : 'bg-card border rounded-2xl rounded-tl-none'
                    }`}>
                      {msg.role === 'user' ? (
                        <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
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
                  </div>
                </div>
              );
            })}

            {isStreaming && (!messages.length || messages[messages.length - 1]?.role !== 'assistant') && (
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="bg-card rounded-2xl rounded-tl-none p-5 shadow-sm border">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                    <span className="text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 bg-card border-t">
          <div className="max-w-4xl mx-auto">
            <div className="relative flex items-center">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                placeholder="Ask about universities, scholarships, visa requirements..."
                disabled={isStreaming}
                className="input-field pr-14 h-14 text-base"
              />
              <button
                onClick={sendMessage}
                disabled={isStreaming || !input.trim()}
                className="absolute right-2 w-10 h-10 rounded-xl gradient-primary text-white disabled:opacity-50 flex items-center justify-center transition-all hover:shadow-lg hover:shadow-primary/25 disabled:hover:shadow-none"
              >
                {isStreaming ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-72 border-l bg-card flex flex-col overflow-hidden">
        {/* Compare Section */}
        <div className="p-5 flex-1 overflow-y-auto border-b">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <GitCompare className="h-4 w-4 text-primary" />
            Compare Colleges
          </h2>

          {selectedColleges.length === 0 ? (
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-xl p-4">
              <p className="font-medium mb-1">No colleges selected</p>
              <p className="text-xs">Select up to 3 colleges to compare side by side.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-medium">{selectedColleges.length}/3 selected</p>
              {selectedColleges.map((college, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-primary/5 rounded-xl border border-primary/20"
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
                    className="h-7 w-7 p-0 ml-2 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleRemoveFromComparison(college.name)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {selectedColleges.length >= 2 && (
                <Button
                  className="w-full mt-2 h-10"
                  onClick={handleShowComparison}
                >
                  <GitCompare className="mr-2 h-4 w-4" />
                  Compare Now
                </Button>
              )}

              {selectedColleges.length === 1 && (
                <p className="text-xs text-muted-foreground text-center py-2">
                  Add one more to compare
                </p>
              )}
            </div>
          )}
        </div>

        {/* Saved Section */}
        <div className="p-5 flex-1 overflow-y-auto">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Bookmark className="h-4 w-4 text-amber-500" />
            Saved Universities
          </h2>

          {savedColleges.length === 0 ? (
            <div className="text-sm text-muted-foreground bg-muted/50 rounded-xl p-4">
              <p className="font-medium mb-1">No universities saved</p>
              <p className="text-xs">Bookmark colleges you like for quick access.</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground font-medium">{savedColleges.length} saved</p>
              {savedColleges.map((college, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200 dark:border-amber-800"
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
                    className="h-7 w-7 p-0 ml-2 flex-shrink-0 hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => handleRemoveFromSaved(college.name)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Floating Compare Button */}
      {selectedColleges.length >= 2 && !showComparison && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-slide-up">
          <Button
            size="lg"
            className="shadow-xl hover:shadow-2xl h-12 px-6"
            onClick={handleShowComparison}
          >
            <GitCompare className="mr-2 h-5 w-5" />
            Compare {selectedColleges.length} Colleges
          </Button>
        </div>
      )}

      {/* Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="mb-3 flex justify-center">
              {savingComparison && (
                <div className="bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm flex items-center gap-2 shadow-lg">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving comparison...
                </div>
              )}
              {comparisonSaved && !savingComparison && (
                <div className="bg-green-500 text-white px-5 py-2.5 rounded-full text-sm flex items-center gap-2 shadow-lg">
                  <Check className="h-4 w-4" />
                  Saved to Comparisons
                  <button
                    onClick={() => router.push('/dashboard/comparisons')}
                    className="ml-2 underline hover:no-underline font-medium"
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
