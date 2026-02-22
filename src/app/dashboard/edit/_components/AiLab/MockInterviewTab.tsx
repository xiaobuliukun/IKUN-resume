import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Resume } from '@/store/useResumeStore';
import { useSettingStore } from '@/store/useSettingStore';
import { Loader2, Mic, MicOff, Send, User, Bot, Play, Square } from 'lucide-react';
// import { ScrollArea } from "@/app/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';

interface MockInterviewTabProps {
  resumeData: Resume;
  isAiJobRunning: boolean;
  setIsAiJobRunning: (isRunning: boolean) => void;
}

interface Message {
  role: 'user' | 'ai';
  content: string;
}

export default function MockInterviewTab({ resumeData, isAiJobRunning, setIsAiJobRunning }: MockInterviewTabProps) {
  const { t } = useTranslation();
  const [jd, setJd] = useState('');
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const { apiKey, model, baseUrl } = useSettingStore();

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US'; // Default to English, can be made configurable

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
      setIsRecording(true);
    }
  };

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleStartInterview = async () => {
    if (!jd.trim()) return;
    setIsInterviewStarted(true);
    setIsAiJobRunning(true);
    
    // Initial call to start the interview
    await sendMessage([]); 
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isAiJobRunning) return;
    
    const newMessages = [...messages, { role: 'user', content: input } as Message];
    setMessages(newMessages);
    setInput('');
    setIsAiJobRunning(true);

    await sendMessage(newMessages);
  };

  const sendMessage = async (currentHistory: Message[]) => {
    try {
      const response = await fetch('/api/node/optimizer-agent/mock-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: currentHistory,
          jd,
          resumeData,
          config: {
            apiKey,
            modelName: model,
            baseUrl
          }
        }),
      });

      if (!response.ok) throw new Error('Failed to send message');
      
      const reader = response.body?.getReader();
      if (!reader) return;

      let aiMessageContent = '';
      setMessages(prev => [...prev, { role: 'ai', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.type === 'message_chunk') {
                aiMessageContent += data.content;
                setMessages(prev => {
                  const newMessages = [...prev];
                  newMessages[newMessages.length - 1].content = aiMessageContent;
                  return newMessages;
                });
              }
            } catch (e) {
              console.error('Error parsing SSE data', e);
            }
          }
        }
      }

      // Optional: Speak the AI response (TTS)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(aiMessageContent);
        window.speechSynthesis.speak(utterance);
      }

    } catch (error) {
      console.error(error);
      // Handle error
    } finally {
      setIsAiJobRunning(false);
    }
  };

  const handleEndSession = () => {
    setIsInterviewStarted(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  if (!isInterviewStarted) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-6 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-sky-400">{t('modals.aiModal.mockInterview.title') || 'AI Mock Interviewer'}</h2>
          <p className="text-neutral-400 max-w-md">
            {t('modals.aiModal.mockInterview.description') || 'Paste the job description below to start a realistic mock interview session based on your resume.'}
          </p>
        </div>
        <Textarea
          placeholder={t('modals.aiModal.mockInterview.jdPlaceholder') || 'Paste Job Description here...'}
          className="min-h-[200px] bg-neutral-900 border-neutral-800 text-white resize-none"
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
        <Button 
          onClick={handleStartInterview}
          disabled={!jd.trim() || isAiJobRunning}
          className="bg-sky-600 hover:bg-sky-700 text-white w-full max-w-xs"
        >
          {isAiJobRunning ? <Loader2 className="animate-spin mr-2" /> : <Play className="mr-2 h-4 w-4" />}
          {t('modals.aiModal.mockInterview.startBtn') || 'Start Interview'}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-neutral-800 p-4 flex justify-between items-center bg-neutral-900/50">
        <h3 className="font-semibold text-white flex items-center gap-2">
            <Bot className="text-sky-400" />
            {t('modals.aiModal.mockInterview.sessionTitle') || 'Interview Session'}
        </h3>
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleEndSession}
            className="text-neutral-400 hover:text-white"
        >
            {t('modals.aiModal.mockInterview.endBtn') || 'End Session'}
        </Button>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-0 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
            {messages.map((msg, idx) => (
            <div
                key={idx}
                className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
                )}
            >
                <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                msg.role === 'user' ? "bg-sky-600" : "bg-neutral-700"
                )}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                    ? "bg-sky-600/20 text-sky-100 rounded-tr-none" 
                    : "bg-neutral-800 text-neutral-200 rounded-tl-none"
                )}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
            </div>
            ))}
            {isAiJobRunning && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3 max-w-[85%]">
                 <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center flex-shrink-0">
                    <Bot size={16} />
                 </div>
                 <div className="bg-neutral-800 p-3 rounded-2xl rounded-tl-none flex items-center">
                    <span className="flex gap-1">
                        <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-neutral-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                 </div>
            </div>
            )}
        </div>
      </div>

      <div className="p-4 border-t border-neutral-800 bg-neutral-900/50">
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={toggleRecording}
                className={cn(
                    "border-neutral-700 hover:bg-neutral-800 transition-colors",
                    isRecording ? "text-red-500 border-red-500/50 bg-red-500/10" : "text-neutral-400"
                )}
                title={isRecording ? "Stop Recording" : "Start Recording"}
            >
                {isRecording ? <Square size={18} fill="currentColor" /> : <Mic size={18} />}
            </Button>
            <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                    }
                }}
                placeholder={t('modals.aiModal.mockInterview.inputPlaceholder') || 'Type your answer...'}
                className="min-h-[44px] max-h-[120px] bg-neutral-950 border-neutral-700 text-white resize-none py-3"
            />
            <Button 
                onClick={handleSendMessage} 
                disabled={!input.trim() || isAiJobRunning}
                className="bg-sky-600 hover:bg-sky-700 text-white px-4"
            >
                <Send size={18} />
            </Button>
        </div>
      </div>
    </div>
  );
}
