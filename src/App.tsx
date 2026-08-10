import { useState, useEffect } from 'react';
import type { ActiveFormat, UserDetails, ImageTransform, PresetTheme } from './types';
import { PRESET_THEMES } from './types';
import { Header } from './components/Header';
import { FormatSelector } from './components/FormatSelector';
import { ImageUploader } from './components/ImageUploader';
import { PhotoAdjuster } from './components/Controls/PhotoAdjuster';
import { BadgeForm } from './components/Controls/BadgeForm';
import { ThemePicker } from './components/Controls/ThemePicker';
import { CanvasPreview } from './components/CanvasPreview';
import { loadSavedImage, saveImageToStorage, loadSavedDetails, saveDetailsToStorage } from './utils/imageStorage';
import { Sun, Palmtree, Waves, Sparkles } from 'lucide-react';

const DEFAULT_DETAILS: UserDetails = {
  name: 'Satoshi Nakamoto',
  role: 'Fullstack Web3',
  handle: 'HackerHouseGoa',
  company: 'HH Goa 2026',
  title: 'Protocol Engineer',
  badgeType: 'Builder',
  photoShape: 'circle',
  showQrCode: true,
  qrData: 'https://x.com/HackerHouseGoa',
  currentlyShipping: 'Building the future',
  beachBag: ['Coconut Water', 'VS Code', 'Lo-Fi Beats'],
};

export default function App() {
  const [activeFormat, setActiveFormat] = useState<ActiveFormat>('formatA');
  const [image, setImage] = useState<HTMLImageElement | null>(null);
  const [theme, setTheme] = useState<PresetTheme>(PRESET_THEMES[0]);

  const [details, setDetails] = useState<UserDetails>(() =>
    loadSavedDetails(DEFAULT_DETAILS)
  );

  const [transform, setTransform] = useState<ImageTransform>({
    zoom: 1,
    x: 0,
    y: 0,
    rotation: 0,
    brightness: 100,
    contrast: 100,
    saturation: 100,
  });

  // Load saved photo on page refresh or initial mount
  useEffect(() => {
    loadSavedImage().then((loadedImg) => {
      if (loadedImg) {
        setImage(loadedImg);
      }
    });
  }, []);

  // Save form details on change
  const handleDetailsChange = (newDetails: UserDetails) => {
    setDetails(newDetails);
    saveDetailsToStorage(newDetails);
  };

  const handleImageLoaded = (img: HTMLImageElement) => {
    setImage(img);
    saveImageToStorage(img);
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
    <div
      className="min-h-screen text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif] transition-colors duration-500 relative overflow-x-hidden"
      style={{ backgroundColor: theme.bgColor }}
    >
      {/* Dynamic Background Tropical Glow & Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-20 z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FFEB00] blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-96 h-96 rounded-full bg-[#FF007A] blur-3xl" />
        <div className="absolute bottom-10 left-1/4 w-[600px] h-[600px] rounded-full bg-[#00A896] blur-3xl" />
      </div>

      {/* Top Navigation Header */}
      <Header />

      {/* Main Page Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 md:px-8 py-8 md:py-10 space-y-8 z-10 relative">
        
        {/* Hero Header Section */}
        <div className="space-y-3 text-center md:text-left">
          <div className="inline-flex items-center gap-2 border border-[#FFECA8]/60 px-3.5 py-1 text-xs font-mono font-bold tracking-wider text-[#FFECA8] rounded-full uppercase bg-black/30 backdrop-blur-sm">
            <Sun className="w-3.5 h-3.5 text-[#FFEB00]" />
            <span>OFFICIAL GOA 2026 BUILDER SUITE</span>
            <Waves className="w-3.5 h-3.5 text-[#38BDF8]" />
          </div>

          <h1 className="font-hh-display text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-wide text-[#FFECA8] leading-none uppercase drop-shadow-md">
            MAKE YOUR GOA 2026 FRAME & BADGE
          </h1>

          <p className="text-base md:text-xl text-slate-100 font-medium max-w-3xl flex items-center justify-center md:justify-start gap-2">
            <Palmtree className="w-5 h-5 text-[#FF007A] hidden sm:inline" />
            Join the tribe. Generate your official social media profile frame or builder pass for Hacker House Goa 2026.
          </p>
        </div>

        {/* 2-Column Mockup Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: CONFIGURATION Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="mockup-card p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md border-2 border-[#FFECA8]/40" style={{ backgroundColor: `${theme.cardBg}E6` }}>
              <div className="flex items-center justify-between border-b border-[#FFECA8]/20 pb-4">
                <h2 className="font-hh-display text-3xl tracking-wider text-white uppercase flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-[#FF007A]" />
                  CONFIGURATION
                </h2>
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#FF007A] text-white uppercase">
                  {theme.name}
                </span>
              </div>

              {/* Segmented Format Selector Tabs */}
              <FormatSelector
                activeFormat={activeFormat}
                onChangeFormat={setActiveFormat}
              />

              {/* Theme Picker Color Buttons */}
              <div className="border-b border-[#FFECA8]/20 pb-5">
                <ThemePicker
                  currentTheme={theme}
                  onSelectTheme={setTheme}
                />
              </div>

              {/* Dropzone Photo Uploader */}
              <ImageUploader
                onImageLoaded={handleImageLoaded}
                hasImage={!!image}
              />

              {/* Photo Framing & Setting Adjuster */}
              {image && (
                <div className="mt-4">
                  <PhotoAdjuster
                    transform={transform}
                    photoShape={details.photoShape || 'circle'}
                    onChangeTransform={setTransform}
                    onChangePhotoShape={(shape) => handleDetailsChange({ ...details, photoShape: shape })}
                  />
                </div>
              )}

              {/* Form Inputs */}
              <div className="border-t border-[#FFECA8]/20 pt-4">
                <BadgeForm
                  details={details}
                  onChangeDetails={handleDetailsChange}
                />
              </div>
            </div>
          </div>

          {/* Right Column: LIVE PREVIEW Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="mockup-card p-6 md:p-8 space-y-6 shadow-2xl backdrop-blur-md border-2 border-[#FFECA8]/40" style={{ backgroundColor: `${theme.cardBg}E6` }}>
              <div className="flex items-center justify-between border-b border-[#FFECA8]/20 pb-4">
                <h2 className="font-hh-display text-3xl tracking-wider text-white uppercase flex items-center gap-2">
                  <Sun className="w-6 h-6 text-[#FFEB00]" />
                  LIVE PREVIEW
                </h2>
                <span className="text-xs font-mono font-bold text-[#FFECA8]">
                  {activeFormat === 'formatA' ? '2000 x 2000px · Profile Frame' : '2000 x 2800px · Builder Pass'}
                </span>
              </div>

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

      {/* Footer */}
      <footer className="bg-[#0B0B0B] py-8 px-4 border-t border-white/10 text-xs font-mono text-slate-300 z-10 relative">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-hh-display text-2xl tracking-wider text-[#FFB3D9] uppercase">
              HACKER <span className="text-[#FF007A]">गोवा</span> HOUSE 2026
            </span>
            <span className="text-[10px] font-bold bg-[#FFEB00] text-black px-2 py-0.5 rounded">
              GOA, INDIA
            </span>
          </div>

          <div className="text-center text-slate-400">
            © 2026 HACKER HOUSE GOA. BUILT FOR THE REBELLION.
          </div>

          <div className="flex items-center gap-6 text-slate-400 font-sans font-medium">
            <a href="https://x.com/HackerHouseGoa" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">TWITTER / X</a>
            <a href="#" className="hover:text-white transition-colors">PRIVACY</a>
            <a href="#" className="hover:text-white transition-colors">SUPPORT</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
