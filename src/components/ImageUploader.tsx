import React, { useRef, useState } from 'react';
import { Image as ImageIcon, RefreshCw, AlertCircle } from 'lucide-react';
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
      setErrorMsg('Failed to process image. Try a JPG or PNG photo.');
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
        className={`border-2 border-dashed rounded-2xl p-7 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#FFEB00] bg-[#004226]'
            : hasImage
            ? 'border-[#007D48] bg-[#00492B] hover:border-[#FFEB00]'
            : 'border-[#007D48] bg-[#00492B]/80 hover:border-[#FFEB00] hover:bg-[#00492B]'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#00381F] flex items-center justify-center text-[#FFEB00]">
            {loading ? (
              <RefreshCw className="w-6 h-6 animate-spin text-[#FFEB00]" />
            ) : (
              <ImageIcon className="w-6 h-6 text-[#FFEB00]" />
            )}
          </div>

          <div>
            <p className="text-base font-bold text-white">
              {hasImage ? 'Tap to replace photo' : 'Tap to upload a photo'}
            </p>
            <p className="text-xs text-[#A8E6CF] mt-0.5 font-medium">
              JPG, PNG, or HEIC works best
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-2 text-xs text-[#FF007A] flex items-center justify-center gap-1 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {!hasImage && (
        <div className="mt-2.5 text-center">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              loadSample();
            }}
            className="text-xs text-[#FFEB00] hover:underline underline-offset-4 font-semibold transition-colors cursor-pointer"
          >
            Or test with Sample Demo Photo
          </button>
        </div>
      )}
    </div>
  );
};
