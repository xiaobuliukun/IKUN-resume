import React, { useState } from 'react';
import { Bot, Wand2, BarChart3, BotMessageSquare, Map, Mic, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Resume, Section } from '@/store/useResumeStore';
import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import OptimizeTab from './AiLab/OptimizeTab';
import AnalyzeTab from './AiLab/AnalyzeTab';
import CreateTab from './AiLab/CreateTab';
import CareerPathTab from './AiLab/CareerPathTab';
import MockInterviewTab from './AiLab/MockInterviewTab';
import CoverLetterTab from './AiLab/CoverLetterTab';

type AIModalProps = {
  isOpen: boolean;
  onClose: () => void;
  resumeData: Resume;
  onApplySectionChanges: (newSections: Section) => void;
  onApplyFullResume: (newResume: Resume) => void;
  templateId: string;
  isAiJobRunning: boolean;
  setIsAiJobRunning: (isRunning: boolean) => void;
};

const TABS_CONFIG = [
  { key: 'create', name: 'modals.aiModal.tabs.create', icon: <BotMessageSquare size={18} /> }, 
  { key: 'optimize', name: 'modals.aiModal.tabs.optimize', icon: <Wand2 size={18} /> },
  { key: 'analyze', name: 'modals.aiModal.tabs.analyze', icon: <BarChart3 size={18} /> },
  { key: 'career-path', name: 'modals.aiModal.tabs.careerPath', icon: <Map size={18} /> },
  { key: 'mock-interview', name: 'modals.aiModal.tabs.mockInterview', icon: <Mic size={18} /> },
  { key: 'cover-letter', name: 'modals.aiModal.tabs.coverLetter', icon: <Mail size={18} /> },
];


export default function AIModal({ 
    isOpen, 
    onClose, 
    resumeData, 
    onApplySectionChanges,
    onApplyFullResume, 
    templateId, 
    isAiJobRunning, 
    setIsAiJobRunning 
}: AIModalProps) {
  const { t } = useTranslation();
  const [activeTabKey, setActiveTabKey] = useState(TABS_CONFIG[0].key);

  const handleApplySectionAndClose = (newSections: Section) => {
    onApplySectionChanges(newSections);
    onClose();
  };

  const handleApplyFullResumeAndClose = (newResume: Resume) => {
    onApplyFullResume(newResume);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex h-[84vh] max-w-4xl flex-col p-0 focus:outline-none">
        <DialogHeader className="border-b border-slate-200 p-4 pb-4">
          <DialogTitle className="flex items-center text-xl">
            <Bot className="mr-3 text-sky-400" size={28}/>
            {t('modals.aiModal.title')}
          </DialogTitle>
          <DialogDescription className="text-slate-500">
            {t('modals.aiModal.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex gap-4 border-b border-slate-200 bg-slate-50 px-6">
            {TABS_CONFIG.map(tab => (
              <button
                key={tab.key}
                onClick={() => !isAiJobRunning && setActiveTabKey(tab.key)}
                disabled={isAiJobRunning}
                className={`flex items-center gap-2 px-1 pb-3 pt-2 text-sm font-medium transition-colors relative -bottom-px ${
                  activeTabKey === tab.key
                    ? 'border-b-2 border-sky-500 text-sky-700'
                    : 'text-slate-500 hover:text-slate-900'
                } ${isAiJobRunning ? 'cursor-not-allowed opacity-60' : ''}`}
              >
                {tab.icon}
                {t(tab.name)}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTabKey}
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="px-6 flex flex-col"
              >
                {activeTabKey === 'create' && (
                  <CreateTab 
                    onApplyChanges={handleApplyFullResumeAndClose}
                    isAiJobRunning={isAiJobRunning}
                    setIsAiJobRunning={setIsAiJobRunning}
                  />
                )}
                {activeTabKey === 'optimize' && (
                  <OptimizeTab 
                    resumeData={resumeData}
                    onApplyChanges={handleApplySectionAndClose}
                    templateId={templateId}
                    isAiJobRunning={isAiJobRunning}
                    setIsAiJobRunning={setIsAiJobRunning}
                  />
                )}
                {activeTabKey === 'analyze' && (
                  <AnalyzeTab 
                    resumeData={resumeData}
                    isAiJobRunning={isAiJobRunning}
                    setIsAiJobRunning={setIsAiJobRunning}
                  />
                )}
                {activeTabKey === 'career-path' && (
                  <CareerPathTab 
                    resumeData={resumeData}
                    isAiJobRunning={isAiJobRunning}
                    setIsAiJobRunning={setIsAiJobRunning}
                  />
                )}
                {activeTabKey === 'mock-interview' && (
                  <MockInterviewTab 
                    resumeData={resumeData}
                    isAiJobRunning={isAiJobRunning}
                    setIsAiJobRunning={setIsAiJobRunning}
                  />
                )}
                {activeTabKey === 'cover-letter' && (
                  <CoverLetterTab 
                    resumeData={resumeData}
                    isAiJobRunning={isAiJobRunning}
                    setIsAiJobRunning={setIsAiJobRunning}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
