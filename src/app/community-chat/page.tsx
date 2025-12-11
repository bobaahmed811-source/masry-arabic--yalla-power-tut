'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { Send, MessagesSquare, Loader2 } from 'lucide-react';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';

// Define the type for a chat message
interface CommunityMessage {
  id: string;
  text: string;
  senderId: string;
  senderAlias: string;
  timestamp: any; // Firestore timestamp
}

const CommunityChatPage = () => {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const messagesCollectionQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    // Querying the correct public collection, ordered by timestamp
    return query(collection(firestore, 'community_messages'), orderBy('timestamp', 'asc'));
  }, [firestore]);

  const { data: messages, isLoading: isLoadingMessages, error } = useCollection<CommunityMessage>(messagesCollectionQuery);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !firestore || !newMessage.trim()) return;

    setIsSending(true);
    const userAlias = user.displayName || 'مستخدم مجهول';

    const messageData = {
      text: newMessage,
      senderId: user.uid,
      senderAlias: userAlias,
      timestamp: serverTimestamp(),
    };

    // Use the non-blocking update
    addDocumentNonBlocking(collection(firestore, 'community_messages'), messageData);
    
    setNewMessage('');
    setIsSending(false);
    // The real-time listener will update the UI, no toast needed for success.
  };
  
  if (isUserLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-nile-dark">
            <Loader2 className="h-12 w-12 text-gold-accent animate-spin" />
            <p className="text-white text-xl mr-4">جاري التحقق من الهوية الملكية...</p>
        </div>
    );
  }

  if (!user) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-nile-dark text-white p-4 text-center">
        <MessagesSquare className="w-16 h-16 text-gold-accent mb-6" />
        <h1 className="text-3xl font-bold royal-title mb-4">ساحة الحوار الكبرى (محتوى محمي)</h1>
        <p className="text-sand-ochre mb-8 max-w-md">هذه الساحة مخصصة فقط لأعضاء المملكة المسجلين. يرجى تسجيل الدخول للمشاركة في الحوارات.</p>
        <Link href="/login">
          <Button className="cta-button text-lg px-8">تسجيل الدخول إلى الساحة</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-nile-dark text-white p-4" style={{ direction: 'rtl' }}>
      <header className="text-center mb-4">
        <h1 className="text-4xl royal-title">ساحة الحوار الكبرى</h1>
        <p className="text-sand-ochre">المكان المثالي لممارسة العامية المصرية مع بقية طلاب المملكة</p>
      </header>
      
      <Card className="flex-grow flex flex-col dashboard-card overflow-hidden">
        <CardContent className="flex-grow p-4 overflow-y-auto space-y-4">
           {isLoadingMessages && <div className="flex justify-center items-center h-full"><Loader2 className="h-8 w-8 animate-spin text-sand-ochre" /><p className="mr-3 text-sand-ochre">جاري تحميل الرسائل...</p></div>}
           {error && <div className="text-center text-red-500 p-4">حدث خطأ أثناء تحميل الرسائل: {error.message}</div>}
           {messages && messages.map(msg => (
             <div key={msg.id} className={`flex items-end gap-2 ${msg.senderId === user.uid ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-md p-3 rounded-lg ${msg.senderId === user.uid ? 'bg-gold-accent text-nile-dark rounded-br-none' : 'bg-nile rounded-bl-none'}`}>
                    <p className="font-bold text-sm">{msg.senderId === user.uid ? 'أنا' : msg.senderAlias}</p>
                    <p className="text-base">{msg.text}</p>
                     {msg.timestamp && (
                        <p className="text-xs opacity-60 mt-1 text-right">
                            {new Date(msg.timestamp?.toDate()).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                    )}
                </div>
             </div>
           ))}
            {messages?.length === 0 && !isLoadingMessages && (
                <div className="text-center text-sand-ochre/80 pt-10">
                    <p>لا توجد رسائل بعد. كوني أول من يبدأ الحوار!</p>
                </div>
            )}
           <div ref={messagesEndRef} />
        </CardContent>
        
        <div className="p-4 border-t-2 border-gold-accent">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <Input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="اكتب رسالتك هنا..."
                    className="bg-nile-dark border-sand-ochre text-white flex-grow"
                    disabled={isSending}
                />
                <Button type="submit" className="cta-button" disabled={isSending || !newMessage.trim()}>
                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                </Button>
            </form>
        </div>
      </Card>
      <Link href="/" className="utility-button px-4 py-2 text-sm font-bold rounded-lg flex items-center justify-center mt-4 mx-auto w-fit">
            العودة للوحة التحكم
      </Link>
    </div>
  );
};

export default CommunityChatPage;
