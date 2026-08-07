import { useState } from 'react';
import { Header } from './components/Header';
import { FormatSelector } from './components/FormatSelector';
import { ImageUploader } from './components/ImageUploader';
import { PhotoAdjuster } from './components/Controls/PhotoAdjuster';
import { BadgeForm } from './components/Controls/BadgeForm';
import { CanvasPreview } from './components/CanvasPreview';
import type {
  ActiveFormat,
  UserDetails,
  ImageTransform,
  PresetTheme,
} from './types';
import { FORMAT_A_THEMES, FORMAT_B_THEMES } from './types';

export function App() {
  const [activeFormat, setActiveFormat] = useState<ActiveFormat>('formatA');
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const [transform, setTransform] = useState<ImageTransform>({
    zoom: 1.0,
    x: 0,
    y: 0,
    rotation: 0,
    brightness: 100,
    contrast: 100,
  });

  const [details, setDetails] = useState<UserDetails>({
    name: 'Ada Lovelace',
    role: 'Full-stack • React / Node',
    title: 'Full-Stack Wanderer',
    handle: '@adalovelace',
    company: 'HH Goa 2026',
    badgeType: 'Builder',
  });

  const [selectedTheme, setSelectedTheme] = useState<PresetTheme>(FORMAT_A_THEMES[0]);

  const handleFormatChange = (format: ActiveFormat) => {
    setActiveFormat(format);
    if (format === 'formatA') {
      setSelectedTheme(FORMAT_A_THEMES[0]);
    } else {
      setSelectedTheme(FORMAT_B_THEMES[0]);
    }
  };

  const handleImageLoaded = (img: HTMLImageElement) => {
    setImage(img);
    setTransform({
      zoom: 1.0,
      x: 0,
      y: 0,
      rotation: 0,
      brightness: 100,
      contrast: 100,
    });
  };

  return (
    <div className="min-h-screen bg-[#006B3E] text-white flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      
      {/* Official Poster Header */}
      <Header />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-4 md:py-6 space-y-6">
        
        {/* Headline & Subtitle matching poster theme */}
        <div className="space-y-2 max-w-2xl">
          <p className="text-[#FF007A] font-extrabold text-xs tracking-widest uppercase">
            Selection Framework & Timeline
          </p>
          <h1 className="font-hh-serif font-black text-3xl md:text-5xl text-[#FFEB00] tracking-tight leading-tight">
            Make your Goa 2026 frame
          </h1>

          <p className="text-[#E6F4EC] text-sm md:text-base font-medium leading-relaxed">
            Upload a photo, add your details, and download a graphic that's ready for X. Everything happens in your browser — nothing is uploaded anywhere.
          </p>
        </div>

        {/* Two-Column Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
          
          {/* Left Column: Container Card with Inputs */}
          <div className="lg:col-span-5 bg-[#005632] p-5 md:p-6 rounded-[2rem] border border-[#00824A] shadow-xl space-y-5">
            
            {/* Format Selector Tabs */}
            <FormatSelector
              activeFormat={activeFormat}
              onChangeFormat={handleFormatChange}
            />

            {/* Tap to Upload Photo Box */}
            <ImageUploader
              onImageLoaded={handleImageLoaded}
              hasImage={!!image}
            />

            {/* Photo Adjuster */}
            {image && (
              <PhotoAdjuster
                transform={transform}
                onChangeTransform={setTransform}
              />
            )}

            {/* Form Fields for Builder Badge Mode */}
            {activeFormat === 'formatB' && (
              <BadgeForm
                details={details}
                onChangeDetails={setDetails}
              />
            )}

          </div>

          {/* Right Column: Live Graphic Preview & Download/Share Buttons */}
          <div className="lg:col-span-7 lg:sticky lg:top-8 flex flex-col items-center">
            <CanvasPreview
              activeFormat={activeFormat}
              image={image}
              transform={transform}
              theme={selectedTheme}
              details={details}
              onTransformChange={setTransform}
            />
          </div>

        </div>

      </main>

      {/* Footer matching Official Poster Footer */}
      <footer className="w-full py-6 px-4 text-center text-xs text-white font-semibold border-t border-[#00824A] bg-[#004D2D] mt-12">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>GOA, INDIA  •  28-31 OCT 2026</span>
          <span className="text-[#FFEB00] font-bold">EDITION 2026  •  #FrameInGoa</span>
        </div>
      </footer>

    </div>
  );
}

export default App;
