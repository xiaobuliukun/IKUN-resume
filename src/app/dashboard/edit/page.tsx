import { Suspense } from 'react';
import ResumeEdit from './ResumeEdit';

export default function Page() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-slate-50 text-slate-700">Loading...</div>}>
      <ResumeEdit />
    </Suspense>
  );
}
