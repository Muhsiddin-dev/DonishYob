import { Suspense } from 'react';
import VerifyEmailClient from './VerifyEmailClient';

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="max-w-md mx-auto text-center">
      <div className='animate-spin border-t-2 rounded-full w-10 h-10 text-center text-blue-700'></div>
    </div>}>
      <VerifyEmailClient />
    </Suspense>
  );
}