import React, { useEffect, useRef, useState } from 'react';
import type { ActiveFormat, UserDetails, ImageTransform, PresetTheme } from '../types';
import { renderFormatA, renderFormatB } from '../utils/canvasRenderer';
import { Download, Share2, Check, RefreshCw, MessageSquare } from 'lucide-react';
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
  const [tweetPresetIndex, setTweetPresetIndex] = useState(0);
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
      colors: ['#FFECA8', '#FF007A', '#006B3E'],
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

  const tweetOptions = [
    `Just generated my official @HackerHouseGoa ${activeFormat === 'formatA' ? 'profile frame' : 'builder pass'}! 🌴\n\nRole: ${details.role || 'Web3 Builder'} | ${details.title || 'Protocol Engineer'}\nBuilding the future on the beaches of Goa this Oct 28–31. 🚀\n\n#FrameInGoa #HHGoa2026 #BuildInGoa`,
    `Goa is calling! ☀️ Coconut water in hand, code on screen. 🌴\n\nClaimed my official @HackerHouseGoa 2026 pass as a ${details.title || 'Builder'}.\nSee you all on the beaches of paradise! 🚀\n\n#FrameInGoa #Goa2026 #Web3`,
    `Build on the beach, ship from paradise. 🌴💻\n\nJust created my official @HackerHouseGoa pass!\nExcited to connect with Web3 builders in Goa this October. ✨\n\n#FrameInGoa #HHGoa2026 #BuildInGoa`,
  ];

  const currentTweetText = tweetOptions[tweetPresetIndex % tweetOptions.length];

  const handleShareToX = () => {
    handleCopyClipboard();
    const intentUrl = `https://x.com/intent/tweet?text=${encodeURIComponent(currentTweetText)}`;
    window.open(intentUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full flex flex-col items-center gap-5">
      {/* Canvas Container Box (Fits Canvas Smoothly) */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        className={`relative w-full rounded-2xl p-1.5 border-2 border-[#FFECA8]/50 shadow-2xl overflow-hidden select-none transition-all duration-300 ${
          activeFormat === 'formatA' ? 'max-w-[500px] aspect-square' : 'max-w-[460px] aspect-[1/1.4]'
        } ${image ? 'cursor-grab active:cursor-grabbing' : ''}`}
        style={{ backgroundColor: theme.bgColor }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full object-fill rounded-xl shadow-inner"
        />
      </div>

      {/* Action Buttons & Dynamic Tweet Box */}
      <div className="w-full max-w-[500px] space-y-3">
        {/* DOWNLOAD PNG Button */}
        <button
          type="button"
          onClick={handleDownload}
          className="btn-yellow-mockup w-full py-3.5 px-6 text-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <Download className="w-5 h-5 stroke-[2.5]" />
          <span>DOWNLOAD PNG</span>
        </button>

        {/* SHARE TO X Button */}
        <button
          type="button"
          onClick={handleShareToX}
          className="btn-pink-mockup w-full py-3.5 px-6 text-xl flex items-center justify-center gap-2 cursor-pointer shadow-md"
        >
          <Share2 className="w-5 h-5 stroke-[2.5]" />
          <span>SHARE TO X</span>
        </button>

        {/* Dynamic Tweet Preview Box */}
        <div className="bg-black/40 border border-[#FFECA8]/30 rounded-xl p-3.5 text-left space-y-2 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#FFECA8] flex items-center gap-1.5 uppercase">
              <MessageSquare className="w-3.5 h-3.5 text-[#FF007A]" />
              X / TWEET PRESET #{tweetPresetIndex + 1}
            </span>
            <button
              type="button"
              onClick={() => setTweetPresetIndex((prev) => (prev + 1) % tweetOptions.length)}
              className="text-xs font-bold text-[#FFECA8] hover:text-white flex items-center gap-1 cursor-pointer"
              title="Cycle tweet copy style"
            >
              <RefreshCw className="w-3 h-3 text-[#FF007A]" />
              <span>Change style</span>
            </button>
          </div>
          <p className="text-xs font-mono text-slate-200 whitespace-pre-line leading-relaxed bg-black/30 p-2.5 rounded-lg border border-white/10 select-all">
            {currentTweetText}
          </p>
        </div>

        {copied && (
          <div className="text-center pt-1">
            <span className="inline-flex items-center gap-1 text-xs text-black bg-[#FFECA8] font-bold px-3.5 py-1 rounded-full shadow">
              <Check className="w-3.5 h-3.5" />
              Image copied to clipboard for easy pasting into X!
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
