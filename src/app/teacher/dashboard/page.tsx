'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, where, doc, updateDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { Loader2, Crown, User, AlertTriangle, Save, Edit, LogOut } from 'lucide-react';

interface Instructor {
    id: string;
    teacherName: string;
    email: string;
    shortBio: string;
    lessonPrice: number;
    photo?: string;
    introVideo?: string;
    languages?: string[];
    specialties?: string[];
    availability?: string;
    status?: 'Active' | 'Inactive';
}

const specialtiesOptions = ["Children", "Women", "Egyptian Dialect", "Conversation", "Quran"];
const languagesOptions = ["English", "Arabic", "French", "Spanish", "German"];

export default function TeacherDashboardPage() {
    const { user, isUserLoading } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [instructorData, setInstructorData] = useState<Instructor | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Query to find the instructor document that matches the logged-in user's email
    const instructorQuery = React.useMemo(() => {
        if (!firestore || !user?.email) return null;
        return query(collection(firestore, 'instructors'), where('email', '==', user.email), where('status', '==', 'Active'));
    }, [firestore, user?.email]);

    const { data: instructors, isLoading: isLoadingInstructor } = useCollection<Instructor>(instructorQuery);

    useEffect(() => {
        if (instructors && instructors.length > 0) {
            setInstructorData(instructors[0]);
        } else {
            setInstructorData(null);
        }
    }, [instructors]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        if (!instructorData) return;
        const { name, value } = e.target;
        setInstructorData({ ...instructorData, [name]: value });
    };

    const handleSelectChange = (name: keyof Instructor, value: string | string[]) => {
         if (!instructorData) return;
        setInstructorData({ ...instructorData, [name]: value });
    };

    const handleSaveChanges = async () => {
        if (!firestore || !instructorData) {
            toast({ variant: 'destructive', title: 'خطأ', description: 'لا يمكن حفظ البيانات.' });
            return;
        }
        setIsSubmitting(true);
        try {
            const instructorRef = doc(firestore, 'instructors', instructorData.id);
            // We only update the fields that the teacher is allowed to edit.
            await updateDoc(instructorRef, {
                teacherName: instructorData.teacherName,
                shortBio: instructorData.shortBio,
                photo: instructorData.photo || '',
                introVideo: instructorData.introVideo || '',
                languages: instructorData.languages || [],
                specialties: instructorData.specialties || [],
                availability: instructorData.availability || '',
                lessonPrice: Number(instructorData.lessonPrice) || 0,
            });
            toast({ title: 'تم الحفظ بنجاح', description: 'تم تحديث ملفك الشخصي.' });
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating instructor profile:", error);
            toast({ variant: 'destructive', title: 'فشل الحفظ', description: 'حدث خطأ أثناء تحديث ملفك.' });
        } finally {
            setIsSubmitting(false);
        }
    };


    if (isUserLoading || isLoadingInstructor) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-nile-dark">
                <Loader2 className="h-12 w-12 text-gold-accent animate-spin" />
                <p className="text-white text-xl mr-4">جاري التحقق من هوية المعلمة...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-nile-dark text-white p-4 text-center">
                <Crown className="w-20 h-20 text-gold-accent mb-6" />
                <h1 className="text-3xl font-bold royal-title mb-4">ديوان المعلمات (وصول خاص)</h1>
                <p className="text-sand-ochre mb-8 max-w-md">هذه القاعة مخصصة فقط لمعلمات المملكة المعتمدات. يرجى تسجيل الدخول.</p>
                <Link href="/login">
                    <Button className="cta-button text-lg px-8">تسجيل الدخول</Button>
                </Link>
            </div>
        );
    }
    
    if (!instructorData) {
         return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-nile-dark text-white p-4 text-center">
                <AlertTriangle className="w-20 h-20 text-yellow-400 mb-6" />
                <h1 className="text-3xl font-bold royal-title mb-4">أنتِ غير مسجلة كمعلمة</h1>
                <p className="text-sand-ochre mb-8 max-w-md">مرحباً بكِ يا {user.displayName}. حسابكِ مسجل كطالبة. هذه اللوحة مخصصة للمعلمات فقط.</p>
                <Link href="/">
                    <Button className="cta-button text-lg px-8">العودة للوحة تحكم الطالبة</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-nile-dark p-8 text-white" style={{ direction: 'rtl' }}>
            <div className="max-w-4xl mx-auto">
                <header className="flex justify-between items-center mb-10 pb-4 border-b-4 border-gold-accent">
                    <div>
                        <h1 className="text-4xl royal-title flex items-center gap-3"><Crown className="w-10 h-10" />ديوان المعلمة: {instructorData.teacherName}</h1>
                        <p className="text-sand-ochre">أهلاً بكِ في مساحتكِ الخاصة لإدارة ملفكِ الشخصي وجدولكِ.</p>
                    </div>
                     <Link href="/" className="utility-button px-4 py-2 text-sm font-bold rounded-lg flex items-center justify-center">
                        <LogOut className="ml-2"/>
                        <span>الخروج من الديوان</span>
                    </Link>
                </header>

                <Card className="dashboard-card">
                    <CardHeader className="flex flex-row justify-between items-center">
                        <div>
                            <CardTitle className="royal-title text-2xl">ملفك الشخصي</CardTitle>
                            <CardDescription className="text-sand-ochre">هذه هي البيانات التي تظهر للطالبات في صفحتك.</CardDescription>
                        </div>
                        {!isEditing && (
                             <Button onClick={() => setIsEditing(true)} className="cta-button">
                                <Edit className="ml-2"/> تعديل الملف
                            </Button>
                        )}
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             {/* Display mode */}
                            {!isEditing && (
                                <>
                                    <InfoDisplay label="الاسم" value={instructorData.teacherName} />
                                    <InfoDisplay label="البريد الإلكتروني" value={instructorData.email} />
                                    <InfoDisplay label="سعر الساعة" value={`$${instructorData.lessonPrice}`} />
                                    <InfoDisplay label="الحالة" value={instructorData.status === 'Active' ? 'نشط' : 'غير نشط'} />
                                    <InfoDisplay label="التخصصات" value={instructorData.specialties?.join('، ')} />
                                    <InfoDisplay label="اللغات" value={instructorData.languages?.join('، ')} />
                                    <div className="md:col-span-2">
                                        <InfoDisplay label="السيرة الذاتية القصيرة" value={instructorData.shortBio} />
                                    </div>
                                </>
                            )}
                            {/* Editing mode */}
                            {isEditing && (
                                <>
                                    <InputRow label="اسم المعلمة" name="teacherName" value={instructorData.teacherName} onChange={handleInputChange} />
                                    <InputRow label="سعر الساعة (بالدولار)" name="lessonPrice" type="number" value={String(instructorData.lessonPrice)} onChange={handleInputChange} />
                                    <InputRow label="رابط الصورة الشخصية" name="photo" value={instructorData.photo || ''} onChange={handleInputChange} />
                                    <InputRow label="رابط فيديو المقدمة (يوتيوب)" name="introVideo" value={instructorData.introVideo || ''} onChange={handleInputChange} />
                                    <TextareaRow label="السيرة الذاتية" name="shortBio" value={instructorData.shortBio} onChange={handleInputChange} />
                                    <TextareaRow label="المواعيد المتاحة (نص وصفي)" name="availability" value={instructorData.availability || ''} onChange={handleInputChange} />
                                    
                                     {/* Multi-Select for Specialties */}
                                    <div>
                                        <label className="font-bold text-sand-ochre mb-2 block">التخصصات</label>
                                        <div className="grid grid-cols-2 gap-2 p-4 bg-nile rounded-lg">
                                            {specialtiesOptions.map(option => (
                                                <div key={option} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`spec-${option}`}
                                                        value={option}
                                                        checked={instructorData.specialties?.includes(option)}
                                                        onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            const currentSpecs = instructorData.specialties || [];
                                                            const newSpecs = checked ? [...currentSpecs, option] : currentSpecs.filter(s => s !== option);
                                                            handleSelectChange('specialties', newSpecs);
                                                        }}
                                                        className="ml-2"
                                                    />
                                                    <label htmlFor={`spec-${option}`}>{option}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                     {/* Multi-Select for Languages */}
                                    <div>
                                        <label className="font-bold text-sand-ochre mb-2 block">اللغات</label>
                                        <div className="grid grid-cols-2 gap-2 p-4 bg-nile rounded-lg">
                                            {languagesOptions.map(option => (
                                                <div key={option} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`lang-${option}`}
                                                        value={option}
                                                        checked={instructorData.languages?.includes(option)}
                                                        onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            const currentLangs = instructorData.languages || [];
                                                            const newLangs = checked ? [...currentLangs, option] : currentLangs.filter(s => s !== option);
                                                            handleSelectChange('languages', newLangs);
                                                        }}
                                                         className="ml-2"
                                                    />
                                                    <label htmlFor={`lang-${option}`}>{option}</label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>


                                    <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                                        <Button onClick={() => setIsEditing(false)} variant="outline" className="utility-button">إلغاء</Button>
                                        <Button onClick={handleSaveChanges} className="cta-button" disabled={isSubmitting}>
                                            {isSubmitting ? <Loader2 className="animate-spin" /> : <Save />}
                                            حفظ التغييرات
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

const InfoDisplay = ({ label, value }: { label: string, value?: string }) => (
    <div>
        <p className="text-sm font-bold text-sand-ochre">{label}</p>
        <p className="text-lg text-white bg-nile-dark/30 p-2 rounded-md min-h-[40px]">{value || 'غير محدد'}</p>
    </div>
);

const InputRow = ({ label, name, value, onChange, type = "text" }: { label: string, name: string, value: string, onChange: any, type?: string }) => (
    <div>
        <label htmlFor={name} className="font-bold text-sand-ochre mb-1 block">{label}</label>
        <Input id={name} name={name} type={type} value={value} onChange={onChange} className="bg-nile-dark border-sand-ochre text-white" />
    </div>
);

const TextareaRow = ({ label, name, value, onChange }: { label: string, name: string, value: string, onChange: any }) => (
    <div className="md:col-span-2">
        <label htmlFor={name} className="font-bold text-sand-ochre mb-1 block">{label}</label>
        <Textarea id={name} name={name} value={value} onChange={onChange} className="bg-nile-dark border-sand-ochre text-white" rows={3} />
    </div>
);
