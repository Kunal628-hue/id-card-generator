import React, { useEffect, useRef, useState } from 'react';
import type { ActiveFormat, UserDetails, ImageTransform, PresetTheme } from '../types';
import { renderFormatA, renderFormatB } from '../utils/canvasRenderer';
import { Download, ArrowRight, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CanvasPreviewProps {
  activeFormat: ActiveFormat;
  image: HTMLImageElement | null;
  transform: ImageTransform;
  theme: PresetTheme;
  details: UserDetails;
  onTransformChange: (t: ImageTransform) => void;
}

export const CanvasPreview: React.FC<CanvasPreviewProps> = ({
  activeFormat,
  image,
  transform,
  theme,
  details,
  onTransformChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; initialX: number; initialY: number } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    if (activeFormat === 'formatA') {
      renderFormatA(canvasRef.current, image, transform, theme, details);
    } else {
      renderFormatB(canvasRef.current, image, transform, theme, details);
    }
  }, [activeFormat, image, transform, theme, details]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!image) return;
    setIsDraggingCanvas(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      initialX: transform.x,
      initialY: transform.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingCanvas || !dragStartRef.current) return;
    const deltaX = (e.clientX - dragStartRef.current.x) * 1.2;
    const deltaY = (e.clientY - dragStartRef.current.y) * 1.2;
    onTransformChange({
      ...transform,
      x: Math.min(300, Math.max(-300, Math.round(dragStartRef.current.initialX + deltaX))),
      y: Math.min(300, Math.max(-300, Math.round(dragStartRef.current.initialY + deltaY))),
    });
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
    dragStartRef.current = null;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!image || e.touches.length !== 1) return;
    setIsDraggingCanvas(true);
    dragStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      initialX: transform.x,
      initialY: transform.y,
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingCanvas || !dragStartRef.current || e.touches.length !== 1) return;
    const deltaX = (e.touches[0].clientX - dragStartRef.current.x) * 1.2;
    const deltaY = (e.touches[0].clientY - dragStartRef.current.y) * 1.2;
    onTransformChange({
      ...transform,
      x: Math.min(300, Math.max(-300, Math.round(dragStartRef.current.initialX + deltaX))),
      y: Math.min(300, Math.max(-300, Math.round(dragStartRef.current.initialY + deltaY))),
    });
  };

  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFEB00', '#FF007A', '#006B3E'],
    });

    const link = document.createElement('a');
    const filename = activeFormat === 'formatA'
      ? `HackerHouseGoa2026_Frame_${details.name.replace(/\s+/g, '_') || 'Builder'}.png`
      : `HackerHouseGoa2026_Badge_${details.name.replace(/\s+/g, '_') || 'Builder'}.png`;

    link.download = filename;
    link.href = canvasRef.current.toDataURL('image/png', 1.0);
    link.click();
  };

  const handleCopyClipboard = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        const item = new ClipboardItem({ 'image/png': blob });
        await navigator.clipboard.write([item]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      });
    } catch (err) {
      console.warn('Clipboard copy error', err);
    }
  };

  const handleShareToX = () => {
    handleCopyClipboard();

    const text = encodeURIComponent(
      `My Hacker House Goa 2026 frame is ready. See you in Goa! #FrameInGoa @HHGoa`
    );
    const intentUrl = `https://x.com/intent/tweet?text=${text}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* Outer Canvas Box Container */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className={`relative w-full max-w-[500px] aspect-square rounded-[2rem] p-2.5 bg-[#005632] border border-[#00824A] shadow-2xl overflow-hidden select-none ${
          image ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain rounded-[1.5rem] bg-[#006B3E]"
        />

        {image && (
          <div className="absolute top-4 left-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-center">
            <span className="bg-[#00381F]/90 text-[#FFEB00] text-xs font-semibold px-3 py-1 rounded-full shadow border border-[#00703C]">
              Drag on photo to adjust position
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons Bar */}
      <div className="w-full max-w-[500px] space-y-2.5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Yellow Download Button */}
          <button
            type="button"
            onClick={handleDownload}
            className="flex items-center justify-center gap-2 bg-[#FFEB00] hover:bg-[#FFF242] text-[#004D2D] font-extrabold text-sm md:text-base py-3.5 px-6 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[3]" />
            <span>Download</span>
          </button>

          {/* Hot Pink Share to X Button */}
          <button
            type="button"
            onClick={handleShareToX}
            className="flex items-center justify-center gap-2 bg-[#FF007A] hover:bg-[#FF2690] text-white font-extrabold text-sm md:text-base py-3.5 px-6 rounded-full shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <ArrowRight className="w-4 h-4" />
            <span>Share to X</span>
          </button>
        </div>

        {/* Share caption note */}
        <p className="text-xs text-center text-[#A8E6CF] font-medium">
          Shares as: <span className="text-[#FFEB00] font-bold">"My Hacker House Goa 2026 frame is ready. #FrameInGoa"</span>
        </p>

        {copied && (
          <div className="text-center">
            <span className="inline-flex items-center gap-1 text-xs text-[#FFEB00] bg-[#004226] font-bold px-3 py-1 rounded-full border border-[#007843]">
              <Check className="w-3.5 h-3.5" />
              Image copied to clipboard for easy pasting into X!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
