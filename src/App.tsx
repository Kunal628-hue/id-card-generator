import { useState } from 'react';
import type { ActiveFormat, UserDetails, ImageTransform, PresetTheme } from './types';
import { FORMAT_A_THEMES } from './types';
import { Header } from './components/Header';
import { FormatSelector } from './components/FormatSelector';
import { ImageUploader } from './components/ImageUploader';
import { PhotoAdjuster } from './components/Controls/PhotoAdjuster';
import { BadgeForm } from './components/Controls/BadgeForm';
import { CanvasPreview } from './components/CanvasPreview';
import { Sparkles, Palmtree, ArrowUpRight } from 'lucide-react';

export default function App() {
  const [activeFormat, setActiveFormat] = useState<ActiveFormat>('formatA');
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [theme] = useState<PresetTheme>(FORMAT_A_THEMES[0]);

  const [details, setDetails] = useState<UserDetails>({
    name: 'Ada Lovelace',
    role: 'Full-stack • React / Node',
    handle: 'adalovelace',
    company: 'HH Goa 2026',
    title: 'Full-Stack Wanderer',
    badgeType: 'Builder',
  });

  const [transform, setTransform] = useState<ImageTransform>({
    zoom: 1,
    x: 0,
    y: 0,
    rotation: 0,
    brightness: 100,
    contrast: 100,
  });

  const handleImageLoaded = (img: HTMLImageElement) => {
    setImage(img);
    setTransform({
      zoom: 1,
      x: 0,
      y: 0,
      rotation: 0,
      brightness: 100,
      contrast: 100,
    });
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Sleek Top Header */}
      <Header />

      {/* Hero Header Banner */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-12 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#131B2B] border border-white/10 text-xs font-bold text-[#FFEB00] shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#FF007A]" />
            <span>HACKER HOUSE GOA 2026 OFFICIAL TOOL</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight font-['Playfair_Display'] text-white">
            Make your <span className="text-[#FFEB00]">Goa 2026</span> frame
          </h1>

          <p className="text-sm md:text-base text-slate-300 font-medium leading-relaxed">
            Upload your photo, personalize your builder title, and get a ready-to-share graphic for X in seconds!
          </p>
        </div>

        {/* Main 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Controls & Form (lg:col-span-5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="hh-glass-card p-6 md:p-7">
              {/* Format Tab Selector */}
              <FormatSelector
                activeFormat={activeFormat}
                onChangeFormat={setActiveFormat}
              />

              {/* Photo Upload Zone */}
              <ImageUploader
                onImageLoaded={handleImageLoaded}
                hasImage={!!image}
              />

              {/* Image Controls if image exists */}
              {image && (
                <div className="mt-5">
                  <PhotoAdjuster
                    transform={transform}
                    onChangeTransform={setTransform}
                  />
                </div>
              )}

              {/* Badge Details Form */}
              <div className="mt-5 border-t border-white/10 pt-5">
                <BadgeForm
                  details={details}
                  onChangeDetails={setDetails}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Live Graphic Canvas Preview (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            <div className="hh-glass-card p-6 md:p-8 w-full max-w-[580px] flex flex-col items-center">
              <CanvasPreview
                activeFormat={activeFormat}
                image={image}
                transform={transform}
                theme={theme}
                details={details}
                onTransformChange={setTransform}
              />
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-[#0D121C] py-6 px-4 text-center text-xs text-slate-400 font-medium mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Palmtree className="w-4 h-4 text-[#FFEB00]" />
            <span>Hacker House Goa 2026  •  28–31 OCT 2026</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://forms.gle/jM5hTaGvsrfEfixPA"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FFEB00] hover:underline font-bold inline-flex items-center gap-1"
            >
              <span>Submit Entry</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
            <span>#FrameInGoa</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
