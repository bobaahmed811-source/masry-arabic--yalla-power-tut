'use client';

import React from 'react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, where } from 'firebase/firestore';
import { ArrowRight, GraduationCap, Loader2, Baby, Palette, Shuffle, Users } from 'lucide-react';

interface Instructor {
  id: string;
  teacherName: string;
  shortBio?: string;
  photo?: string;
  status?: 'Active' | 'Inactive';
  specialties?: string[];
}

const TeacherCard = ({ teacher }: { teacher: Instructor }) => (
  <div className="dashboard-card text-white p-6 rounded-2xl shadow-lg text-center transform transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-gold-accent flex flex-col">
    <div className="relative w-32 h-32 mx-auto mb-4">
      <img src={teacher.photo || `https://picsum.photos/seed/${teacher.id}/200/200`} alt={`صورة ${teacher.teacherName}`} className="rounded-full w-full h-full object-cover border-4 border-gold-accent" />
      <span 
        className={`absolute bottom-1 right-1 block h-5 w-5 rounded-full border-2 border-nile-dark ${teacher.status === 'Active' ? 'bg-green-400' : 'bg-gray-500'}`}
        title={teacher.status === 'Active' ? 'متاح' : 'غير متاح'}
      ></span>
    </div>
    <h3 className="text-xl font-bold royal-title mb-1">{teacher.teacherName}</h3>
    <p className="text-sm text-sand-ochre mb-3 flex-grow">{teacher.shortBio || 'معلم/ة أطفال'}</p>
    <button
      disabled={teacher.status !== 'Active'}
      className="w-full mt-auto cta-button"
    >
      {teacher.status === 'Active' ? 'احجز الآن' : 'غير متاح'}
    </button>
  </div>
);

const ChallengeLink = ({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title:string;
  description: string;
  icon: React.ReactNode;
}) => (
  <Link
    href={href}
    className="challenge-item group block p-6 rounded-lg transition-all duration-300"
  >
    <div className="flex items-center gap-4">
      <div className="icon-symbol text-4xl text-gold-accent w-10 flex justify-center">{icon}</div>
      <div>
        <h3 className="font-bold text-2xl text-white group-hover:text-gold-accent transition-colors">
          {title}
        </h3>
        <p className="text-md text-sand-ochre">{description}</p>
      </div>
      <ArrowRight className="mr-auto h-6 w-6 text-sand-ochre group-hover:translate-x-1 transition-transform" />
    </div>
  </Link>
);


export default function KidsCornerPage() {
  const firestore = useFirestore();
  
  const instructorsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'instructors'), where('specialties', 'array-contains', 'Children')); 
  }, [firestore]);

  const { data: teachers, isLoading, error } = useCollection<Instructor>(instructorsCollection);

  return (
    <div 
      className="min-h-screen p-4 md:p-8 flex flex-col bg-nile-dark"
      style={{
        direction: 'rtl',
      }}
    >
      <header className="text-center my-12">
        <div className="inline-block p-4 bg-nile rounded-full shadow-lg mb-4 border-2 border-gold-accent">
            <Baby className="w-12 h-12 text-white"/>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2 royal-title">
          ركن الأطفال الممتع
        </h1>
        <p className="text-xl text-sand-ochre">
          مكان مليء بالألعاب والتحديات لتعلم العامية المصرية بكل سهولة ومتعة.
        </p>
      </header>

      <main className="w-full max-w-6xl mx-auto flex-grow space-y-12">

        {/* Fun Challenges Section */}
        <section>
             <h2 className="text-4xl font-bold royal-title text-gold-accent mb-6 border-r-4 border-sand-ochre pr-4">تحديات وألعاب</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ChallengeLink
                    href="/comic-studio"
                    title="استوديو القصص المصورة"
                    description="اصنع قصصاً ملونة بصوتك."
                    icon={<Palette />}
                />
                <ChallengeLink
                    href="/word-scramble"
                    title="ألغاز الكلمات"
                    description="رتب الكلمات لتصنع جملاً مفيدة."
                    icon={<Shuffle />}
                />
             </div>
        </section>

        {/* Kids Teachers Section */}
        <section>
            <h2 className="text-4xl font-bold royal-title text-gold-accent mb-6 border-r-4 border-sand-ochre pr-4 flex items-center gap-3"><Users/> معلمو ومعلمات الأطفال</h2>
             {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="w-12 h-12 text-gold-accent animate-spin" />
                    <p className="text-center text-lg text-sand-ochre ml-4">جاري البحث عن المعلمين...</p>
                </div>
                )}
            {error && <p className="text-center text-lg text-red-400">حدث خطأ أثناء تحميل المعلمين: {error.message}</p>}
            
            {teachers && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {teachers.map(teacher => (
                <TeacherCard key={teacher.id} teacher={teacher} />
                ))}
            </div>
            )}

            {!isLoading && teachers?.length === 0 && (
                <p className="text-center text-sand-ochre py-10">لا يوجد معلمون متخصصون في تعليم الأطفال مسجلون حالياً.</p>
            )}
        </section>
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

    