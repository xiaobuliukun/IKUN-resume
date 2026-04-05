import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/app/components/ui/button";
import { Textarea } from "@/app/components/ui/textarea";
import { Resume } from '@/store/useResumeStore';
import { useSettingStore } from '@/store/useSettingStore';
import { Loader2, Mail, Copy, Check } from 'lucide-react';
// import { ScrollArea } from "@/app/components/ui/scroll-area";
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface CoverLetterTabProps {
  resumeData: Resume;
  isAiJobRunning: boolean;
  setIsAiJobRunning: (isRunning: boolean) => void;
}

export default function CoverLetterTab({ resumeData, isAiJobRunning, setIsAiJobRunning }: CoverLetterTabProps) {
  const { t } = useTranslation();
  const [jd, setJd] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { apiKey, model, baseUrl } = useSettingStore();

  const handleGenerate = async () => {
    if (!jd.trim()) return;
    setIsAiJobRunning(true);
    setCoverLetter('');
    
    try {
      const response = await fetch('/api/node/optimizer-agent/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jd,
          resumeData,
          config: {
            apiKey,
            modelName: model,
            baseUrl
          }
        }),
      });

      if (!response.ok) throw new Error('Generation failed');
      const data = await response.json();
      setCoverLetter(data.content);
    } catch (error) {
      console.error(error);
      toast.error(t('modals.aiModal.coverLetter.error') || 'Failed to generate cover letter');
    } finally {
      setIsAiJobRunning(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setIsCopied(true);
    toast.success(t('modals.aiModal.coverLetter.copied') || 'Copied to clipboard');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full py-6 gap-6">
      <div className="flex gap-6 h-full">
        {/* Left Side: Input */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="space-y-2">
            <h3 className="flex items-center gap-2 font-semibold text-slate-800">
                <Mail className="text-sky-400 w-4 h-4" />
                {t('modals.aiModal.coverLetter.inputTitle') || 'Job Description'}
            </h3>
            <p className="text-xs text-slate-500">
                {t('modals.aiModal.coverLetter.inputDesc') || 'Paste the JD here to generate a tailored cover letter.'}
            </p>
          </div>
          <Textarea
            placeholder={t('modals.aiModal.coverLetter.jdPlaceholder') || 'Paste Job Description...'}
            className="flex-1 resize-none border-slate-300 bg-white text-slate-900"
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            disabled={isAiJobRunning}
          />
          <Button 
            onClick={handleGenerate}
            disabled={!jd.trim() || isAiJobRunning}
            className="bg-sky-600 hover:bg-sky-700 text-white w-full"
          >
            {isAiJobRunning ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Mail className="mr-2 h-4 w-4" />}
            {t('modals.aiModal.coverLetter.generateBtn') || 'Generate Letter'}
          </Button>
        </div>

        {/* Right Side: Output */}
        <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4">
             <h3 className="font-semibold text-slate-800">
                {t('modals.aiModal.coverLetter.outputTitle') || 'Generated Cover Letter'}
             </h3>
             {coverLetter && (
                 <Button variant="ghost" size="sm" onClick={handleCopy} className="text-slate-500 hover:text-slate-900">
                    {isCopied ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                    {isCopied ? 'Copied' : 'Copy'}
                 </Button>
             )}
          </div>
          <div className="flex-1 overflow-y-auto p-6">
             {coverLetter ? (
                 <article className="prose prose-sm max-w-none">
                     <ReactMarkdown>{coverLetter}</ReactMarkdown>
                 </article>
             ) : (
                 <div className="flex h-full flex-col items-center justify-center space-y-3 text-slate-400 opacity-60">
                    <Mail className="w-12 h-12" />
                    <p>{t('modals.aiModal.coverLetter.emptyState') || 'Your cover letter will appear here'}</p>
                 </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
