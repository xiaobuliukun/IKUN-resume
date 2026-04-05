import React, { useState, useEffect } from 'react';
import { Resume, Section, useResumeStore } from '@/store/useResumeStore';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/app/components/ui/textarea';
import { Button } from '@/app/components/ui/button';
import { Paperclip, Wand2, Loader2, CheckCircle, Eye, Code } from 'lucide-react';
import { LogItem } from './LogItem';
import { useResumeOptimizer } from '@/app/hooks/useResumeOptimizer';
import ResumePreview from '../ResumePreview';
import { trackEvent } from '@/app/components/Analytics';
import { toast } from 'sonner';

import { EditorComponents } from '@/lib/componentOptimization';

const ReactJsonView = EditorComponents.JsonViewer;

type OptimizeTabProps = {
  resumeData: Resume;
  onApplyChanges: (newSections: Section) => void;
  templateId: string;
  isAiJobRunning: boolean;
  setIsAiJobRunning: (isRunning: boolean) => void;
};

export default function OptimizeTab({ resumeData, onApplyChanges, templateId, isAiJobRunning, setIsAiJobRunning }: OptimizeTabProps) {
  const { t } = useTranslation();
  const [isPreview, setIsPreview] = useState(false);
  const { saveResume } = useResumeStore();
  
  const {
    isLoading,
    logs,
    optimizedResume,
    expandedLogId,
    runOptimization,
    toggleExpand,
    setExpandedLogId,
    setJd,
    jd
  } = useResumeOptimizer();

  useEffect(() => {
    setIsAiJobRunning(isLoading);
  }, [isLoading, setIsAiJobRunning]);

  const handleOptimize = () => {
    setIsPreview(false);
    
    // 追踪AI优化使用
    trackEvent('ai_optimization_started', {
      feature: 'resume_optimize',
      user_action: 'optimize_button_click'
    });
    
    runOptimization({ jd, resumeData });
  };
  
  const handleApply = async () => {
    if (optimizedResume) {
      // 追踪优化结果应用
      trackEvent('ai_optimization_applied', {
        feature: 'resume_optimize',
        sections_optimized: Object.keys(optimizedResume.sections || {}).length
      });
      
      // 1. 更新内存状态
      onApplyChanges(optimizedResume.sections);

      // 2. 强制保存到数据库
      if (resumeData.id) {
        // 使用 setTimeout 确保 onApplyChanges 的状态更新已完成（虽然 Zustand 是同步的，但这能让 UI 渲染更平滑）
        setTimeout(async () => {
            if (resumeData.id) {
              await saveResume();
              toast.success("优化结果已应用并自动保存！");
            }
        }, 100);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full mt-3">
      {/* 左侧输入区域 */}
      <div className="lg:col-span-2 space-y-4 flex flex-col">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <label htmlFor="jd" className="mb-3 flex items-center text-base font-bold text-slate-800">
            <div className="w-6 h-6 bg-gradient-to-r from-sky-500 to-blue-600 rounded-md flex items-center justify-center mr-2">
              <Paperclip size={14} className="text-white"/>
            </div>
            {t('modals.aiModal.optimizeTab.jdLabel')}
          </label>
          <Textarea
            id="jd"
            disabled={isAiJobRunning}
            value={jd}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJd(e.target.value)}
            placeholder={t('modals.aiModal.optimizeTab.jdPlaceholder')}
            className="h-88 resize-none rounded-lg border-slate-300 bg-white text-sm leading-relaxed transition-all duration-200 hover:border-slate-400 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/50"
          />
        </div>
        
        <Button 
          onClick={handleOptimize} 
          disabled={isAiJobRunning} 
          className="optimize-button w-full h-10 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-semibold mt-auto rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span className="text-sm">{t('modals.aiModal.optimizeTab.optimizingButton')}</span>
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              <span className="text-sm">{t('modals.aiModal.optimizeTab.optimizeButton')}</span>
            </>
          )}
        </Button>
      </div>

      {/* 右侧输出区域 */}
      <div className="lg:col-span-3 flex h-[62vh] flex-col rounded-lg border border-slate-200 bg-white shadow-sm">
         <div className="flex items-center justify-between rounded-t-lg border-b border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-green-500/25">
                <CheckCircle size={16} className="text-white"/>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {t('modals.aiModal.optimizeTab.outputTitle')}
                </h3>
                {optimizedResume && (
                  <p className="mt-0.5 text-xs text-slate-500">
                    优化完成，共处理 {Object.keys(optimizedResume.sections || {}).length} 个章节
                  </p>
                )}
              </div>
            </div>
            {optimizedResume && (
              <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 shadow-sm">
                <Button 
                  size="sm" 
                  onClick={() => setIsPreview(false)} 
                  className={`px-3 py-2 h-auto text-xs font-medium rounded-md transition-all duration-200 ${
                    !isPreview 
                      ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-500/25' 
                      : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <Code size={14} className="mr-1"/>{t('modals.aiModal.optimizeTab.jsonButton')}
                </Button>
                <Button 
                  size="sm" 
                  onClick={() => setIsPreview(true)} 
                  className={`px-3 py-2 h-auto text-xs font-medium rounded-md transition-all duration-200 ${
                    isPreview 
                      ? 'bg-gradient-to-r from-sky-600 to-blue-700 text-white shadow-md shadow-sky-500/25' 
                      : 'bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <Eye size={14} className="mr-1"/>{t('modals.aiModal.optimizeTab.previewButton')}
                </Button>
              </div>
            )}
         </div>

        <div className="flex flex-1 flex-col overflow-y-auto bg-slate-50">
          {isLoading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-4">
              <div className="w-full overflow-hidden rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
                {logs.map((log, index) => (
                  <LogItem
                    key={log.id}
                    log={log}
                    isLast={index === logs.length - 1}
                    onToggleExpand={toggleExpand}
                    expandedLogId={expandedLogId}
                    onToggleContentExpand={(id) => setExpandedLogId(expandedLogId === id ? null : id)}
                  />
                ))}
              </div>
            </div>
          ) : !isLoading && !optimizedResume ? (
            <div className="flex flex-1 flex-col items-center justify-center p-6 text-center text-slate-500">
              <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="w-12 h-12 bg-gradient-to-r from-sky-500/20 to-blue-600/20 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <Wand2 size={24} className="text-sky-400" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-slate-800">{t('modals.aiModal.optimizePlaceholder.title')}</h3>
                <p className="max-w-xs text-sm leading-relaxed text-slate-500">{t('modals.aiModal.optimizePlaceholder.description')}</p>
              </div>
            </div>
          ) : (
            optimizedResume && (
            isPreview ? (
              <div className="p-3 bg-white/95 h-full w-full flex justify-center overflow-y-auto backdrop-blur-sm">
                <div style={{ transform: 'scale(0.5)', transformOrigin: 'top center', minWidth: '600px' }}>
                  <ResumePreview
                    info={optimizedResume.info}
                    sections={optimizedResume.sections}
                    sectionOrder={optimizedResume.sectionOrder.map(s => s.key)}
                    templateId={templateId}
                  />
                </div>
              </div>
            ) : (
                <div className="h-full overflow-y-auto bg-slate-50 p-3">
                  <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="json-viewer-enhanced">
                      <ReactJsonView
                        src={optimizedResume}
                        theme="ocean"
                        displayDataTypes={false}
                        name={false}
                        collapsed={1}
                        displayObjectSize={true}
                        displayArrayKey={true}
                        style={{ 
                          background: 'transparent',
                          fontSize: '12px',
                          lineHeight: '1.5'
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>

        {optimizedResume && !isLoading && (
          <div className="rounded-b-lg border-t border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center text-xs text-slate-500">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                优化结果已准备就绪
              </div>
              <div className="text-xs text-slate-500">
                点击应用将更新您的简历
              </div>
            </div>
            <Button 
              onClick={handleApply} 
              className="apply-changes-button w-full h-10 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              <span className="text-sm">{t('modals.aiModal.optimizeTab.applyChangesButton')}</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
