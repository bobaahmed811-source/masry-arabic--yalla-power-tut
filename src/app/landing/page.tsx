'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const testimonials = [
  { name: 'Sarah, USA', quote: 'أفضل تجربة تعليمية! تعلمت اللهجة المصرية في أسابيع قليلة' },
  { name: 'Ahmed, Germany', quote: 'المعلمات محترفات والطريقة ممتعة جداً' },
  { name: 'Maria, Spain', quote: 'الآن أستطيع التحدث مع أصدقائي المصريين بثقة!' }
];

const results = [
    { duration: 'بعد أسبوع واحد', 'en_duration': 'After 1 Week', outcomes: ['التحيات اليومية', 'الجمل الأساسية', '50+ كلمة شائعة'] },
    { duration: 'بعد شهر واحد', 'en_duration': 'After 1 Month', outcomes: ['محادثات قصيرة', 'فهم الأفلام', 'التسوق والطلبات'] },
    { duration: 'بعد 3 أشهر', 'en_duration': 'After 3 Months', outcomes: ['طلاقة في الحوار', 'فهم اللهجة المصرية', 'التواصل بثقة'] }
];

const bonuses = [
    { icon: '📱', title: 'تطبيق الممارسة اليومية', description: '50 عبارة مصرية أساسية مع نطق صوتي', en_title: 'Daily Practice App', en_description: '50 essential Egyptian phrases with audio' },
    { icon: '📚', title: 'دليل الثقافة المصرية', description: 'كل ما تحتاج معرفته عن الحياة في مصر', en_title: 'Egyptian Culture Guide', en_description: 'Everything you need to know about life in Egypt' },
    { icon: '🎯', title: 'خطة التعلم الشخصية', description: 'مصممة خصيصاً لأهدافك', en_title: 'Personal Learning Plan', en_description: 'Designed specifically for your goals' },
    { icon: '💬', title: 'مجموعة الدعم الحصرية', description: 'تواصل مع طلاب من جميع أنحاء العالم', en_title: 'Exclusive Support Group', en_description: 'Connect with students from around the world' }
];

const packages = [
  { name: 'السريع', en_name: 'Quick Start', sessions: '4 حصص', en_sessions: '4 Sessions', duration: 'شهر', en_duration: '1 Month', price: '$60', price_note: '($15/حصة)', benefits: ['مواد تعليمية', 'دعم أساسي', 'جلسة تقييم'] },
  { name: 'المتقدم', en_name: 'Advanced', sessions: '8 حصص', en_sessions: '8 Sessions', duration: 'شهرين', en_duration: '2 Months', price: '$104', price_note: '($13/حصة)', benefits: ['كل مزايا السريع', 'مجموعة واتساب', 'جلسات إضافية'] },
  { name: 'الملكي', en_name: 'Royal', sessions: '16 حصص', en_sessions: '16 Sessions', duration: '3 أشهر', en_duration: '3 Months', price: '$176', price_note: '($11/حصة)', benefits: ['كل المزايا', 'أولوية الحجز', 'شهادة إتمام', 'دعم 24/7'] }
];

const faqs = [
  { q: 'هل أحتاج معرفة سابقة بالعربية؟', a: 'لا! نبدأ معك من الصفر. دروسنا مصممة للمبتدئين تماماً.', en_q: 'Do I need prior Arabic knowledge?', en_a: 'No! We start from scratch. Our lessons are designed for complete beginners.' },
  { q: 'كم مدة الحصة؟', a: 'كل حصة مدتها 60 دقيقة من التعلم المكثف والممتع.', en_q: 'How long is each session?', en_a: 'Each session is 60 minutes of intensive and fun learning.' },
  { q: 'هل الدروس فردية أم جماعية؟', a: 'نقدم النوعين! يمكنك اختيار ما يناسبك.', en_q: 'Are lessons private or group?', en_a: 'We offer both! You can choose what suits you best.' },
  { q: 'ما الفرق بين اللهجة المصرية والعربية الفصحى؟', a: 'اللهجة المصرية هي ما يتحدثه 100 مليون مصري يومياً. إنها عملية وممتعة وأسهل بكثير من الفصحى!', en_q: "What's the difference between Egyptian Arabic and Standard Arabic?", en_a: "Egyptian Arabic is what 100 million Egyptians speak daily. It's practical, fun, and much easier than Standard Arabic!" },
  { q: 'هل يمكنني إلغاء أو إعادة جدولة الحصة؟', a: 'نعم! يمكنك إعادة الجدولة قبل 24 ساعة من الحصة مجاناً.', en_q: 'Can I cancel or reschedule?', en_a: 'Yes! You can reschedule 24 hours before the session for free.' },
  { q: 'كيف أعرف مستواي؟', a: 'نقدم جلسة تقييم مجانية لتحديد مستواك وبناء خطة مخصصة لك.', en_q: 'How do I know my level?', en_a: 'We offer a FREE assessment session to determine your level and build a custom plan.' },
  { q: 'هل تقدمون شهادة؟', a: 'نعم! مع الباقة الملكية تحصل على شهادة إتمام معتمدة من الأكاديمية.', en_q: 'Do you provide a certificate?', en_a: 'Yes! With the Royal package, you get a certified completion certificate from the academy.' }
];

export default function LandingPage() {
  return (
    <div className="bg-nile-dark text-white" style={{ direction: 'rtl' }}>
      {/* Hero Section */}
      <header className="py-12 md:py-20 bg-gray-900/50 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-6xl font-black royal-title mb-4">
            Yalla Masry Academy
          </h1>
          <p className="text-xl md:text-2xl text-sand-ochre mb-8">
            Unlock Egyptian Arabic From Inside Tutankhamun’s Secret Tomb
          </p>
          <div className="aspect-w-16 aspect-h-9 max-w-2xl mx-auto rounded-lg overflow-hidden shadow-2xl mb-8 border-4 border-gold-accent">
            <iframe
              src="https://www.youtube.com/embed/TNtIUkPaG30"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <p className="text-2xl md:text-3xl font-bold mb-4">🔥 Stop Studying Arabic. Start Living It.</p>
          <p className="text-lg md:text-xl mb-6">Speak Like Egyptians — Fast, Real, and Fun.</p>
          <p className="text-gray-300 max-w-3xl mx-auto mb-10">
            Master Egyptian Arabic online with expert tutors. Private 1:1 lessons and access to the exclusive Hatshepsut Challenge system for Colloquial Arabic.
          </p>
          
          <Card className="dashboard-card max-w-lg mx-auto text-left">
            <CardHeader>
                <CardTitle className="royal-title text-2xl">🎁 عرض خاص للطلاب الجدد | Special Offer</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sand-ochre">
                    <li>✅ تقييم مستواك مجاناً | Free level assessment</li>
                    <li>✅ خطة تعليمية مخصصة لك | Personalized learning plan</li>
                    <li>✅ مواد تعليمية حصرية | Exclusive learning materials</li>
                </ul>
                <Button asChild className="cta-button w-full mt-6 text-lg">
                    <a href="https://docs.google.com/forms/d/e/1FAIpQLScP9wcegTMCjY_l3B2dMhlRXE3KL32j4-dbqCsio0QiBXuURA/viewform?usp=preview" target="_blank" rel="noopener noreferrer">
                        Book Your FREE Pharaoh Power Session Now!
                    </a>
                </Button>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Testimonials */}
      <section className="py-16 bg-nile">
          <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center royal-title mb-12">🌟 ماذا يقول طلابنا | What Our Students Say</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                      <Card key={index} className="bg-nile-dark border-sand-ochre text-center p-6">
                          <p className="text-lg font-semibold text-white mb-4">"{testimonial.quote}"</p>
                          <p className="font-bold text-sand-ochre">- {testimonial.name}</p>
                      </Card>
                  ))}
              </div>
          </div>
      </section>
      
      {/* Guaranteed Results */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center royal-title mb-12">📊 نتائج مضمونة | Guaranteed Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {results.map((result, index) => (
              <div key={index} className="stat-card p-6 rounded-lg text-center">
                <h3 className="text-2xl font-black text-sand-ochre mb-4">{result.duration}<br/><span className="text-sm text-gray-400">{result.en_duration}</span></h3>
                <ul className="text-left text-white space-y-2">
                  {result.outcomes.map((outcome, i) => <li key={i}>• {outcome}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sign-up Bonus */}
      <section className="py-16 bg-nile-dark">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center royal-title mb-12">🎁 مكافأة التسجيل | Sign-up Bonus</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bonuses.map((bonus, index) => (
              <div key={index} className="flex items-start space-x-4 space-x-reverse">
                <span className="text-4xl">{bonus.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-sand-ochre">{bonus.title} <span className="text-gray-400">| {bonus.en_title}</span></h3>
                  <p className="text-gray-300">{bonus.description} <span className="text-gray-500">| {bonus.en_description}</span></p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Pricing */}
      <section className="py-16 bg-nile">
          <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-3xl md:text-4xl font-bold text-center royal-title mb-2">💰 باقات التعلم والأسعار</h2>
              <p className="text-center text-sand-ochre mb-12">اختر باقتك المناسبة من قصر الفراعنة | Choose Your Perfect Package</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                  {packages.map((pkg, index) => (
                      <Card key={index} className={`dashboard-card flex flex-col ${pkg.name === 'المتقدم' ? 'border-4 border-gold-accent' : ''}`}>
                          <CardHeader className="text-center">
                              <CardTitle className="text-3xl font-black royal-title">{pkg.name} | {pkg.en_name}</CardTitle>
                              <CardDescription className="text-sand-ochre">{pkg.sessions} ({pkg.en_sessions}) / {pkg.duration} ({pkg.en_duration})</CardDescription>
                          </CardHeader>
                          <CardContent className="flex-grow">
                              <p className="text-5xl font-extrabold text-center text-white mb-2">{pkg.price}</p>
                              <p className="text-center text-gray-400 mb-6">{pkg.price_note}</p>
                              <ul className="space-y-2 text-white">
                                  {pkg.benefits.map((benefit, i) => <li key={i} className="flex items-center"><i className="fas fa-check-circle text-green-400 ml-2"></i>{benefit}</li>)}
                              </ul>
                          </CardContent>
                          <div className="p-6 pt-0">
                               <Button asChild className="cta-button w-full mt-4 text-lg">
                                  <a href="https://docs.google.com/forms/d/e/1FAIpQLScP9wcegTMCjY_l3B2dMhlRXE3KL32j4-dbqCsio0QiBXuURA/viewform?usp=preview" target="_blank" rel="noopener noreferrer">
                                      اختر الباقة
                                  </a>
                              </Button>
                          </div>
                      </Card>
                  ))}
              </div>
          </div>
      </section>
      
      {/* FAQ */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center royal-title mb-12">❓ الأسئلة الشائعة | FAQ</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-sand-ochre">
                <AccordionTrigger className="text-lg font-bold text-white hover:text-sand-ochre text-right">
                  {faq.q} <span className="text-sm text-gray-400 mx-2">|</span> {faq.en_q}
                </AccordionTrigger>
                <AccordionContent className="text-gray-300 text-base text-right">
                  {faq.a} <br/> <span className="text-gray-500">{faq.en_a}</span>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Contact */}
      <footer className="py-12 bg-nile-dark border-t-2 border-gold-accent">
          <div className="max-w-4xl mx-auto px-4 text-center">
              <h2 className="text-3xl md:text-4xl font-bold royal-title mb-8">📞 تواصل معنا | Contact Us</h2>
              <div className="space-y-4 text-lg text-sand-ochre">
                  <p>📧 **البريد الإلكتروني | Email:** info@talkmasry.com</p>
                  <p>💬 **واتساب | WhatsApp:** +20 XXX XXX XXXX</p>
                  <p>📱 **انستجرام | Instagram:** @talkmasryacademy</p>
                  <p>🎥 **يوتيوب | YouTube:** Talk Masry Academy</p>
              </div>
              <div className="mt-10">
                  <p className="text-2xl font-bold text-white mb-4">✨ رحلتك لإتقان اللهجة المصرية تبدأ من هنا!</p>
                  <Button asChild className="cta-button text-xl px-8 py-6 rounded-full">
                      <a href="https://forms.gle/rpHbdzYVyjLxdL4X6" target="_blank" rel="noopener noreferrer">🚀 احجز الآن | Book Now</a>
                  </Button>
              </div>
              <div className="mt-12 text-sm text-gray-500">
                  <Link href="/" className="hover:text-gold-accent">العودة للوحة التحكم</Link>
              </div>
          </div>
      </footer>
    </div>
  );
}
