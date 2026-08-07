import React from 'react';
import type { ImageTransform, PhotoShape } from '../../types';
import { ZoomIn, ZoomOut, RotateCw, RotateCcw, Sliders, Sun, Contrast, Move, Sparkles, Circle, Square, Hexagon, Shapes } from 'lucide-react';

interface PhotoAdjusterProps {
  transform: ImageTransform;
  photoShape: PhotoShape;
  onChangeTransform: (newTransform: ImageTransform) => void;
  onChangePhotoShape: (shape: PhotoShape) => void;
}

export const PhotoAdjuster: React.FC<PhotoAdjusterProps> = ({
  transform,
  photoShape,
  onChangeTransform,
  onChangePhotoShape,
}) => {
  const updateField = (field: keyof ImageTransform, value: number) => {
    onChangeTransform({
      ...transform,
      [field]: value,
    });
  };

  const handleRotate90 = () => {
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
      saturation: 100,
    });
  };

  const shapesList: { id: PhotoShape; label: string; icon: React.ReactNode }[] = [
    { id: 'circle', label: 'Circle', icon: <Circle className="w-3.5 h-3.5" /> },
    { id: 'square', label: 'Square', icon: <Square className="w-3.5 h-3.5" /> },
    { id: 'squircle', label: 'Squircle', icon: <Shapes className="w-3.5 h-3.5" /> },
    { id: 'hexagon', label: 'Hexagon', icon: <Hexagon className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="bg-[#005632] border border-[#FFECA8]/40 p-4 md:p-5 rounded-xl space-y-4 shadow-md">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#FFECA8]/20 pb-3">
        <span className="font-hh-display text-lg tracking-wider text-[#FFECA8] flex items-center gap-2 uppercase">
          <Sliders className="w-4 h-4 text-[#FF007A]" />
          PHOTO SHAPE & IMAGE SETTINGS
        </span>
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-bold text-[#FFECA8] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All
        </button>
      </div>

      {/* Photo Frame Shape Selector Row */}
      <div className="space-y-1.5 border-b border-[#FFECA8]/20 pb-3">
        <label className="text-xs text-white font-bold flex items-center gap-1.5">
          <Shapes className="w-3.5 h-3.5 text-[#FF007A]" />
          PHOTO FRAME SHAPE
        </label>
        <div className="grid grid-cols-4 gap-2">
          {shapesList.map((item) => {
            const isSelected = photoShape === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onChangePhotoShape(item.id)}
                className={`flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#FFECA8] text-black shadow-md border border-[#FFECA8]'
                    : 'bg-[#006B3E] text-white hover:bg-[#007D48] border border-[#FFECA8]/20'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Image Controls */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* 1. Zoom Control */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-white font-semibold">
            <span className="flex items-center gap-1">
              <ZoomIn className="w-3.5 h-3.5 text-[#FFECA8]" />
              Zoom Scale
            </span>
            <span className="text-[#FFECA8] font-mono font-bold">{transform.zoom.toFixed(2)}x</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => updateField('zoom', Math.max(0.5, transform.zoom - 0.1))}
              className="p-1.5 rounded-lg bg-[#006B3E] text-white hover:bg-[#007D48] text-xs font-bold border border-[#FFECA8]/20 cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5 text-[#FFECA8]" />
            </button>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={transform.zoom}
              onChange={(e) => updateField('zoom', parseFloat(e.target.value))}
              className="w-full accent-[#FFECA8] bg-[#004729] h-2 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => updateField('zoom', Math.min(3, transform.zoom + 0.1))}
              className="p-1.5 rounded-lg bg-[#006B3E] text-white hover:bg-[#007D48] text-xs font-bold border border-[#FFECA8]/20 cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5 text-[#FFECA8]" />
            </button>
          </div>
        </div>

        {/* 2. Rotation Control */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-white font-semibold">
            <span>Rotation Angle</span>
            <span className="text-[#FFECA8] font-mono font-bold">{transform.rotation}°</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRotate90}
              className="w-full py-1.5 px-3 bg-[#006B3E] hover:bg-[#007D48] text-[#FFECA8] rounded-lg text-xs font-bold transition-all border border-[#FFECA8]/30 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5 text-[#FF007A]" />
              <span>Rotate 90°</span>
            </button>
          </div>
        </div>

        {/* 3. Brightness Control */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-white font-semibold">
            <span className="flex items-center gap-1">
              <Sun className="w-3.5 h-3.5 text-[#FFECA8]" />
              Brightness
            </span>
            <span className="text-[#FFECA8] font-mono font-bold">{transform.brightness}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            step="1"
            value={transform.brightness}
            onChange={(e) => updateField('brightness', parseInt(e.target.value))}
            className="w-full accent-[#FFECA8] bg-[#004729] h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* 4. Contrast Control */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-white font-semibold">
            <span className="flex items-center gap-1">
              <Contrast className="w-3.5 h-3.5 text-[#FFECA8]" />
              Contrast
            </span>
            <span className="text-[#FFECA8] font-mono font-bold">{transform.contrast}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="150"
            step="1"
            value={transform.contrast}
            onChange={(e) => updateField('contrast', parseInt(e.target.value))}
            className="w-full accent-[#FFECA8] bg-[#004729] h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* 5. Position Pan X (Horizontal) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-white font-semibold">
            <span className="flex items-center gap-1">
              <Move className="w-3.5 h-3.5 text-[#FFECA8]" />
              Pan Left / Right
            </span>
            <span className="text-[#FFECA8] font-mono font-bold">{transform.x}px</span>
          </div>
          <input
            type="range"
            min="-300"
            max="300"
            step="5"
            value={transform.x}
            onChange={(e) => updateField('x', parseInt(e.target.value))}
            className="w-full accent-[#FFECA8] bg-[#004729] h-2 rounded-lg cursor-pointer"
          />
        </div>

        {/* 6. Position Pan Y (Vertical) */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-white font-semibold">
            <span className="flex items-center gap-1">
              <Move className="w-3.5 h-3.5 text-[#FFECA8]" />
              Pan Up / Down
            </span>
            <span className="text-[#FFECA8] font-mono font-bold">{transform.y}px</span>
          </div>
          <input
            type="range"
            min="-300"
            max="300"
            step="5"
            value={transform.y}
            onChange={(e) => updateField('y', parseInt(e.target.value))}
            className="w-full accent-[#FFECA8] bg-[#004729] h-2 rounded-lg cursor-pointer"
          />
        </div>

      </div>

      {/* Color Mode Toggle */}
      <div className="border-t border-[#FFECA8]/20 pt-3 flex items-center justify-between">
        <span className="text-xs text-white font-semibold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#FF007A]" />
          Color Preset Mode
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => updateField('saturation', 100)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              transform.saturation === 100
                ? 'bg-[#FFECA8] text-black shadow-sm'
                : 'bg-[#006B3E] text-white hover:bg-[#007D48] border border-[#FFECA8]/20'
            }`}
          >
            Full Color
          </button>
          <button
            type="button"
            onClick={() => updateField('saturation', 0)}
            className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
              transform.saturation === 0
                ? 'bg-[#FF007A] text-white shadow-sm'
                : 'bg-[#006B3E] text-white hover:bg-[#007D48] border border-[#FFECA8]/20'
            }`}
          >
            Vintage B&W
          </button>
        </div>
      </div>

    </div>
  );
};
