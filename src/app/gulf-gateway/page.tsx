'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { ArrowRight, BookCopy, Car, Loader2, ShoppingBasket, Building2 } from 'lucide-react';
import Image from 'next/image';

interface AdventureChallenge {
  id: string;
  gulf_phrase: string;
  egyptian_phrase: string;
  explanation?: string;
  category: string;
}

const STOPS = [
    { 
        id: 'taxi',
        title: 'المحطة الأولى: حوار مع سائق التاكسي', 
        description: 'تتعلم نوف كيف تطلب وتتفاهم مع سائقي الأجرة في شوارع القاهرة.',
        icon: Car, 
        category: 'المواصلات'
    },
    { 
        id: 'market',
        title: 'المحطة الثانية: مساومات في خان الخليلي', 
        description: 'تخوض نوف مغامرة الشراء والمساومة في أشهر أسواق مصر.',
        icon: ShoppingBasket, 
        category: 'في السوق'
    },
    { 
        id: 'restaurant',
        title: 'المحطة الثالثة: طلبات في مطعم كشري',
        description: 'تكتشف نوف طريقة طلب الأطباق المصرية الأصيلة.',
        icon: Building2,
        category: 'الطعام والشراب'
    },
];

const groupChallengesByCategory = (challenges: AdventureChallenge[] | null) => {
    if (!challenges) return {};
    return challenges.reduce((acc, challenge) => {
        const category = challenge.category || 'مصطلحات عامة';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(challenge);
        return acc;
    }, {} as Record<string, AdventureChallenge[]>);
};

export default function NoufsJourneyPage() {
  const firestore = useFirestore();

  const adventureCollection = useMemoFirebase(() => {
    return firestore ? collection(firestore, 'adventure_challenges') : null;
  }, [firestore]);

  const { data: challenges, isLoading, error } = useCollection<AdventureChallenge>(adventureCollection);

  const challengesByStop = useMemo(() => groupChallengesByCategory(challenges), [challenges]);

  return (
    <div 
      className="min-h-screen p-4 md:p-8 flex flex-col bg-nile-dark"
      style={{ direction: 'rtl' }}
    >
      <header className="text-center my-12 relative">
        <div className="flex flex-col items-center justify-center">
            <div className="relative mb-4">
                <Image
                    src="https://picsum.photos/seed/nouf-avatar/200/200"
                    alt="شخصية نوف الكرتونية"
                    width={120}
                    height={120}
                    className="rounded-full border-4 border-gold-accent shadow-lg"
                    data-ai-hint="saudi girl cartoon"
                />
                 <span className="absolute -bottom-2 -right-2 text-4xl">🇸🇦</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2 royal-title">
              رحلة نوف في مصر
            </h1>
            <p className="text-xl text-sand-ochre max-w-2xl mx-auto">
              انضمي إلى نوف، فتاة سعودية شجاعة، في مغامرتها لاستكشاف اللهجة المصرية. في كل محطة، ستواجه تحديات لغوية جديدة وتتعلم كيف تتواصل كأهل البلد.
            </p>
        </div>
      </header>

      <main className="w-full max-w-4xl mx-auto flex-grow">
        {isLoading && (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-12 h-12 text-gold-accent animate-spin" />
                <p className="text-center text-lg text-sand-ochre ml-4">جاري تحضير محطات رحلة نوف...</p>
            </div>
        )}
        {error && <p className="text-center text-lg text-red-400">حدث خطأ أثناء تحميل الرحلة: {error.message}</p>}

        {!isLoading && challenges && (
          <div className="space-y-12">
            {STOPS.map((stop, index) => {
                const stopChallenges = challengesByStop[stop.category] || [];
                return (
                    <section key={stop.id}>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex-shrink-0 bg-gold-accent text-nile-dark p-3 rounded-full shadow-md">
                                <stop.icon className="w-8 h-8" />
                            </div>
                            <div>
                               <h2 className="text-3xl font-bold royal-title text-gold-accent">{stop.title}</h2>
                               <p className="text-sand-ochre">{stop.description}</p>
                            </div>
                        </div>

                        {stopChallenges.length > 0 ? (
                        <div className="space-y-4">
                            {stopChallenges.map(challenge => (
                                <div key={challenge.id} className="dashboard-card p-5 rounded-lg border-l-4 border-gold-accent/50">
                                    <div className="grid grid-cols-2 gap-4 items-center">
                                        <div className="text-center">
                                            <p className="text-sm text-sand-ochre font-bold">نوف تقول (بالخليجي)</p>
                                            <p className="text-2xl font-bold text-white">{challenge.gulf_phrase}</p>
                                        </div>
                                        <div className="text-center border-r-2 border-sand-ochre/20">
                                            <p className="text-sm text-sand-ochre font-bold">المرادف المصري</p>
                                            <p className="text-2xl font-bold text-white">{challenge.egyptian_phrase}</p>
                                        </div>
                                    </div>
                                    {challenge.explanation && (
                                        <div className="mt-4 pt-3 border-t border-sand-ochre/20">
                                            <p className="text-sm text-gray-300"><strong className="text-gold-accent flex items-center gap-1"><BookCopy size={14}/> توضيح اللهجة:</strong> {challenge.explanation}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        ) : (
                            <div className="dashboard-card p-5 rounded-lg text-center">
                                 <p className="text-sand-ochre">لم تصل رحلة نوف إلى هذه المحطة بعد. أضف تحديات من ديوان الإدارة!</p>
                            </div>
                        )}
                    </section>
                )
            })}
          </div>
        )}
      </main>

      <footer className="mt-auto pt-12 text-center text-gray-400 text-sm">
         <Link href="/" className="utility-button px-6 py-2 text-md font-bold rounded-lg flex items-center justify-center mx-auto w-fit">
            <ArrowRight className="ml-2 h-4 w-4" />
            <span>العودة للوحة التحكم الرئيسية</span>
        </Link>
        <p className="mt-4">جميع الحقوق محفوظة لأكاديمية يلا مصري © 2024</p>
      </footer>
    </div>
  );
}
