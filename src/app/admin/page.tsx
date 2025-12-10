
'use client';

import { useState } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { addDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Edit, Trash2, User, Crown } from 'lucide-react';
import Link from 'next/link';

// Define the type for an instructor
interface Instructor {
  id: string;
  teacherName: string;
  email: string;
  shortBio: string;
  lessonPrice: number;
}

const AdminDashboardPage = () => {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();

  const instructorsCollection = useMemoFirebase(() => {
    if (!firestore) return null;
    return collection(firestore, 'instructors');
  }, [firestore]);

  const { data: instructors, isLoading: isLoadingInstructors, error: instructorsError } = useCollection<Instructor>(instructorsCollection);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentInstructor, setCurrentInstructor] = useState<Partial<Instructor>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCurrentInstructor(prev => ({ ...prev, [name]: name === 'lessonPrice' ? Number(value) : value }));
  };

  const handleSaveInstructor = async () => {
    if (!firestore || !instructorsCollection) return;
    setIsSubmitting(true);

    const { teacherName, email, shortBio, lessonPrice } = currentInstructor;

    if (!teacherName || !email || !shortBio || lessonPrice === undefined || lessonPrice < 0) {
      toast({ variant: 'destructive', title: 'خطأ', description: 'الرجاء ملء جميع الحقول المطلوبة بشكل صحيح.' });
      setIsSubmitting(false);
      return;
    }

    const instructorData = { teacherName, email, shortBio, lessonPrice };

    try {
        if (currentInstructor.id) {
            const instructorDoc = doc(firestore, 'instructors', currentInstructor.id);
            await updateDocumentNonBlocking(instructorDoc, instructorData);
            toast({ title: 'تم التحديث', description: 'تم تحديث بيانات المعلمة بنجاح.' });
        } else {
            await addDocumentNonBlocking(instructorsCollection, instructorData);
            toast({ title: 'تمت الإضافة', description: 'تم إضافة المعلمة بنجاح.' });
        }
        setIsDialogOpen(false);
        setCurrentInstructor({});
    } catch (error) {
        console.error("Error saving instructor: ", error);
        toast({ variant: 'destructive', title: 'خطأ فادح', description: 'فشل حفظ بيانات المعلمة. يرجى مراجعة صلاحيات الوصول.' });
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteInstructor = (instructorId: string) => {
    if (!firestore) return;
    const instructorDoc = doc(firestore, 'instructors', instructorId);
    deleteDocumentNonBlocking(instructorDoc);
    toast({ title: 'تم الحذف', description: 'تم حذف المعلمة بنجاح.' });
  };

  const openAddDialog = () => {
    setCurrentInstructor({});
    setIsDialogOpen(true);
  };

  const openEditDialog = (instructor: Instructor) => {
    setCurrentInstructor(instructor);
    setIsDialogOpen(true);
  };
  
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-nile-dark text-white p-4 text-center">
          <Crown className="w-20 h-20 text-gold-accent mb-6"/>
          <h1 className="text-3xl font-bold royal-title mb-4">ديوان الإدارة الملكية (محتوى محمي)</h1>
          <p className="text-sand-ochre mb-8 max-w-md">عفواً أيها الزائر، هذه القاعة مخصصة فقط لحكام المملكة. يرجى تسجيل الدخول باستخدام أوراق اعتمادك الملكية للوصول إلى ديوان الإدارة.</p>
          <Link href="/login">
              <Button className="cta-button text-lg px-8">تسجيل الدخول إلى الديوان</Button>
          </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-nile-dark p-8 text-white" style={{ direction: 'rtl' }}>
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-10 pb-4 border-b-4 border-gold-accent">
          <h1 className="text-4xl royal-title flex items-center gap-3"><Crown className="w-10 h-10"/>ديوان إدارة المملكة</h1>
          <Link href="/" className="utility-button px-4 py-2 text-sm font-bold rounded-lg flex items-center justify-center">
                <span>العودة للوحة التحكم الرئيسية</span>
          </Link>
        </header>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="dashboard-card text-white">
            <DialogHeader>
              <DialogTitle className="royal-title">{currentInstructor.id ? 'تعديل بيانات المعلمة' : 'إضافة معلمة جديدة'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Input name="teacherName" placeholder="اسم المعلمة" value={currentInstructor.teacherName || ''} onChange={handleInputChange} className="bg-nile-dark border-sand-ochre text-white" />
              <Input name="email" type="email" placeholder="البريد الإلكتروني" value={currentInstructor.email || ''} onChange={handleInputChange} className="bg-nile-dark border-sand-ochre text-white" />
              <Input name="shortBio" placeholder="وصف قصير" value={currentInstructor.shortBio || ''} onChange={handleInputChange} className="bg-nile-dark border-sand-ochre text-white" />
              <Input name="lessonPrice" type="number" placeholder="سعر الساعة (بالدولار)" value={currentInstructor.lessonPrice || ''} onChange={handleInputChange} className="bg-nile-dark border-sand-ochre text-white" />
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="outline" className="utility-button">إلغاء</Button>
                </DialogClose>
                <Button onClick={handleSaveInstructor} disabled={isSubmitting} className="cta-button">
                    {isSubmitting ? 'جاري الحفظ...' : 'حفظ'}
                </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="royal-title text-2xl">إدارة المعلمات</CardTitle>
              <CardDescription className="text-sand-ochre">إضافة وتعديل وحذف المعلمات في الأكاديمية.</CardDescription>
            </div>
            <Button onClick={openAddDialog} className="cta-button">
              <PlusCircle className="ml-2 h-4 w-4" />
              إضافة معلمة
            </Button>
          </CardHeader>
          <CardContent>
            {isLoadingInstructors && <p className="text-center text-sand-ochre">جاري تحميل سجلات المعلمات...</p>}
            {instructorsError && <p className="text-center text-red-500">حدث خطأ أثناء تحميل السجلات: {instructorsError.message}</p>}
            
            <div className="space-y-4">
              {instructors && instructors.map(instructor => (
                <div key={instructor.id} className="flex items-center justify-between p-4 rounded-lg bg-nile">
                  <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-sand-ochre text-nile-dark">
                          <User className="w-6 h-6"/>
                      </div>
                      <div>
                          <p className="font-bold text-lg text-white">{instructor.teacherName}</p>
                          <p className="text-sm text-gray-400">{instructor.email}</p>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(instructor)} className="text-blue-400 hover:text-blue-300">
                      <Edit className="h-5 w-5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-400">
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="dashboard-card text-white">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="royal-title">هل أنت متأكدة من قرارك الملكي؟</AlertDialogTitle>
                          <AlertDialogDescription className="text-sand-ochre">
                            هذا الإجراء سيقوم بحذف سجل المعلمة بشكل نهائي. لا يمكن التراجع عن هذا الأمر.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="utility-button">إلغاء</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteInstructor(instructor.id)} className="cta-button bg-red-600 hover:bg-red-700 text-white">
                            نعم، قومي بالحذف
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
