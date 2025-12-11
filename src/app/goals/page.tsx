'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Users, LineChart, Map, Ankh, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import Link from 'next/link';

export default function GoalsPage() {
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { user, firestore, isUserLoading } = useUser(true);

  const handleSelectGoal = (goal: string) => {
    setSelectedGoal(goal);
  };

  const handleNextStep = async () => {
    if (!selectedGoal) {
        toast({
            variant: 'destructive',
            title: 'لم يتم تحديد الهدف',
            description: 'يرجى اختيار هدف واحد على الأقل للمتابعة.'
        });
        return;
    }
    
    if (!user || !firestore) {
         toast({
            variant: 'destructive',
            title: 'خطأ',
            description: 'يجب تسجيل الدخول لحفظ الهدف. جاري إعادة التحميل...'
        });
        return;
    }

    setIsSubmitting(true);
    
    try {
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, {
            goal: selectedGoal
        });
        
        // AI-powered toast message
        const goalText = {
            social: "هدف رائع! ستكونين نجمة الجلسات الاجتماعية.",
            business: "طموح ملكي! ستتفوقين في عالم الأعمال بالعامية المصرية.",
            travel: "مغامرة مثيرة! ستتحدثين بثقة في كل شوارع مصر.",
            academic: "مسعى العلماء! ستغوصين في أعماق كنوز المعرفة."
        }[selectedGoal] || "تم تسجيل هدفك بنجاح.";

        toast({
            title: 'هدف نبيل!',
            description: ` يا ${user.displayName || 'ملكة'}, ${goalText} مرحباً بك في رحلتك الملكية!`,
        });
        
        router.push('/');

    } catch (error) {
        console.error("Error updating goal:", error);
        toast({
            variant: 'destructive',
            title: 'فشل حفظ الهدف',
            description: 'حدث خطأ أثناء حفظ هدفك. يرجى المحاولة مرة أخرى.'
        });
        setIsSubmitting(false);
    }
  };

  if (isUserLoading) {
    return (
       <div className="antialiased flex items-center justify-center min-h-screen bg-nile-dark p-4">
         <Loader2 className="h-12 w-12 text-gold-accent animate-spin" />
       </div>
    )
  }

  if (!user) {
    return (
       <div className="antialiased flex flex-col items-center justify-center min-h-screen bg-nile-dark p-4 text-center">
            <h1 className="text-3xl royal-title text-red-400 mb-4">الدخول محظور</h1>
            <p className="text-sand-ochre mb-6">يجب تسجيل الدخول للوصول إلى هذه القاعة.</p>
            <Link href="/login">
                <Button className="cta-button">العودة إلى بوابة الدخول</Button>
            </Link>
       </div>
    )
  }


  return (
    <div className="antialiased flex items-center justify-center min-h-screen bg-nile-dark p-4">
      <div className="max-w-4xl mx-auto p-8 bg-white rounded-2xl shadow-2xl dashboard-card text-white">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-dark-granite mb-2 royal-title text-gold-accent">
            مرحباً بك في قاعة تحديد المصير
          </h1>
          <p className="text-xl text-sand-ochre font-semibold mb-6 flex items-center justify-center">
            <span className="ml-2">رسالة من مرشدك</span>
            <svg
              className="pharaoh-mentor-icon w-12 h-12 inline-block mx-2"
              viewBox="0 0 100 100"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="50" cy="40" r="30" fill="#fadc99" />
              <path
                d="M 20 25 Q 50 10 80 25 L 80 40 Q 50 60 20 40 Z"
                fill="#0b4e8d"
              />
              <path
                d="M 20 25 Q 50 10 80 25 L 80 40 Q 50 60 20 40 Z"
                fill="none"
                stroke="#FFD700"
                strokeWidth="3"
              />
              <line
                x1="25"
                y1="30"
                x2="75"
                y2="30"
                stroke="#FFD700"
                strokeWidth="3"
              />
              <line
                x1="25"
                y1="40"
                x2="75"
                y2="40"
                stroke="#FFD700"
                strokeWidth="3"
              />
              <path
                d="M 40 70 C 40 85, 60 85, 60 70 L 55 60 L 45 60 Z"
                fill="#0b4e8d"
                stroke="#FFD700"
                strokeWidth="2"
              />
              <circle cx="40" cy="40" r="4" fill="#0b4e8d" />
              <circle cx="60" cy="40" r="4" fill="#0b4e8d" />
              <path
                d="M 45 55 Q 50 58 55 55"
                stroke="#0b4e8d"
                strokeWidth="2"
                fill="none"
              />
            </svg>
            <span className="mr-2">: "اختر هدفك بحكمة، فهو ما سيحدد مسار رحلتك في المملكة."</span>
          </p>
          <div className="w-20 h-1 bg-gold-accent mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <GoalCard
            goal="social"
            icon={<Users className="w-12 h-12 text-gold-accent" />}
            title="نقرة الحياة (التواصل الاجتماعي)"
            description="إتقان اللهجة للحديث اليومي، فهم الأفلام، والاندماج مع الأصدقاء."
            selectedGoal={selectedGoal}
            onSelect={handleSelectGoal}
          />
          <GoalCard
            goal="business"
            icon={<LineChart className="w-12 h-12 text-gold-accent" />}
            title="نقرة التجارة (الأعمال)"
            description="القدرة على التفاوض وإدارة الاجتماعات والعمل في بيئات احترافية مصرية."
            selectedGoal={selectedGoal}
            onSelect={handleSelectGoal}
          />
          <GoalCard
            goal="travel"
            icon={<Map className="w-12 h-12 text-gold-accent" />}
            title="نقرة الاكتشاف (السفر والسياحة)"
            description="التحدث بثقة في الشوارع، الأسواق، والمطاعم أثناء زيارة مصر."
            selectedGoal={selectedGoal}
            onSelect={handleSelectGoal}
          />
          <GoalCard
            goal="academic"
            icon={<Ankh className="w-12 h-12 text-gold-accent" />}
            title="نقرة البردية (الدراسات المتقدمة)"
            description="إتقان النحو والصرف والمفردات التاريخية للبحث الأكاديمي."
            selectedGoal={selectedGoal}
            onSelect={handleSelectGoal}
          />
        </div>

        <div className="text-center">
          <Button
            id="next-button"
            className="cta-button px-10 py-3 text-lg rounded-full"
            disabled={!selectedGoal || isSubmitting}
            onClick={handleNextStep}
          >
            {isSubmitting ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            ) : (
                <ArrowLeft className="mr-2 h-5 w-5" />
            )}
            الانتقال إلى لوحة التحكم
          </Button>
        </div>
      </div>
    </div>
  );
}

const GoalCard = ({
  goal,
  icon,
  title,
  description,
  selectedGoal,
  onSelect,
}: {
  goal: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  selectedGoal: string | null;
  onSelect: (goal: string) => void;
}) => {
  const isSelected = selectedGoal === goal;

  return (
    <div
      className={cn(
        'goal-card bg-nile rounded-2xl p-6 shadow-lg transition-all duration-300 border-2 border-transparent cursor-pointer h-full',
        {
          'selected-card border-gold-accent bg-sand-ochre/20 shadow-2xl transform scale-105': isSelected,
          'hover:transform hover:-translate-y-1 hover:border-sand-ochre':
            !isSelected,
        }
      )}
      onClick={() => onSelect(goal)}
    >
      <div className="text-center">
        <div className="icon-royal mx-auto mb-3">
            {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 text-white">{title}</h3>
        <p className="text-sand-ochre">{description}</p>
      </div>
    </div>
  );
};

    