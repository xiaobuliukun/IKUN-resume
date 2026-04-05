"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/app/components/ui/card';
import { FaPlus, FaDownload, FaRegClone, FaEdit, FaTrash } from 'react-icons/fa';
import { Resume } from '@/store/useResumeStore';
import { formatTime } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/app/components/ui/dropdown-menu';
import { FiMoreVertical } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

type ResumeListProps = {
  resumes: Resume[];
  onAdd: () => void;
  onImport: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRename: (resume: Resume) => void;
};

function ResumeCard({ 
  resume, 
  onDelete,
  onDuplicate,
  onRename,
}: { 
  resume: Resume, 
  onDelete: (id: string) => void,
  onDuplicate: (id: string) => void,
  onRename: (resume: Resume) => void,
}) {
  const { t } = useTranslation();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (resume.snapshot instanceof Blob) {
      const url = URL.createObjectURL(resume.snapshot);
      setImageUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [resume.snapshot]);

  return (
    <motion.div
      key={resume.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <Card className="group relative flex h-64 cursor-pointer flex-col justify-between overflow-hidden border-slate-200 bg-white hover:border-sky-200 hover:shadow-md">
        <Link href={`/dashboard/edit?id=${resume.id}`} className="block w-full h-full">
          <div className="relative w-full h-full">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={resume.name}
                layout="fill"
                objectFit="contain"
                className="opacity-50 group-hover:opacity-75 transition-opacity duration-300"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-slate-100">
                <FaRegClone className="text-4xl text-slate-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/75 to-transparent" />
            
            <CardFooter className="absolute bottom-0 left-0 w-full p-4 z-10">
              <div>
                <div className="truncate text-base font-semibold text-slate-900 transition-colors group-hover:text-sky-700">{resume.name}</div>
                <div className="mt-1 text-xs text-slate-500">{t('dashboard.resumeCard.lastUpdated', { time: formatTime(resume.updatedAt) })}</div>
              </div>
            </CardFooter>
          </div>
        </Link>
        
        <div className="absolute top-2 right-2 z-20">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button 
                whileHover={{ scale: 1.2 }}
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 shadow-sm transition-colors hover:bg-slate-50 focus:outline-none"
                onClick={e => e.stopPropagation()}
              >
                <FiMoreVertical />
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={e => e.stopPropagation()} side="bottom" align="end" className='border-slate-200 bg-white text-slate-700'>
              <DropdownMenuItem onClick={() => onRename(resume)} className='cursor-pointer'>
                <FaEdit className="mr-2" />
                {t('dashboard.resumeCard.rename')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(resume.id)} className='cursor-pointer'>
                <FaRegClone className="mr-2" />
                {t('dashboard.resumeCard.duplicate')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(resume.id)} className='cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10'>
                <FaTrash className="mr-2" />
                {t('dashboard.resumeCard.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  );
}

import { Skeleton } from '@/app/components/ui/Skeleton';

function ResumeListSkeleton() {
  return (
    <div className="flex-1 flex flex-col px-12 py-10 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <Skeleton className="h-10 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function ResumeList({ resumes, onAdd, onImport, onDelete, onDuplicate, onRename }: ResumeListProps) {
  const { t } = useTranslation();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <ResumeListSkeleton />;
  }

  return (
    <div className="flex-1 flex flex-col px-12 py-10 overflow-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold">{t('dashboard.title')}</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {/* 新建简历卡片 */}
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
          <Card className="group cursor-pointer h-64 flex flex-col items-center justify-center relative overflow-hidden" onClick={onAdd}>
            <CardContent className="flex-1 flex flex-col items-center justify-center">
              <FaPlus className="mb-2 text-4xl text-slate-400 transition group-hover:text-sky-600" />
              <div className="text-lg font-semibold text-slate-800">{t('dashboard.newResumeCard.title')}</div>
              <div className="mt-1 text-xs text-slate-500">{t('dashboard.newResumeCard.description')}</div>
            </CardContent>
          </Card>
        </motion.div>
        {/* 导入简历卡片 */}
        <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.98 }}>
          <Card className="group cursor-pointer h-64 flex flex-col items-center justify-center relative overflow-hidden" onClick={onImport}>
            <CardContent className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 transition-colors group-hover:bg-sky-50">
                <FaDownload className="text-3xl text-slate-500 transition-colors group-hover:text-sky-600" />
              </div>
              <div className="text-lg font-semibold text-slate-800">{t('dashboard.importResumeCard.title')}</div>
              <div className="mt-1 text-sm text-slate-500">{t('dashboard.importResumeCard.description')}</div>
            </CardContent>
          </Card>
        </motion.div>
        {/* 简历卡片列表 */}
        <AnimatePresence>
          {resumes.map(resume => (
            <ResumeCard 
              key={resume.id} 
              resume={resume} 
              onDelete={onDelete}
              onDuplicate={onDuplicate}
              onRename={onRename}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 
