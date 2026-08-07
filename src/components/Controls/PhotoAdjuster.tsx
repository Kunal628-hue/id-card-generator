import React from 'react';
import type { ImageTransform } from '../../types';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw } from 'lucide-react';

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
    <div className="bg-[#003B20] p-3.5 rounded-2xl border border-[#00703C] space-y-3">
      <div className="flex items-center justify-between text-xs font-bold text-[#E6F4EC]">
        <span>Photo Framing</span>
        <button
          type="button"
          onClick={handleReset}
          className="text-[#FFEB00] hover:underline flex items-center gap-1 font-semibold cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Zoom */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs text-[#A8E6CF] font-semibold">
            <span>Zoom</span>
            <span>{transform.zoom.toFixed(2)}x</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateField('zoom', Math.max(0.5, transform.zoom - 0.1))}
              className="p-1 rounded-lg bg-[#004D2D] text-white hover:bg-[#006037]"
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
              className="w-full accent-[#FFEB00] bg-[#004D2D] h-1.5 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => updateField('zoom', Math.min(3, transform.zoom + 0.1))}
              className="p-1 rounded-lg bg-[#004D2D] text-white hover:bg-[#006037]"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Rotate */}
        <div className="space-y-1">
          <label className="text-xs text-[#A8E6CF] font-semibold block">
            Rotation
          </label>
          <button
            type="button"
            onClick={handleRotate}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-[#004D2D] hover:bg-[#006037] text-white rounded-xl text-xs font-bold transition-all border border-[#00703C] cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5 text-[#FFEB00]" />
            <span>Rotate ({transform.rotation}°)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
