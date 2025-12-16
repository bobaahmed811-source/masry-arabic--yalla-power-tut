
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Home, Palette, Eraser, Download } from 'lucide-react';
import Link from 'next/link';
import placeholderData from '@/lib/placeholder-images.json';

const colors = [
  '#FFD700', // Gold
  '#4682B4', // Steel Blue
  '#B22222', // Firebrick Red
  '#006400', // Dark Green
  '#FFFFFF', // White
  '#000000', // Black
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
    image.crossOrigin = 'anonymous'; // Needed for images from other domains
    image.src = coloringImage.imageUrl;

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);
    };

  }, [coloringImage]);

  const getCoordinates = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };
  
  const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: string) => {
    const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    const { width, height, data } = imageData;
    const startPos = (startY * width + startX) * 4;
    
    const startR = data[startPos];
    const startG = data[startPos + 1];
    const startB = data[startPos + 2];

    const fillR = parseInt(fillColor.slice(1, 3), 16);
    const fillG = parseInt(fillColor.slice(3, 5), 16);
    const fillB = parseInt(fillColor.slice(5, 7), 16);

    if (startR === fillR && startG === fillG && startB === fillB) {
      return;
    }

    const pixelStack = [[startX, startY]];

    while (pixelStack.length) {
      const [newX, newY] = pixelStack.pop()!;
      let x = newX;
      let y = newY;
      let pixelPos = (y * width + x) * 4;
      
      while (y-- >= 0 && matchStartColor(pixelPos)) {
        pixelPos -= width * 4;
      }
      pixelPos += width * 4;
      y++;

      let reachLeft = false;
      let reachRight = false;
      
      while (y++ < height - 1 && matchStartColor(pixelPos)) {
        colorPixel(pixelPos);

        if (x > 0) {
          if (matchStartColor(pixelPos - 4)) {
            if (!reachLeft) {
              pixelStack.push([x - 1, y]);
              reachLeft = true;
            }
          } else if (reachLeft) {
            reachLeft = false;
          }
        }

        if (x < width - 1) {
          if (matchStartColor(pixelPos + 4)) {
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

    function matchStartColor(pixelPos: number) {
        const r = data[pixelPos];
        const g = data[pixelPos+1];
        const b = data[pixelPos+2];
        return r === startR && g === startG && b === startB;
    }

    function colorPixel(pixelPos: number) {
        data[pixelPos] = fillR;
        data[pixelPos+1] = fillG;
        data[pixelPos+2] = fillB;
        data[pixelPos+3] = 255;
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const coords = getCoordinates(event);
    if (!ctx || !coords) return;

    floodFill(ctx, Math.floor(coords.x), Math.floor(coords.y), selectedColor);
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
    <div className="min-h-screen w-full bg-kids-bg text-white p-4 sm:p-6 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl flex items-center justify-between mb-6">
        <Link href="/" passHref>
          <Button variant="outline" className="utility-button">
            <Home className="w-5 h-5 mr-2" />
            العودة للمملكة
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-white font-cairo">لعبة ألوان الفراعنة</h1>
        <Button onClick={downloadImage} variant="outline" className="utility-button">
            <Download className="w-5 h-5 mr-2" />
            حفظ العمل الفني
        </Button>
      </header>

      <div className="flex flex-col lg:flex-row gap-8 w-full max-w-5xl">
        {/* -- Controls -- */}
        <div className="flex flex-col items-center p-6 bg-nile-dark/30 rounded-2xl border-2 border-gold-accent/20">
          <h2 className="text-xl font-cairo text-gold-accent mb-4">لوحة الألوان</h2>
          <div className="grid grid-cols-3 gap-3 mb-6">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className="w-12 h-12 rounded-full border-2 transition-transform transform hover:scale-110"
                style={{
                  backgroundColor: color,
                  borderColor: selectedColor === color ? '#FFD700' : 'transparent',
                }}
              />
            ))}
          </div>
          <Button onClick={() => setSelectedColor(EraserColor)} variant="outline" className="utility-button w-full">
            <Eraser className="w-5 h-5 mr-2" />
            ممحاة
          </Button>
        </div>

        {/* -- Canvas -- */}
        <div className="flex-grow flex items-center justify-center bg-white rounded-lg overflow-hidden border-4 border-sand-ochre">
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="cursor-pointer"
            data-ai-hint={coloringImage?.imageHint}
          />
        </div>
      </div>
    </div>
  );
}
