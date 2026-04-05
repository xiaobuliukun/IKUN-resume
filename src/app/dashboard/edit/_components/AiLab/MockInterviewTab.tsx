import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Resume } from '@/store/useResumeStore';
import { useSettingStore } from '@/store/useSettingStore';
import { Loader2, Mic, Send, User, Bot, Play, Square } from 'lucide-react';
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const { apiKey, model, baseUrl } = useSettingStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = { apiKey, model, baseUrl }; 

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current = new SpeechRecognition();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'en-US'; // Default to English, can be made configurable

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(transcript);
          setIsRecording(false);
        };

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }

    return () => {
      recognitionRef.current?.abort();
    };
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
          <p className="max-w-md text-slate-500">
            {t('modals.aiModal.mockInterview.description') || 'Paste the job description below to start a realistic mock interview session based on your resume.'}
          </p>
        </div>
        <Textarea
          placeholder={t('modals.aiModal.mockInterview.jdPlaceholder') || 'Paste Job Description here...'}
          className="min-h-[200px] resize-none border-slate-300 bg-white text-slate-900"
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
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4">
        <h3 className="flex items-center gap-2 font-semibold text-slate-800">
            <Bot className="text-sky-400" />
            {t('modals.aiModal.mockInterview.sessionTitle') || 'Interview Session'}
        </h3>
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleEndSession}
            className="text-slate-500 hover:text-slate-900"
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
                msg.role === 'user' ? "bg-sky-600" : "bg-slate-200"
                )}>
                {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-slate-700" />}
                </div>
                <div className={cn(
                "p-3 rounded-2xl text-sm leading-relaxed",
                msg.role === 'user' 
                    ? "rounded-tr-none bg-sky-50 text-sky-900" 
                    : "rounded-tl-none bg-white text-slate-700 border border-slate-200"
                )}>
                <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
            </div>
            ))}
            {isAiJobRunning && messages[messages.length - 1]?.role === 'user' && (
            <div className="flex gap-3 max-w-[85%]">
                 <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-slate-200">
                    <Bot size={16} className="text-slate-700" />
                 </div>
                 <div className="flex items-center rounded-2xl rounded-tl-none border border-slate-200 bg-white p-3">
                    <span className="flex gap-1">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0ms' }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '150ms' }} />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '300ms' }} />
                    </span>
                 </div>
            </div>
            )}
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50 p-4">
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="icon"
                onClick={toggleRecording}
                className={cn(
                    "border-slate-300 bg-white transition-colors hover:bg-slate-50",
                    isRecording ? "border-red-300 bg-red-50 text-red-500" : "text-slate-500"
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
                className="min-h-[44px] max-h-[120px] resize-none border-slate-300 bg-white py-3 text-slate-900"
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
