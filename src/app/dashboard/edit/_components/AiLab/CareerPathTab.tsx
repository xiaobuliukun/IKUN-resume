import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Resume } from '@/store/useResumeStore';
import { useSettingStore } from '@/store/useSettingStore';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend } from 'recharts';
import { Loader2, Map, Target } from 'lucide-react';
import { motion } from 'framer-motion';

interface CareerPathTabProps {
  resumeData: Resume;
  isAiJobRunning: boolean;
  setIsAiJobRunning: (isRunning: boolean) => void;
}

interface CareerAnalysisResult {
  targetRole: string;
  radarData: {
    subject: string;
    current: number;
    required: number;
    fullMark: number;
  }[];
  gapAnalysis: string;
  learningPath: {
    step: number;
    title: string;
    description: string;
    timeline: string;
  }[];
}

export default function CareerPathTab({ resumeData, isAiJobRunning, setIsAiJobRunning }: CareerPathTabProps) {
  const { t } = useTranslation();
  const [targetRole, setTargetRole] = useState('');
  const [result, setResult] = useState<CareerAnalysisResult | null>(null);
  const { apiKey, model, baseUrl } = useSettingStore();

  const handleAnalyze = async () => {
    setIsAiJobRunning(true);
    setResult(null);
    try {
      const response = await fetch('/api/node/optimizer-agent/career-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resumeData,
          targetRole,
          config: {
            apiKey,
            modelName: model,
            baseUrl
          }
        }),
      });

      if (!response.ok) throw new Error('Analysis failed');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      // In a real app, use toast.error here
    } finally {
      setIsAiJobRunning(false);
    }
  };

  return (
    <div className="py-6 space-y-6 h-full flex flex-col">
      <div className="space-y-4 flex-none">
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="targetRole" className="text-neutral-300 flex items-center gap-2">
            <Target className="w-4 h-4" />
            {t('modals.aiModal.careerPath.targetRoleLabel') || 'Target Role (Optional)'}
          </Label>
          <div className="flex gap-2">
             <Input
              id="targetRole"
              placeholder={t('modals.aiModal.careerPath.targetRolePlaceholder') || 'e.g. Senior Product Manager'}
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="bg-neutral-900 border-neutral-800 text-white placeholder:text-neutral-500"
              disabled={isAiJobRunning}
            />
            <Button 
              onClick={handleAnalyze} 
              disabled={isAiJobRunning}
              className="bg-sky-600 hover:bg-sky-700 text-white min-w-[140px]"
            >
              {isAiJobRunning ? <Loader2 className="animate-spin" /> : <><Map className="mr-2 h-4 w-4" /> {t('modals.aiModal.careerPath.analyzeBtn') || 'Plan Career'}</>}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {result ? (
            <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 pb-8"
            >
            {/* Radar Chart Section */}
            <div className="grid md:grid-cols-2 gap-8">
                <div className="h-[320px] w-full bg-neutral-900/50 rounded-xl p-4 border border-neutral-800 flex flex-col">
                <h3 className="text-lg font-semibold mb-2 text-center text-sky-400">
                    {t('modals.aiModal.careerPath.skillsGapTitle') || 'Skills Gap Analysis'}
                </h3>
                <div className="flex-1 w-full min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={result.radarData}>
                        <PolarGrid stroke="#404040" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#a3a3a3', fontSize: 11 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                        <Radar
                        name="Current"
                        dataKey="current"
                        stroke="#0ea5e9"
                        fill="#0ea5e9"
                        fillOpacity={0.5}
                        />
                        <Radar
                        name="Required"
                        dataKey="required"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.3}
                        />
                        <Legend />
                    </RadarChart>
                    </ResponsiveContainer>
                </div>
                </div>

                <div className="space-y-4">
                <div className="bg-neutral-900/50 rounded-xl p-6 border border-neutral-800 h-full flex flex-col">
                    <h3 className="text-lg font-semibold mb-4 text-sky-400">{t('modals.aiModal.careerPath.summaryTitle') || 'Analysis Summary'}</h3>
                    <p className="text-neutral-300 leading-relaxed flex-1">
                    {result.gapAnalysis}
                    </p>
                    <div className="mt-6 pt-6 border-t border-neutral-800">
                    <div className="text-sm text-neutral-500">
                        Target Role: <span className="text-white font-medium">{result.targetRole}</span>
                    </div>
                    </div>
                </div>
                </div>
            </div>

            {/* Learning Path Section */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold flex items-center gap-2">
                <Map className="text-sky-500" />
                {t('modals.aiModal.careerPath.learningPathTitle') || 'Recommended Learning Path'}
                </h3>
                <div className="grid gap-4">
                {result.learningPath.map((step, index) => (
                    <div key={index} className="bg-neutral-900/30 border border-neutral-800 rounded-lg p-4 flex gap-4 hover:border-sky-500/50 transition-colors">
                    <div className="flex-none flex flex-col items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-sky-900/50 text-sky-400 flex items-center justify-center font-bold border border-sky-800 shadow-[0_0_10px_rgba(14,165,233,0.2)]">
                        {step.step}
                        </div>
                        {index !== result.learningPath.length - 1 && (
                        <div className="w-0.5 h-full bg-neutral-800 min-h-[20px]" />
                        )}
                    </div>
                    <div className="flex-1 pb-2">
                        <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg text-white">{step.title}</h4>
                        <span className="text-xs px-2 py-1 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 whitespace-nowrap ml-2">
                            {step.timeline}
                        </span>
                        </div>
                        <p className="text-neutral-400 text-sm">
                        {step.description}
                        </p>
                    </div>
                    </div>
                ))}
                </div>
            </div>
            </motion.div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-neutral-500 space-y-4 opacity-50">
                <Map className="w-16 h-16 mb-2" />
                <p className="text-lg">
                    {t('modals.aiModal.careerPath.emptyState') || 'Enter a target role or let AI infer it from your resume to generate a career path plan.'}
                </p>
            </div>
        )}
      </div>
    </div>
  );
}
