
'use client';

import React from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

// Define the type for the lesson document
interface Lesson {
    id: string;
    title: string;
    content: string;
    videoUrl?: string; // Optional video URL
    order: number;
}

// Mock next/prev lesson IDs - in a real app, this would be calculated based on the course's lesson order
const mockNavigation = {
    nextLessonId: 'lesson-103',
    prevLessonId: 'lesson-101',
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const firestore = useFirestore();

  const lessonId = Array.isArray(params.lessonId) ? params.lessonId[0] : params.lessonId;
  const courseId = searchParams.get('courseId');

  const lessonDocRef = useMemoFirebase(() => {
    if (!firestore || !courseId || !lessonId) return null;
    return doc(firestore, `courses/${courseId}/lessons`, lessonId);
  }, [firestore, courseId, lessonId]);

  const { data: lesson, isLoading, error } = useDoc<Lesson>(lessonDocRef);

  const handleNavigate = (id: string | null) => {
    if (id) {
      // Pass courseId in navigation to maintain context
      router.push(`/learning-path/${id}?courseId=${courseId}`);
    }
  };

  if (isLoading) {
    return (
        <div className="min-h-screen bg-nile-dark flex items-center justify-center text-white">
            <Loader2 className="w-12 h-12 text-gold-accent animate-spin" />
            <p className="text-xl ml-4">جاري تحميل الدرس...</p>
        </div>
    );
  }

  if (error) {
     return (
        <div className="min-h-screen bg-nile-dark flex flex-col items-center justify-center text-white text-center p-4">
            <h1 className="text-3xl royal-title text-red-500 mb-4">حدث خطأ ملكي</h1>
            <p className="text-sand-ochre mb-6">لم نتمكن من جلب الدرس. قد تكون هناك مشكلة في الصلاحيات أو أن الدرس غير موجود.</p>
            <p className="text-sm text-gray-500 bg-black/20 p-2 rounded">{error.message}</p>
             <Link href="/learning-path" className="utility-button mt-8">
                العودة إلى مسار التعلم
            </Link>
        </div>
    )
  }
  
  if (!lesson) {
     return (
        <div className="min-h-screen bg-nile-dark flex flex-col items-center justify-center text-white text-center">
            <h1 className="text-3xl royal-title text-sand-ochre mb-4">الدرس غير موجود</h1>
            <p className="text-lg mb-8">عفواً، هذا الدرس غير متوفر في سجلاتنا.</p>
            <Link href="/learning-path" className="utility-button">
                العودة إلى مسار التعلم
            </Link>
        </div>
    );
  }


  return (
    <div className="min-h-screen bg-nile-dark text-white p-4 md:p-8" style={{ direction: 'rtl' }}>
      <main className="max-w-4xl mx-auto">
        <div className="dashboard-card p-6 md:p-8 rounded-2xl">
          
          <header className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold royal-title mb-3">
              {lesson.title}
            </h1>
             <Link href="/learning-path" className="text-sm text-sand-ochre hover:text-gold-accent transition-colors">
                &larr; العودة إلى مسار التعلم
            </Link>
          </header>

          {/* Video Player */}
          {lesson.videoUrl && (
            <section className="mb-8">
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-2xl border-4 border-gold-accent">
                    <iframe
                        src={lesson.videoUrl}
                        title="Lesson Video Player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                    ></iframe>
                </div>
            </section>
          )}

          {/* Lesson Content */}
          <section 
            className="prose prose-invert max-w-none text-white text-lg leading-loose" 
            dangerouslySetInnerHTML={{ __html: lesson.content }} 
          />

          {/* Navigation */}
          <footer className="mt-10 pt-6 border-t-2 border-sand-ochre/20 flex justify-between items-center">
            <Button onClick={() => handleNavigate(mockNavigation.prevLessonId)} disabled={!mockNavigation.prevLessonId} className="utility-button">
              <ArrowRight className="ml-2 h-5 w-5" />
              الدرس السابق
            </Button>
            <Button onClick={() => handleNavigate(mockNavigation.nextLessonId)} disabled={!mockNavigation.nextLessonId} className="cta-button">
              الدرس التالي
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </footer>
        </div>
      </main>
    </div>
  );
}
