import React from 'react';
import type { PresetTheme } from '../../types';
import { PRESET_THEMES } from '../../types';
import { Palette, Check } from 'lucide-react';

interface ThemePickerProps {
  currentTheme: PresetTheme;
  onSelectTheme: (theme: PresetTheme) => void;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  return (
    <div className="space-y-3 pt-2">
      <label className="font-hh-display text-base tracking-wider text-[#FFECA8] uppercase flex items-center gap-1.5">
        <Palette className="w-4 h-4 text-[#FF007A]" />
        GOA COLOR THEMES & PALETTES
      </label>

      {/* Grid of Theme Option Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {PRESET_THEMES.map((theme) => {
          const isSelected = currentTheme.id === theme.id;
          return (
            <button
              key={theme.id}
              type="button"
              onClick={() => onSelectTheme(theme)}
              className={`relative flex flex-col items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'border-[#FFECA8] bg-black/60 ring-2 ring-[#FFECA8] scale-[1.03] shadow-lg'
                  : 'border-[#FFECA8]/30 bg-black/30 hover:border-[#FFECA8]/70 hover:bg-black/40'
              }`}
            >
              {/* Checkmark badge */}
              {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#FFECA8] text-black flex items-center justify-center shadow-md">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              {/* Color Swatch Circles */}
              <div className="flex items-center gap-1.5 my-1">
                <div
                  className="w-4 h-4 rounded-full border border-white/50 shadow-sm"
                  style={{ backgroundColor: theme.bgColor }}
                  title="Background Color"
                />
                <div
                  className="w-4 h-4 rounded-full border border-white/50 shadow-sm"
                  style={{ backgroundColor: theme.primaryYellow }}
                  title="Primary Accent"
                />
                <div
                  className="w-4 h-4 rounded-full border border-white/50 shadow-sm"
                  style={{ backgroundColor: theme.accentPink }}
                  title="Secondary Accent"
                />
              </div>

              {/* Theme Name */}
              <span className={`text-[11px] font-bold truncate w-full text-center ${isSelected ? 'text-[#FFECA8]' : 'text-slate-200'}`}>
                {theme.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
