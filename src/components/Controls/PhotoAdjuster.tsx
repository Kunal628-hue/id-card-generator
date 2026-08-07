import React from 'react';
import type { ImageTransform } from '../../types';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, Move } from 'lucide-react';

interface PhotoAdjusterProps {
  transform: ImageTransform;
  onChangeTransform: (newTransform: ImageTransform) => void;
}

export const PhotoAdjuster: React.FC<PhotoAdjusterProps> = ({
  transform,
  onChangeTransform,
}) => {
  const updateField = (field: keyof ImageTransform, value: number) => {
    onChangeTransform({
      ...transform,
      [field]: value,
    });
  };

  const handleRotate = () => {
    onChangeTransform({
      ...transform,
      rotation: (transform.rotation + 90) % 360,
    });
  };

  const handleReset = () => {
    onChangeTransform({
      zoom: 1,
      x: 0,
      y: 0,
      rotation: 0,
      brightness: 100,
      contrast: 100,
    });
  };

  return (
    <div className="bg-[#131B2B] p-4 rounded-2xl border border-white/10 space-y-3.5 shadow-md">
      <div className="flex items-center justify-between text-xs font-bold text-slate-200">
        <span className="flex items-center gap-1.5 uppercase tracking-wider">
          <Move className="w-3.5 h-3.5 text-[#FFEB00]" />
          Photo Framing & Zoom
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="text-[#FFEB00] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Zoom */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-slate-300 font-semibold">
            <span>Zoom</span>
            <span className="text-[#FFEB00] font-mono">{transform.zoom.toFixed(2)}x</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateField('zoom', Math.max(0.5, transform.zoom - 0.1))}
              className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={transform.zoom}
              onChange={(e) => updateField('zoom', parseFloat(e.target.value))}
              className="w-full accent-[#FFEB00] bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => updateField('zoom', Math.min(3, transform.zoom + 0.1))}
              className="p-1.5 rounded-lg bg-slate-800 text-white hover:bg-slate-700 text-xs font-bold"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Rotate */}
        <div className="space-y-1.5">
          <label className="text-xs text-slate-300 font-semibold block">
            Rotation
          </label>
          <button
            type="button"
            onClick={handleRotate}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all border border-white/10 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#FFEB00]" />
            <span>Rotate 90° ({transform.rotation}°)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
