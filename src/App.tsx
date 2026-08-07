import { useState } from 'react';
import type { ActiveFormat, UserDetails, ImageTransform, PresetTheme } from './types';
import { FORMAT_A_THEMES } from './types';
import { Header } from './components/Header';
import { FormatSelector } from './components/FormatSelector';
import { ImageUploader } from './components/ImageUploader';
import { PhotoAdjuster } from './components/Controls/PhotoAdjuster';
import { BadgeForm } from './components/Controls/BadgeForm';
import { CanvasPreview } from './components/CanvasPreview';

export default function App() {
  const [activeFormat, setActiveFormat] = useState<ActiveFormat>('formatA');
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [theme] = useState<PresetTheme>(FORMAT_A_THEMES[0]);

  const [details, setDetails] = useState<UserDetails>({
    name: 'Satoshi Nakamoto',
    role: 'Fullstack Web3',
    handle: 'HackerHouseGoa',
    company: 'HH Goa 2026',
    title: 'Protocol Engineer',
    badgeType: 'Builder',
  });

  const [transform, setTransform] = useState<ImageTransform>({
    zoom: 1,
    x: 0,
    y: 0,
    rotation: 0,
    brightness: 100,
    contrast: 100,
    saturation: 100,
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
      saturation: 100,
    });
  };


  return (
    <div className="min-h-screen bg-[#006B3E] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navigation Header matching Screenshot 1 */}
      <Header />

      {/* Main Page Layout matching Screenshot 1 */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-10 space-y-8">
        
        {/* Hero Header Section */}
        <div className="space-y-3">
          <div className="inline-block border border-[#FFECA8]/60 px-3 py-1 text-xs font-mono font-bold tracking-wider text-[#FFECA8] rounded uppercase">
            OFFICIAL TOOL
          </div>

          <h1 className="font-hh-display text-5xl md:text-7xl font-extrabold tracking-wide text-[#FFECA8] leading-none uppercase">
            MAKE YOUR GOA 2026 FRAME
          </h1>

          <p className="text-base md:text-lg text-slate-100 font-medium">
            Join the tribe. Generate your official social media profile frame or builder badge.
          </p>
        </div>

        {/* 2-Column Mockup Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: CONFIGURATION Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="mockup-card p-6 md:p-8 space-y-6">
              <h2 className="font-hh-display text-3xl tracking-wider text-white uppercase">
                CONFIGURATION
              </h2>

              {/* Segmented Format Selector Tabs */}
              <FormatSelector
                activeFormat={activeFormat}
                onChangeFormat={setActiveFormat}
              />

              {/* Dropzone Photo Uploader */}
              <ImageUploader
                onImageLoaded={handleImageLoaded}
                hasImage={!!image}
              />

              {/* Photo Framing Adjuster if image exists */}
              {image && (
                <div className="mt-4">
                  <PhotoAdjuster
                    transform={transform}
                    onChangeTransform={setTransform}
                  />
                </div>
              )}

              {/* Form Inputs */}
              <div className="border-t border-[#FFECA8]/20 pt-4">
                <BadgeForm
                  details={details}
                  onChangeDetails={setDetails}
                />
              </div>
            </div>
          </div>

          {/* Right Column: LIVE PREVIEW Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="mockup-card p-6 md:p-8 space-y-6">
              <h2 className="font-hh-display text-3xl tracking-wider text-white uppercase">
                LIVE PREVIEW
              </h2>

              {/* Canvas Preview & Buttons */}
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

      {/* Footer matching Screenshot 1 */}
      <footer className="bg-[#0B0B0B] py-6 px-4 border-t border-white/10 text-xs font-mono text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="font-hh-display text-2xl tracking-wider text-[#FFB3D9] uppercase">
            HACKER HOUSE GOA
          </div>

          <div className="text-center text-slate-400">
            © 2026 HACKER HOUSE GOA. BUILT FOR THE REBELLION.
          </div>

          <div className="flex items-center gap-6 text-slate-400 font-sans font-medium">
            <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-white transition-colors">TERMS</a>
            <a href="#" className="hover:text-white transition-colors">SUPPORT</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
