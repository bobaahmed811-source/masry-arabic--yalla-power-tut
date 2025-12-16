'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Eraser, Download } from 'lucide-react';
import Link from 'next/link';
import placeholderData from '@/lib/placeholder-images.json';

const colors = [
  '#FFD700', '#4682B4', '#B22222', '#006400', '#8B4513',
  '#FFFFFF', '#000000', '#FF69B4', '#9370DB', '#00CED1'
];

const EraserColor = '#FFFFFF';

export default function ColoringPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const coloringImage = placeholderData.placeholderImages.find(p => p.id === 'coloring-tut');
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !coloringImage) return;

    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = coloringImage.imageUrl;

    image.onload = () => {
      const parent = canvas.parentElement;
      if (parent) {
          // Fit canvas to parent while maintaining aspect ratio
          const parentWidth = parent.clientWidth;
          const parentHeight = parent.clientHeight;
          const imageAspectRatio = image.width / image.height;
          
          let canvasWidth = parentWidth;
          let canvasHeight = parentWidth / imageAspectRatio;

          if (canvasHeight > parentHeight) {
              canvasHeight = parentHeight;
              canvasWidth = parentHeight * imageAspectRatio;
          }
          
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          
          ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      }
    };
  }, [coloringImage]);

  const getCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: Math.floor((event.clientX - rect.left) * scaleX),
      y: Math.floor((event.clientY - rect.top) * scaleY),
    };
  };
  
  const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColorStr: string) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const { width, height, data } = imageData;
    const startPos = (startY * width + startX) * 4;
    
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];

    const fillR = parseInt(fillColorStr.slice(1, 3), 16);
    const fillG = parseInt(fillColorStr.slice(3, 5), 16);
    const fillB = parseInt(fillColorStr.slice(5, 7), 16);

    if (startR === fillR && startG === fillG && startB === fillB) {
      return;
    }

    const pixelStack: [number, number][] = [[startX, startY]];
    
    const colorMatch = (pixelPos: number) => {
        const r = data[pixelPos];
        const g = data[pixelPos+1];
        const b = data[pixelPos+2];
        const a = data[pixelPos+3];

        // Do not fill transparent areas
        if (a < 255) return false;
        
        // Use a tolerance to handle anti-aliasing
        const tolerance = 16;
        return Math.abs(r - startR) <= tolerance && Math.abs(g - startG) <= tolerance && Math.abs(b - startB) <= tolerance;
    }

    while (pixelStack.length > 0) {
      const newPos = pixelStack.pop();
      if (!newPos) continue;
      const [x, y] = newPos;

      let pixelPos = (y * width + x) * 4;
      while (y >= 0 && colorMatch(pixelPos)) {
          pixelPos -= width * 4;
      }
      pixelPos += width * 4;
      
      let reachLeft = false;
      let reachRight = false;

      while (y < height && colorMatch(pixelPos)) {
        data[pixelPos] = fillR;
        data[pixelPos+1] = fillG;
        data[pixelPos+2] = fillB;
        data[pixelPos+3] = 255;

        if (x > 0) {
          if (colorMatch(pixelPos - 4)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }
        
        if (x < width - 1) {
          if (colorMatch(pixelPos + 4)) {
            if (!reachRight) {
              pixelStack.push([x + 1, y]);
              reachRight = true;
            }
          } else if (reachRight) {
            reachRight = false;
          }
        }
        
        pixelPos += width * 4;
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  };


  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { willReadFrequently: true });
    const coords = getCoordinates(event);
    if (!ctx || !coords) return;

    floodFill(ctx, coords.x, coords.y, selectedColor);
  };
  
  const downloadImage = () => {
    const canvas = canvasRef.current;
    if(!canvas) return;
    const link = document.createElement('a');
    link.download = 'my-pharaoh-artwork.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div dir="rtl" className="min-h-screen w-full bg-kids-bg text-white p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-7xl flex items-center justify-between mb-6">
        <Link href="/" passHref>
          <Button variant="outline" className="utility-button">
            <Home className="w-5 h-5 ml-2" />
            المملكة
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white font-cairo">لعبة ألوان الفراعنة</h1>
        <Button onClick={downloadImage} variant="outline" className="utility-button">
            <Download className="w-5 h-5 ml-2" />
            حفظ
        </Button>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl h-[70vh]">
        <div className="flex-grow flex items-center justify-center bg-white rounded-lg overflow-hidden border-4 border-sand-ochre p-2">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="cursor-pointer object-contain"
            data-ai-hint={coloringImage?.imageHint}
          />
        </div>
        <div className="flex flex-col items-center p-6 bg-nile-dark/30 rounded-2xl border-2 border-gold-accent/20 lg:max-w-xs">
          <h2 className="text-xl font-cairo text-gold-accent mb-4">لوحة الألوان</h2>
          <div className="grid grid-cols-5 gap-3 mb-6">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className="w-12 h-12 rounded-full border-2 transition-transform transform hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor: selectedColor === color ? '#FFD700' : 'transparent',
                }}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
          <Button onClick={() => setSelectedColor(EraserColor)} variant="outline" className="utility-button w-full">
            <Eraser className="w-5 h-5 ml-2" />
            ممحاة
          </Button>
        </div>
      </div>
    </div>
  );
}
