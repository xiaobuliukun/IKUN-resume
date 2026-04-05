"use client";

import React, { useRef } from 'react';
import ResumePreview from './ResumePreview';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { Resume } from '@/store/useResumeStore';
import useMobile from '@/app/hooks/useMobile';
import { Tools } from './Tools';
import AiThinkingOverlay from './AiThinkingOverlay';
import { useReactToPrint } from 'react-to-print';

interface ResumePreviewPanelProps {
  activeResume: Resume | null;
  previewScale: number;
  setPreviewScale: (scale: number) => void;
  onShowAI: () => void;
  isAiJobRunning: boolean;
  rightCollapsed?: boolean; // 新增：模板栏是否收起
}

const ResumePreviewPanel: React.FC<ResumePreviewPanelProps> = ({
  activeResume,
  setPreviewScale,
  onShowAI,
  isAiJobRunning,
  rightCollapsed = false
}) => {
  const { isMobile } = useMobile();
  const resumeRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: resumeRef,
    documentTitle: activeResume?.name || 'Resume',
  });

  if (!activeResume) {
    return (
      <section className="relative flex max-h-screen flex-1 items-center justify-center overflow-hidden bg-slate-100">
        <div className="text-slate-600">Loading...</div>
      </section>
    );
  }

  return (
    <section
      className="relative flex max-h-screen flex-1 items-center justify-center overflow-hidden bg-slate-100"
    >
      <TransformWrapper
        initialScale={0.6}
        minScale={0.5}
        maxScale={2}
        limitToBounds={false}
        onTransformed={(_ref, state) => setPreviewScale(state.scale)}
        onInit={(controls) => controls.centerView(0.5, 0)}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '100%',maxHeight: '100vh' }}
              contentStyle={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', width: '100%', height: '100%', paddingTop: '5rem', paddingBottom: '5rem' }}
            >
              <div className="relative">
                <ResumePreview 
                  ref={resumeRef}
                  info={activeResume.info} 
                  sections={activeResume.sections} 
                  sectionOrder={activeResume.sectionOrder.map(s => s.key)} 
                  templateId={activeResume.template}
                  customTemplate={activeResume.customTemplate}
                />
                <AiThinkingOverlay 
                  isVisible={isAiJobRunning} 
                  themeColor={activeResume.themeColor || '#38bdf8'}
                />
              </div>
            </TransformComponent>

            <Tools 
              isMobile={isMobile} 
              zoomIn={zoomIn} 
              zoomOut={zoomOut} 
              resetTransform={resetTransform} 
              info={activeResume.info} 
              onShowAI={onShowAI} 
              rightCollapsed={rightCollapsed}
              templateId={activeResume.template}
              customTemplate={activeResume.customTemplate}
              onExport={() => handlePrint && handlePrint()}
            />
          </>
        )}
      </TransformWrapper>
    </section>
  );
};

export default ResumePreviewPanel; 
