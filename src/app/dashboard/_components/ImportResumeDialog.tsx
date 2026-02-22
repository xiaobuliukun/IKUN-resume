import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { useResumeStore, Resume } from '@/store/useResumeStore';
import { toast } from 'sonner';
import { FaFileUpload } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

type ImportResumeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ImportResumeDialog({ open, onOpenChange }: ImportResumeDialogProps) {
  const { addResume } = useResumeStore();
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [showExample, setShowExample] = useState(false);

  const exampleJson = {
    "info": {
      "fullName": "Your Name",
      "email": "email@example.com",
      "headline": "Job Title"
    },
    "sections": {
      "summary": [],
      "experience": [],
      "education": [],
      "skills": [],
      "projects": []
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onabort = () => toast.error(t('importDialog.errors.fileReadAborted'));
    reader.onerror = () => toast.error(t('importDialog.errors.fileReadFailed'));
    reader.onload = () => {
      try {
        const result = JSON.parse(reader.result as string);

        // Basic validation
        if (typeof result === 'object' && result !== null && 'info' in result && 'sections' in result) {
          const newResume: Resume = {
            ...result,
            id: Date.now().toString(),
            name: t('importDialog.importedName', { name: result.name || 'Imported Resume' }),
            updatedAt: Date.now(),
          };
          addResume(newResume);
          toast.success(t('importDialog.success'));
          onOpenChange(false);
        } else {
          throw new Error(t('importDialog.errors.invalidFormat'));
        }
      } catch (e) {
        const message = e instanceof Error ? e.message : t('importDialog.errors.parseFailed');
        toast.error(message);
        setError(message);
      }
    };
    reader.readAsText(file);
  }, [addResume, onOpenChange, t]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/json': ['.json'] },
    multiple: false,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='text-white'>{t('importDialog.title')}</DialogTitle>
          <DialogDescription>
            {t('importDialog.description')}
          </DialogDescription>
        </DialogHeader>

        <div
          {...getRootProps()}
          className={`mt-4 border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-sky-500 bg-sky-500/10' : 'border-neutral-700 hover:border-sky-600'}
          `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center text-neutral-400">
            <FaFileUpload className="w-12 h-12 mb-4" />
            {isDragActive ? (
              <p>{t('importDialog.dropzone.active')}</p>
            ) : (
              <p>{t('importDialog.dropzone.default')}</p>
            )}
            <p className="text-xs mt-1">{t('importDialog.dropzone.jsonOnly')}</p>
          </div>
        </div>
        
        <div className="flex justify-end mt-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-transparent hover:bg-neutral-800 text-xs text-neutral-400 hover:text-white"
            onClick={() => setShowExample(!showExample)}
          >
            {showExample ? t('importDialog.hideExample') : t('importDialog.showExample')}
          </Button>
        </div>
        
        {showExample && (
          <div className="mt-2 p-3 bg-neutral-950 rounded-md border border-neutral-800 overflow-auto max-h-60 text-left">
            <pre className="text-xs text-neutral-300 font-mono">
              {JSON.stringify(exampleJson, null, 2)}
            </pre>
          </div>
        )}
        
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <DialogFooter className="mt-4">
          <Button 
            variant="outline" 
            className="bg-transparent border-neutral-700 hover:bg-neutral-800 text-neutral-300 hover:text-white"
            onClick={() => onOpenChange(false)}
          >
            {t('importDialog.cancel')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 