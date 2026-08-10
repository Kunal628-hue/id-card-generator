import React, { useRef, useState } from 'react';
import { FileUp, RefreshCw, AlertCircle, CloudCheck } from 'lucide-react';
import { loadImageFromFile } from '../utils/canvasRenderer';
import { uploadFileToVercelBlob, createSampleAvatarImage } from '../utils/imageStorage';

interface ImageUploaderProps {
  onImageLoaded: (img: HTMLImageElement) => void;
  hasImage: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageLoaded,
  hasImage,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [blobUploaded, setBlobUploaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = async (file: File) => {
    if (!file) return;
    setLoading(true);
    setErrorMsg(null);
    setBlobUploaded(false);

    try {
      // 1. Attempt Vercel Blob Cloud Storage upload
      const blobUrl = await uploadFileToVercelBlob(file);

      if (blobUrl) {
        setBlobUploaded(true);
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          onImageLoaded(img);
          setLoading(false);
        };
        img.onerror = async () => {
          const fallbackImg = await loadImageFromFile(file);
          onImageLoaded(fallbackImg);
          setLoading(false);
        };
        img.src = blobUrl;
      } else {
        // Fallback to local image processing if Blob storage API is not reachable locally
        const loadedImg = await loadImageFromFile(file);
        onImageLoaded(loadedImg);
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to process image. Try a JPG, PNG, or HEIC photo.');
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
            ? 'border-[#FFECA8] bg-[#FFECA8]/20'
            : hasImage
            ? 'border-[#FFECA8]/80 bg-black/40'
            : 'border-[#FFECA8]/60 bg-black/25 hover:border-[#FFECA8] hover:bg-black/40'
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
            {blobUploaded && (
              <p className="text-xs font-bold text-[#FFECA8] inline-flex items-center gap-1 pt-1">
                <CloudCheck className="w-3.5 h-3.5" />
                Uploaded to Vercel Blob Storage
              </p>
            )}
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
