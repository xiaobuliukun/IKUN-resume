import React, { useEffect } from 'react';
import { Resume } from '@/store/useResumeStore';
import { useTranslation } from 'react-i18next';
import { Button } from '@/app/components/ui/button';
import { Sparkles, BarChart3, Loader2, RotateCw } from 'lucide-react';
import { ResumeAnalysisReport } from '@/app/components/ResumeAnalysisReport';
import { useResumeAnalyzer } from '@/app/hooks/useResumeAnalyzer';

type AnalyzeTabProps = {
  resumeData: Resume;   
  isAiJobRunning: boolean;
  setIsAiJobRunning: (isRunning: boolean) => void;
};

export default function AnalyzeTab({ resumeData, isAiJobRunning, setIsAiJobRunning }: AnalyzeTabProps) {
  const { t } = useTranslation();
  const { isAnalyzing, analysisResult, analysisProgress, runAnalysis, resetAnalysis } = useResumeAnalyzer();

  useEffect(() => {
    setIsAiJobRunning(isAnalyzing);
  }, [isAnalyzing, setIsAiJobRunning]);

  const handleAnalyze = () => {
    runAnalysis({ resumeData });
  };
  
  return (
    <div>
      {isAnalyzing ? (
        <div className="flex h-[65vh] flex-col items-center justify-center p-4 text-center text-slate-500">
          <Sparkles size={48} className="animate-pulse text-purple-500" />
          <p className="mt-4 mb-2 text-slate-800">{analysisProgress.text || t('modals.aiModal.progressText')}</p>
          <div className="h-2.5 w-[60%] rounded-full bg-slate-200">
            <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${analysisProgress.value}%` }}></div>
          </div>
        </div>
      ) : analysisResult ? (
        <div className='relative py-4'>
          <div className="flex justify-end mb-4 absolute top-6 right-4">
            <Button onClick={() => !isAiJobRunning && resetAnalysis()} disabled={isAiJobRunning} variant="ghost" className="text-slate-500 hover:bg-slate-100 hover:text-slate-900">
              <RotateCw size={16} className="mr-2" />
              {t('modals.aiModal.analysisTab.reAnalyzeButton')}
            </Button>
          </div>
          <ResumeAnalysisReport analysis={analysisResult} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center h-[65vh] p-4">
          <div className="p-6 rounded-full bg-purple-500/10 border-2 border-dashed border-purple-500/30 mb-6">
            <BarChart3 size={48} className="text-purple-300" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-slate-800">{t('modals.aiModal.analysisTab.title')}</h2>
          <p className="mb-8 max-w-md text-slate-500">
            {t('modals.aiModal.analysisTab.placeholder.description')}
          </p>
          <Button onClick={handleAnalyze} disabled={isAiJobRunning} className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-lg px-8 py-6">
            {isAnalyzing ? (
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : <Sparkles className="mr-2 h-5 w-5" />}
            {isAnalyzing ? t('modals.aiModal.analysisTab.analyzingButton') : t('modals.aiModal.analysisTab.analyzeButton')}
          </Button>
        </div>
      )}
    </div>
  );
}
