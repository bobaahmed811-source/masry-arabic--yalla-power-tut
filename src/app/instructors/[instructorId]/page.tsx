'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Star, Clock, Tag, Calendar, ArrowRight, UserCheck, Languages } from 'lucide-react';

interface Instructor {
  id: string;
  teacherName: string;
  email: string;
  shortBio: string;
  lessonPrice: number;
  photo?: string;
  specialties?: string[];
  averageRating?: number;
  totalReviews?: number;
  availability?: string;
  languages?: string[];
}

// Mock schedule for demonstration purposes
const generateMockSchedule = (instructorId: string) => {
  const schedule = [];
  const today = new Date();
  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    schedule.push({
      id: `${instructorId}-slot-${i}`,
      date: date.toLocaleDateString('ar-EG', { weekday: 'long' }),
      time: `${10 + i}:00 - ${11 + i}:00`,
      available: Math.random() > 0.4,
    });
  }
  return schedule;
};


export default function InstructorProfilePage() {
  const params = useParams();
  const firestore = useFirestore();
  const instructorId = Array.isArray(params.instructorId) ? params.instructorId[0] : params.instructorId;

  const instructorDocRef = useMemoFirebase(() => {
    if (!firestore || !instructorId) return null;
    return doc(firestore, 'instructors', instructorId);
  }, [firestore, instructorId]);

  const { data: instructor, isLoading, error } = useDoc<Instructor>(instructorDocRef);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-nile-dark">
        <Loader2 className="w-16 h-16 text-gold-accent animate-spin" />
        <p className="text-sand-ochre text-2xl mr-4">جاري تحميل بيانات المعلمة...</p>
      </div>
    );
  }

  if (error || !instructor) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-nile-dark text-center p-4">
        <h2 className="text-3xl royal-title text-red-500 mb-4">خطأ ملكي!</h2>
        <p className="text-xl text-sand-ochre mb-8">لم نتمكن من العثور على سجلات هذه المعلمة. قد يكون الرابط غير صحيح.</p>
        <p className="text-sm text-gray-500 bg-black/20 p-2 rounded">{error?.message}</p>
        <Link href="/instructors" className="utility-button mt-8">
          العودة إلى قائمة المعلمات
        </Link>
      </div>
    );
  }

  const placeholder = PlaceHolderImages.find(p => p.id === `instructor-${instructor.id}`);
  const imageUrl = instructor.photo || placeholder?.imageUrl || `https://picsum.photos/seed/${instructor.id}/400/400`;
  const imageHint = placeholder?.imageHint || 'woman portrait';
  const schedule = generateMockSchedule(instructor.id);

  return (
    <div className="min-h-screen bg-nile-dark text-white p-4 md:p-8" style={{ direction: 'rtl' }}>
      <div className="max-w-5xl mx-auto">
        <header className="mb-8">
            <Link href="/instructors" className="text-sm text-sand-ochre hover:text-gold-accent transition-colors flex items-center gap-2">
                <ArrowRight className="w-4 h-4"/>
                العودة إلى كل المعلمات
            </Link>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Right Column: Instructor Info */}
          <div className="lg:col-span-1">
            <Card className="dashboard-card text-center p-6 sticky top-8">
                <Image
                    src={imageUrl}
                    alt={`صورة ${instructor.teacherName}`}
                    width={150}
                    height={150}
                    className="w-40 h-40 object-cover rounded-full mx-auto mb-4 border-4 border-gold-accent shadow-lg"
                    data-ai-hint={imageHint}
                />
                <h1 className="text-3xl royal-title mb-2">{instructor.teacherName}</h1>
                
                {instructor.averageRating && (
                    <div className="flex items-center justify-center text-sand-ochre mb-4">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-5 h-5 ${i < instructor.averageRating! ? 'text-gold-accent fill-current' : 'text-gray-600'}`} />
                        ))}
                        <span className="mr-2 text-md font-bold">({instructor.totalReviews || 0} مراجعة)</span>
                    </div>
                )}
                
                <p className="text-sand-ochre mb-6">{instructor.shortBio}</p>
                
                <div className="text-left space-y-3">
                    <div className="flex items-center gap-3"><UserCheck className="text-gold-accent"/><div><h4 className="font-bold text-gray-400 text-sm">التخصصات</h4><p className="text-white font-semibold">{instructor.specialties?.join('، ') || 'غير محدد'}</p></div></div>
                    <div className="flex items-center gap-3"><Languages className="text-gold-accent"/><div><h4 className="font-bold text-gray-400 text-sm">اللغات</h4><p className="text-white font-semibold">{instructor.languages?.join('، ') || 'العربية'}</p></div></div>
                    <div className="flex items-center gap-3"><Tag className="text-gold-accent"/><div><h4 className="font-bold text-gray-400 text-sm">السعر</h4><p className="text-white font-bold text-xl">${instructor.lessonPrice} / ساعة</p></div></div>
                </div>

                 <Button asChild className="w-full cta-button mt-6">
                    <Link href="/booking">احجز الآن مع {instructor.teacherName}</Link>
                 </Button>

            </Card>
          </div>

          {/* Left Column: Booking & Live Sessions */}
          <div className="lg:col-span-2">
            <Card className="dashboard-card p-6">
                <CardHeader>
                    <CardTitle className="text-2xl royal-title mb-4">جدول الحصص المباشرة</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sand-ochre mb-6">هذه هي المواعيد المتاحة للمعلمة خلال الأيام القادمة. اختر موعدًا وانضم إلى الدرس في وقته المحدد.</p>
                    <div className="space-y-4">
                        {schedule.map(slot => (
                            <div key={slot.id} className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${slot.available ? 'bg-nile hover:bg-sand-ochre/10 border-sand-ochre/20' : 'bg-nile-dark/50 border-gray-700/50 opacity-60'}`}>
                                <div className="flex items-center gap-4">
                                    <Calendar className="w-8 h-8 text-sand-ochre"/>
                                    <div>
                                        <p className="font-bold text-lg text-white">{slot.date}</p>
                                        <p className="text-sm text-gray-400">{slot.time}</p>
                                    </div>
                                </div>
                                <Button disabled={!slot.available} className={slot.available ? 'cta-button' : 'utility-button'}>
                                    {slot.available ? 'احجز هذه الجلسة' : 'محجوز'}
                                </Button>
                            </div>
                        ))}
                    </div>
                     <div className="mt-8 text-center p-4 bg-blue-900/40 rounded-lg border border-blue-700">
                        <h4 className="font-bold text-lg text-blue-300">هل أنت مستعد للدرس؟</h4>
                        <p className="text-blue-400 mb-4">عندما يحين وقت الدرس الذي حجزته، سيظهر لك هنا زر "الانضمام للغرفة الملكية".</p>
                        <Button disabled>
                           <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                           في انتظار وقت الدرس...
                        </Button>
                    </div>
                </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}

    