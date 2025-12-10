'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// === Game Data ===
const ALIAS = "تحتمس الصغير";
const PUZZLES = [
  {
    id: 1,
    sentence: "أنا عايز عيش بلدي", // I want local bread
    arabicTranslation: "أريد خبزاً محلياً.",
  },
  {
    id: 2,
    sentence: "الجو حر أوي النهارده", // The weather is very hot today
    arabicTranslation: "الطقس حار جداً اليوم.",
  },
  {
    id: 3,
    sentence: "يا جدعان أنا جعان", // Hey guys, I'm hungry
    arabicTranslation: "يا قوم، أنا جائع.",
  },
];

// Shuffle words function
const shuffleWords = (sentence: string) => {
  const words = sentence.split(' ');
  for (let i = words.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [words[i], words[j]] = [words[j], words[i]];
  }
  return words;
};

// ===================================
// Drag and Drop Item Types
// ===================================
const ItemTypes = { WORD: 'word' };

// ===================================
// SortableWord Component
// ===================================
const SortableWord = ({ id, word, index, moveWord, isLocked }: { id: any, word: string, index: number, moveWord: (dragIndex: number, hoverIndex: number) => void, isLocked: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);

  // 1. Drop logic (what happens when an item is dragged over this word)
  const [, drop] = useDrop({
    accept: ItemTypes.WORD,
    hover(item: { index: number }, monitor) {
      if (!ref.current || isLocked) return;

      const dragIndex = item.index; // Index of the dragged item
      const hoverIndex = index;      // Index of the current item being hovered over

      if (dragIndex === hoverIndex) return;

      // Perform reordering
      moveWord(dragIndex, hoverIndex);

      // Update the dragged item's index to avoid multiple move executions
      item.index = hoverIndex;
    },
  });

  // 2. Drag logic (the word being dragged)
  const [{ isDragging }, drag] = useDrag({
    type: ItemTypes.WORD,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    canDrag: !isLocked, // Cannot drag if the sentence is correct
  });

  // Attach drag and drop functions to a single DOM element
  drag(drop(ref));

  const wordClasses = `px-4 py-2 mx-1 my-1 rounded-full text-lg font-semibold shadow-md cursor-pointer transition-all duration-200 
    ${isLocked ? 'bg-green-700 text-white' : 'bg-[#d6b876] text-[#0d284e] hover:bg-[#FFD700]'}
  `;

  // Use opacity: 0 to temporarily hide the dragged item from its original position
  return (
    <div
      ref={ref}
      className={wordClasses}
      style={{ opacity: isDragging ? 0 : 1 }}
    >
      {word}
    </div>
  );
};


// ===================================
// GameContent Component (uses DND Hooks)
// ===================================
const GameContent = () => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [message, setMessage] = useState('');
  const [nilePoints, setNilePoints] = useState(250); // Updated Nile points

  const currentPuzzle = PUZZLES[currentPuzzleIndex];
  const correctSentence = currentPuzzle?.sentence;

  // When a new puzzle loads, shuffle the words
  useEffect(() => {
    if (currentPuzzle) {
      setCurrentWords(shuffleWords(currentPuzzle.sentence));
      setIsCorrect(false);
      setMessage('');
    }
  }, [currentPuzzleIndex, currentPuzzle]);

  // Function to reorder words on drop
  const moveWord = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      setCurrentWords(prevWords => {
        const newWords = [...prevWords];

        // The actual reordering process
        const [removed] = newWords.splice(dragIndex, 1);
        newWords.splice(hoverIndex, 0, removed);

        return newWords;
      });
    },
    [],
  );

  // Function to check the answer
  const checkAnswer = useCallback(() => {
    if (!correctSentence) return;
    const userSentence = currentWords.join(' ');

    if (userSentence === correctSentence) {
      setIsCorrect(true);
      setMessage(`أحسنت يا ${ALIAS}! بناء الجملة الفرعوني سليم. (+50 نقطة نيل)`);
      setNilePoints(prev => prev + 50);
    } else {
      setIsCorrect(false);
      setMessage('حاول مجدداً! ترتيب الكلمات غير صحيح. تذكّر: الفعل يسبق الفاعل أحياناً.');
    }
  }, [currentWords, correctSentence]);

  // Function to move to the next puzzle
  const nextPuzzle = useCallback(() => {
    const nextIndex = currentPuzzleIndex + 1;
    if (nextIndex < PUZZLES.length) {
      setCurrentPuzzleIndex(nextIndex);
    } else {
      setMessage(`تهانينا يا ${ALIAS}! أكملت كل تحديات ترتيب الكلمات لهذا اليوم.`);
      setIsCorrect(true); // For showing the final success message
    }
  }, [currentPuzzleIndex]);

  // Score Header Component
  const ScoreHeader = ({ alias, nilePoints }: { alias: string, nilePoints: number }) => (
    <div className="flex justify-between items-center p-4 bg-[#17365e] rounded-t-xl border-b-2 border-[#d6b876] shadow-lg">
      <div className="text-right">
        <p className="text-xs text-gray-400">الاسم المستعار</p>
        <p className="text-xl font-extrabold text-[#FFD700] user-alias">{alias}</p>
      </div>
      <div className="flex items-center space-x-2 space-x-reverse">
        <i className="fas fa-gem text-2xl text-[#FFD700]"></i>
        <p className="text-2xl font-black text-white">{nilePoints}</p>
        <p className="text-sm text-gray-400 mr-1">نقاط النيل</p>
      </div>
    </div>
  );

  if (!currentPuzzle) {
    return (
      <div className="flex items-center justify-center text-white p-10">
        <p>جاري تحميل تحديات فرعونية جديدة...</p>
      </div>
    );
  }

  // Drop Target for the main container (to prevent dragging outside the area)
  const [, drop] = useDrop({
    accept: ItemTypes.WORD,
    drop() {
      // No special logic needed for dropping on the container, as reordering logic is in 'hover' inside SortableWord
      return;
    }
  });
  
  // Drop target for the source words area
  const [, sourceDrop] = useDrop(() => ({ accept: ItemTypes.WORD }));

  return (
    <div className="w-full max-w-2xl bg-[#0d284e] rounded-xl shadow-2xl dashboard-card" style={{ direction: 'rtl' }}>

      <ScoreHeader alias={ALIAS} nilePoints={nilePoints} />

      <div className="p-4 md:p-6">

        {/* Challenge Title */}
        <h2 className="text-3xl font-extrabold text-[#FFD700] mb-4 text-center royal-title">رتّب كلمات الفراعنة 👑</h2>
        <p className="text-gray-300 text-lg mb-6 text-center">قم بسحب وإفلات الكلمات لترتيب الجملة المصرية العامية بشكل صحيح.</p>

        {/* Sentence Area (Drop Container) */}
        <div
          ref={drop}
          className={`min-h-[100px] p-4 border-2 rounded-xl flex flex-wrap justify-center items-center transition-colors duration-300
            ${isCorrect ? 'border-green-500 bg-green-900/20' : 'border-gray-500 border-dashed bg-[#1c3d6d]'}
          `}
        >
          {currentWords.map((word, index) => (
            <SortableWord
              key={`${word}-${index}`}
              id={`${word}-${index}`}
              word={word}
              index={index}
              moveWord={moveWord}
              isLocked={isCorrect}
            />
          ))}
          {currentWords.length === 0 && (
            <p className="text-gray-400 text-lg">اسحب الكلمات إلى هنا لترتيب الجملة...</p>
          )}
        </div>

        {/* Translation and Support */}
        <div className="mt-4 p-3 bg-[#17365e] rounded-lg shadow-inner">
          <p className="text-sm text-gray-400">المعنى المراد في الفصحى:</p>
          <p className="text-base font-bold text-white">{currentPuzzle.arabicTranslation}</p>
        </div>

        {/* Evaluation Message */}
        {message && (
          <div className={`mt-4 p-4 rounded-lg text-center font-bold shadow-lg 
            ${isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
          >
            {message}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
          {!isCorrect ? (
            <Button
              onClick={checkAnswer}
              className="cta-button px-8 py-3 text-lg rounded-full w-full sm:w-auto"
            >
              <i className="fas fa-check ml-2"></i> تحقق من الإجابة
            </Button>
          ) : (
             <Button
              onClick={nextPuzzle}
              className="cta-button bg-green-600 hover:bg-green-700 px-8 py-3 text-lg rounded-full w-full sm:w-auto"
            >
              {currentPuzzleIndex < PUZZLES.length - 1 ? 'التحدي التالي' : 'إنهاء التحدي'}
              <i className="fas fa-arrow-left mr-2"></i>
            </Button>
          )}
           <Link href="/" className="w-full sm:w-auto">
             <Button variant="outline" className="utility-button w-full">
                العودة للوحة التحكم
             </Button>
          </Link>
        </div>

        {/* Progress Indicator */}
        <p className="text-center text-sm text-gray-400 mt-4">
          التحدي {currentPuzzleIndex + 1} من {PUZZLES.length}
        </p>

      </div>
    </div>
  );
};

// ===================================
// Main App Component (Wraps Context)
// ===================================

const WordScramblePage = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-[#0d284e] p-4 md:p-8 flex items-center justify-center">
        <GameContent />
      </div>
    </DndProvider>
  );
};

export default WordScramblePage;
