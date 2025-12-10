'use client';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-nile-dark p-6" style={{ direction: 'rtl' }}>
      <div className="text-center">
        <h1 className="text-5xl font-black royal-title text-gold-accent mb-4">
          أكاديمية يلا مصري
        </h1>
        <p className="text-2xl text-sand-ochre mb-8">
          مرحباً بك في مملكة تعلم العامية المصرية.
        </p>
        <p className="text-white mb-4">
          إذا كنت ترى هذه الصفحة، فهذا يعني أن النشر على Vercel قد نجح!
        </p>
        <div className="space-y-4">
          <Link href="/landing" className="block">
            <span className="utility-button px-8 py-3 text-lg font-bold rounded-full inline-block">
              اكتشف الأكاديمية (صفحة الهبوط)
            </span>
          </Link>
          <Link href="/login" className="block">
            <span className="cta-button px-8 py-3 text-lg font-bold rounded-full inline-block">
              تسجيل الدخول
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
