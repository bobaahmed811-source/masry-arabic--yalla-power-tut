'use client';

import React from 'react';
import Link from 'next/link';

// Mock data for teachers
const mockTeachers = [
  { id: 1, name: 'الشيخ أيمن سويد', specialty: 'أحكام التجويد والقراءات العشر', photo: 'https://picsum.photos/seed/ayman-swid/200/200', available: true, rate: 45 },
  { id: 2, name: 'الأستاذة فاطمة علي', specialty: 'تحفيظ وتثبيت القرآن الكريم للسيدات', photo: 'https://picsum.photos/seed/fatima-ali/200/200', available: true, rate: 40 },
  { id: 3, name: 'الشيخ محمد العريفي', specialty: 'تفسير وتدبر آيات القرآن الكريم', photo: 'https://picsum.photos/seed/al-arifi/200/200', available: false, rate: 50 },
  { id: 4, name: 'الأستاذ أحمد السيد', specialty: 'تصحيح التلاوة للمبتدئين والأطفال', photo: 'https://picsum.photos/seed/ahmed-sayed/200/200', available: true, rate: 35 },
];

const TeacherCard = ({ teacher }: { teacher: (typeof mockTeachers)[0] }) => (
  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/20 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
    <div className="relative w-32 h-32 mx-auto mb-4">
      <img src={teacher.photo} alt={`صورة ${teacher.name}`} className="rounded-full w-full h-full object-cover border-4 border-teal-400" />
      {teacher.available && (
        <span className="absolute bottom-1 right-1 block h-5 w-5 rounded-full bg-green-500 border-2 border-white/50"></span>
      )}
    </div>
    <h3 className="text-xl font-bold text-white mb-1">{teacher.name}</h3>
    <p className="text-sm text-teal-300 mb-3">{teacher.specialty}</p>
    <div className="text-lg font-bold text-white mb-4">{teacher.rate}$ / ساعة</div>
    <button
      disabled={!teacher.available}
      className="w-full py-2 bg-teal-500 text-white font-bold rounded-lg hover:bg-teal-600 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
    >
      {teacher.available ? 'احجز الآن' : 'غير متاح'}
    </button>
  </div>
);

export default function TeachersPage() {
  return (
    <div 
      className="min-h-screen p-4 md:p-8 flex flex-col"
      style={{
        direction: 'rtl',
        background: 'linear-gradient(to bottom, #011C2A, #023436)',
      }}
    >
      <header className="text-center my-12">
        <div className="inline-block p-4 bg-white/10 rounded-full shadow-lg mb-4">
            <i className="fas fa-chalkboard-teacher text-5xl text-white"></i>
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-2" style={{ fontFamily: "'El Messiri', sans-serif" }}>
          نخبة معلمي القرآن
        </h1>
        <p className="text-xl text-gray-300">
          اختر من بين أفضل المعلمين والمعلمات لبدء رحلتك مع القرآن.
        </p>
      </header>

      <main className="w-full max-w-6xl mx-auto flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockTeachers.map(teacher => (
            <TeacherCard key={teacher.id} teacher={teacher} />
          ))}
        </div>
      </main>

      <footer className="mt-auto pt-12 text-center text-gray-400 text-sm">
         <Link href="/quran" className="utility-button px-6 py-2 text-md font-bold rounded-lg flex items-center justify-center bg-white/10 border-gray-400/50 text-white hover:bg-white/20 mx-auto w-fit">
            <i className="fas fa-arrow-right ml-2"></i>
            <span>العودة إلى واحة القرآن</span>
        </Link>
        <p className="mt-4">جميع الحقوق محفوظة لأكاديمية يلا مصري © 2024</p>
      </footer>
    </div>
  );
}
