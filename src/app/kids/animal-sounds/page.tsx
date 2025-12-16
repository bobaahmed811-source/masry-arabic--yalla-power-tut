
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Loader2, ArrowLeft } from 'lucide-react';
import placeholderData from '@/lib/placeholder-images.json';
import { getAnimalSoundFlow, AnimalSoundInput, AnimalSoundOutput } from '@/ai/flows/animal-sound-flow';
import Link from 'next/link';

const animals = placeholderData.placeholderImages.filter(p => p.id.startsWith('animal-'));

export default function AnimalSoundsPage() {
  const [loadingAnimal, setLoadingAnimal] = useState<string | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnimalClick = async (animalName: string, animalId: string) => {
    if (loadingAnimal) return;

    setLoadingAnimal(animalId);
    setError(null);
    setAudioSrc(null);

    try {
      const input: AnimalSoundInput = { animalName };
      const result: AnimalSoundOutput = await getAnimalSoundFlow(input);
      setAudioSrc(result.audioDataUri);
      
      // Auto-play the audio
      const audio = new Audio(result.audioDataUri);
      audio.play();

    } catch (err) {
      console.error("Error generating animal sound:", err);
      setError('حدث خطأ أثناء محاولة إصدار الصوت. الرجاء المحاولة مرة أخرى.');
    } finally {
      setLoadingAnimal(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-kids-bg text-white p-4 sm:p-6 md:p-8 relative">
        <Link href="/kids" passHref>
            <Button variant="ghost" className="absolute top-4 left-4 text-sand-ochre hover:bg-white/10 hover:text-gold-accent">
                <ArrowLeft className="w-6 h-6 mr-2" />
                العودة
            </Button>
        </Link>
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="kids-title text-4xl md:text-5xl mb-4 mt-16">أصوات الحيوانات</h1>
        <p className="text-sand-ochre text-lg mb-8">اضغط على صورة الحيوان لتسمع صوته!</p>

        {error && <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg mb-6">{error}</div>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {animals.map((animal) => (
            <Card
              key={animal.id}
              className="kids-card p-4 flex flex-col items-center justify-between cursor-pointer aspect-square"
              onClick={() => handleAnimalClick(animal.metadata.name, animal.id)}
            >
              <Image
                src={animal.imageUrl}
                alt={animal.description}
                width={120}
                height={120}
                data-ai-hint={animal.imageHint}
                className="rounded-lg object-cover flex-grow"
              />
              <div className="flex items-center justify-center h-10 mt-2">
                {loadingAnimal === animal.id ? (
                  <Loader2 className="w-6 h-6 animate-spin text-gold-accent" />
                ) : (
                    <h3 className="text-xl font-bold text-white font-cairo">{animal.metadata.name}</h3>
                )}
              </div>
            </Card>
          ))}
        </div>

        {audioSrc && (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-11/12 max-w-md">
             <audio controls autoPlay src={audioSrc} className="w-full rounded-full shadow-lg">
                Your browser does not support the audio element.
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}
