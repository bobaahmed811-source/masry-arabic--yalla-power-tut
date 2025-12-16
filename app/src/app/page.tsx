
'use client';

// Diagnostic comment to force a file change.

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function TemporaryHome() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-nile-dark text-white">
      <h1 className="text-4xl font-bold mb-4 royal-title">أهلاً بك في أكاديمية يلا مصري</h1>
      <p className="text-xl mb-8 text-sand-ochre">الموقع قيد التحميل... انقر للبدء</p>
      <Link href="/kids" passHref>
        <Button className="cta-button text-lg px-8 py-6">
          الدخول إلى مملكة الصغار
        </Button>
      </Link>
    </div>
  );
}
