import React, { useRef, useState } from 'react';
import { FileUp, RefreshCw, AlertCircle } from 'lucide-react';
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
      ctx.fillStyle = '#005833';
      ctx.fillRect(0, 0, 800, 800);

      ctx.fillStyle = '#FFECA8';
      ctx.beginPath();
      ctx.arc(400, 320, 140, 0, Math.PI * 2);
      ctx.fill();

      // Glasses
      ctx.fillStyle = '#006B3E';
      ctx.fillRect(290, 290, 95, 55);
      ctx.fillRect(415, 290, 95, 55);
      ctx.fillRect(380, 310, 40, 15);

      // Body
      ctx.fillStyle = '#FFECA8';
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
    <div className="w-full relative">
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

      {/* Dashed Dropzone matching Screenshot 1 */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#FFECA8] bg-[#FFECA8]/10'
            : hasImage
            ? 'border-[#FFECA8]/80 bg-[#005833]/60'
            : 'border-[#FFECA8]/60 bg-transparent hover:border-[#FFECA8] hover:bg-[#005833]/30'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-3">
          {loading ? (
            <RefreshCw className="w-8 h-8 animate-spin text-[#FFECA8]" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-[#FFECA8] flex items-center justify-center text-black">
              <FileUp className="w-6 h-6 stroke-[2.5]" />
            </div>
          )}

          <div className="space-y-1">
            <p className="text-sm font-bold text-white">
              {hasImage ? 'Click to replace your photo.' : 'Drop your photo here or click to upload.'}
            </p>
            <p className="text-xs text-slate-200">
              JPG, PNG, HEIC supported.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="mt-3 text-xs text-[#FFB3D9] flex items-center justify-center gap-1 font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Try demo photo link at bottom right */}
      <div className="mt-2 text-right">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            loadSample();
          }}
          className="text-xs text-[#FFECA8] hover:underline font-medium cursor-pointer"
        >
          Try demo photo
        </button>
      </div>
    </div>
  );
};
