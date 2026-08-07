import React, { useRef, useState } from 'react';
import { Upload, Image as ImageIcon, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { loadImageFromFile } from '../utils/canvasRenderer';

interface ImageUploaderProps {
  onImageLoaded: (img: HTMLImageElement) => void;
  hasImage: boolean;
}

function createSampleAvatarImage(): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#005632';
      ctx.fillRect(0, 0, 800, 800);

      ctx.fillStyle = '#FFEB00';
      ctx.beginPath();
      ctx.arc(400, 320, 140, 0, Math.PI * 2);
      ctx.fill();

      // Glasses
      ctx.fillStyle = '#006B3E';
      ctx.fillRect(290, 290, 95, 55);
      ctx.fillRect(415, 290, 95, 55);
      ctx.fillRect(380, 310, 40, 15);

      // Body
      ctx.fillStyle = '#FFEB00';
      ctx.beginPath();
      ctx.ellipse(400, 720, 240, 220, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = canvas.toDataURL('image/png');
  });
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageLoaded,
  hasImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (file: File) => {
    if (!file) return;
    setLoading(true);
    setErrorMsg(null);
    try {
      const loadedImg = await loadImageFromFile(file);
      onImageLoaded(loadedImg);
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to process image. Try a JPG, PNG, or HEIC photo.');
    } finally {
      setLoading(false);
    }
  };

  const loadSample = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const img = await createSampleAvatarImage();
      onImageLoaded(img);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/heic, .heic"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileChange(e.target.files[0]);
          }
        }}
      />

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 ${
          isDragging
            ? 'border-[#FFEB00] bg-[#FFEB00]/10 scale-[1.01]'
            : hasImage
            ? 'border-emerald-500/50 bg-[#131B2B] hover:border-emerald-400'
            : 'border-white/15 bg-[#131B2B]/70 hover:border-[#FFEB00]/80 hover:bg-[#131B2B]'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-2.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#006B3E] to-[#00824A] border border-white/10 flex items-center justify-center text-[#FFEB00] shadow-md">
            {loading ? (
              <RefreshCw className="w-6 h-6 animate-spin text-[#FFEB00]" />
            ) : hasImage ? (
              <ImageIcon className="w-6 h-6 text-[#FFEB00]" />
            ) : (
              <Upload className="w-6 h-6 text-[#FFEB00]" />
            )}
          </div>

          <div>
            <p className="text-sm font-bold text-white">
              {hasImage ? 'Click or drag to replace photo' : 'Upload your photo (JPG, PNG, HEIC)'}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports iPhone photos, portrait & landscape formats
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-3 text-xs text-[#FF007A] flex items-center justify-center gap-1 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {!hasImage && (
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              loadSample();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-[#FFEB00] hover:text-yellow-300 bg-[#131B2B] hover:bg-[#1C273D] border border-white/10 px-3.5 py-1.5 rounded-full transition-all cursor-pointer font-semibold shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#FF007A]" />
            <span>Test with Demo Sample Photo</span>
          </button>
        </div>
      )}
    </div>
  );
};
