import React from 'react';
import { Loader2, CheckCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/app/components/ui/button';
import { useTranslation } from 'react-i18next';
import dynamic from 'next/dynamic';
import { LogEntry } from '@/store/useResumeOptimizerStore';

const ReactMarkdown = dynamic(() => import('react-markdown'), { ssr: false });

import { EditorComponents } from '@/lib/componentOptimization';

const ReactJsonView = EditorComponents.JsonViewer;

type LogItemProps = {
  log: LogEntry;
  isLast: boolean;
  onToggleExpand: (id: string) => void;
  expandedLogId: string | null;
  onToggleContentExpand: (id: string) => void;
};

export const LogItem: React.FC<LogItemProps> = ({ log, isLast, onToggleExpand, expandedLogId, onToggleContentExpand }) => {
  const { t } = useTranslation();
  const hasChildren = log.children && log.children.length > 0;
  const isExpandable = !!log.content || hasChildren;

  const getStatusText = (log: LogEntry) => {
    if (log.id.startsWith('rewrite_') && log.status !== 'pending') {
      const key = `modals.aiModal.optimizeTab.steps.rewriting_section.${log.status}`;
      return t(key, { section: log.title });
    }
    if (log.id.startsWith('analyze_') && log.status !== 'pending') {
      const key = `modals.aiModal.optimizeTab.steps.analyzing_category.${log.status}`;
      return t(key, { category: log.title });
    }
    if (log.id.startsWith('research_') && log.status !== 'pending') {
      const key = `modals.aiModal.optimizeTab.steps.researching_topic.${log.status}`;
      return t(key, { topic: log.title });
    }
    const key = `modals.aiModal.optimizeTab.steps.${log.id}.${log.status}`;
    const translation = t(key);
    if (translation === key && log.status === 'pending') return '';
    return translation;
  }

  let contentElement = null;
  if (expandedLogId === log.id && log.content) {
    if (typeof log.content === 'object' && log.content !== null) {
      contentElement = (
        <div className="json-viewer-enhanced max-w-full overflow-hidden">
          <ReactJsonView 
            src={log.content as object} 
            theme="ocean" 
            displayDataTypes={false} 
            name={false}
            collapsed={2}
            displayObjectSize={true}
            quotesOnKeys={false}
            sortKeys={false}
            enableClipboard={false}
            style={{ 
              background: 'transparent',
              fontSize: '12px',
              lineHeight: '1.5',
              maxWidth: '100%',
              overflowWrap: 'anywhere',
              wordBreak: 'break-all'
            }}
          />
        </div>
      );
    } else {
      contentElement = (
        <div className="prose prose-sm max-w-none text-sm font-sans leading-relaxed prose-headings:text-slate-800 prose-p:text-slate-700 prose-strong:text-slate-800 prose-li:text-slate-700">
          <ReactMarkdown>
            {String(log.content)}
          </ReactMarkdown>
        </div>
      );
    }
  }

  return (
    <div className="relative w-full">
      <div className="flex items-start max-w-full">
        <div className="flex flex-col items-center mr-4 self-stretch flex-shrink-0">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center z-10 shadow-lg transition-all duration-300 ${
            log.status === 'completed' 
              ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/25' 
              : log.status === 'in_progress' 
              ? 'bg-gradient-to-r from-sky-500 to-blue-600 shadow-sky-500/25 animate-pulse' 
              : 'bg-gradient-to-r from-slate-200 to-slate-100 text-slate-600 shadow-slate-300/40 border border-slate-300'
          }`}>
            {log.status === 'in_progress' && <Loader2 size={18} className="animate-spin" />}
            {log.status === 'completed' && <CheckCircle size={18} />}
            {log.status === 'pending' && <div className="w-3 h-3 bg-slate-400 rounded-full opacity-70" />}
          </div>
          {!isLast && <div className="mt-2 w-0.5 flex-grow rounded-full bg-gradient-to-b from-slate-300 to-slate-200" />}
        </div>
        <div className="flex-1 pt-1 pb-4 min-w-0 overflow-hidden">
          <div className="flex items-center min-w-0">
            {isExpandable && (
              <div className="flex-shrink-0 w-6 flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 rounded-md text-slate-500 hover:bg-slate-100 transition-all duration-200"
                    onClick={() => hasChildren ? onToggleExpand(log.id) : onToggleContentExpand(log.id)}
                  >
                    <ChevronRight size={12} className={`transition-transform duration-300 ${(hasChildren && log.isExpanded) || expandedLogId === log.id ? 'rotate-90 text-slate-700' : 'text-slate-400'}`} />
                  </Button>
              </div>
            )}
            <h4 className={`min-w-0 truncate text-sm font-semibold text-slate-800 ${isExpandable ? 'ml-1' : ''}`}>{log.title}</h4>
          </div>
          <div className={`${isExpandable ? "pl-7" : ""} min-w-0 max-w-full overflow-hidden`}>
            <p className="mt-1 break-words text-xs leading-relaxed text-slate-500 overflow-wrap-anywhere">{getStatusText(log)}</p>

            <AnimatePresence>
              {contentElement && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginTop: -10 }}
                  animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                  exit={{ opacity: 0, height: 0, marginTop: -10 }}
                  className="mb-2"
                >
                  <div className="max-h-64 max-w-full overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-4 shadow-sm">
                    <div className="max-w-full break-words text-sm leading-relaxed text-slate-700 overflow-wrap-anywhere">
                      {contentElement}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {hasChildren && log.isExpanded && (
              <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-3 shadow-sm"
                >
                {log.children!.map((child, index) => (
                  <LogItem
                    key={child.id}
                    log={child}
                    isLast={index === log.children!.length - 1}
                    onToggleExpand={onToggleExpand}
                    expandedLogId={expandedLogId}
                    onToggleContentExpand={onToggleContentExpand}
                  />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
