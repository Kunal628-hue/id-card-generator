import type { UserDetails, ImageTransform, PresetTheme } from '../types';

export const CANVAS_SIZE = 2000;

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/**
 * Draw Grid Pixel Logo Icon (Bottom Left of Format B)
 */
function drawGridPixelLogo(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.fillStyle = '#FFEB00';
  ctx.fillRect(x, y, size, size);

  ctx.fillStyle = '#006B3E';
  const grid = 3;
  const cellSize = size / grid;

  // Pattern matching yellow grid logo
  ctx.fillRect(x + cellSize, y, cellSize, cellSize);
  ctx.fillRect(x, y + cellSize, cellSize, cellSize);
  ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize, cellSize);

  ctx.restore();
}

function drawTransformedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cropArea: { x: number; y: number; width: number; height: number },
  transform: ImageTransform,
  isCircle: boolean = false
) {
  ctx.save();
  
  ctx.beginPath();
  if (isCircle) {
    const cx = cropArea.x + cropArea.width / 2;
    const cy = cropArea.y + cropArea.height / 2;
    const radius = Math.min(cropArea.width, cropArea.height) / 2;
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  } else {
    drawRoundedRect(ctx, cropArea.x, cropArea.y, cropArea.width, cropArea.height, 48);
  }
  ctx.clip();

  ctx.fillStyle = '#004D2D';
  ctx.fill();

  ctx.filter = `brightness(${transform.brightness}%) contrast(${transform.contrast}%) saturate(${transform.saturation ?? 100}%)`;

  const centerX = cropArea.x + cropArea.width / 2;
  const centerY = cropArea.y + cropArea.height / 2;

  ctx.translate(centerX + transform.x * (cropArea.width / 500), centerY + transform.y * (cropArea.height / 500));
  ctx.rotate((transform.rotation * Math.PI) / 180);

  const scale = Math.max(cropArea.width / img.width, cropArea.height / img.height) * transform.zoom;
  const drawW = img.width * scale;
  const drawH = img.height * scale;

  ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);

  ctx.restore();
}

/**
 * Draw Official Devanagari "गोवा" Hot Pink Sticker Badge
 */
function drawGoaDevanagariSticker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  textColor: string = '#FFEB00'
) {
  ctx.save();
  
  ctx.fillStyle = '#FF007A';
  drawRoundedRect(ctx, x, y, width, height, height / 2);
  ctx.fill();
  
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#FFEB00';
  ctx.stroke();

  ctx.fillStyle = textColor;
  ctx.font = '900 64px "Rozha One", "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('गोवा', x + width / 2, y + height / 2 + 20);

  ctx.restore();
}

/**
 * Render Format A: Profile Frame
 */
export function renderFormatA(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  transform: ImageTransform,
  _theme: PresetTheme,
  _details: UserDetails
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  // 1. Emerald Green Background
  ctx.fillStyle = '#006B3E';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // 2. Top Title "HACKER HOUSE"
  ctx.save();
  ctx.fillStyle = '#FFEB00';
  ctx.font = '900 140px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE', CANVAS_SIZE / 2, 280);
  ctx.restore();

  // 3. Center Circular Frame & Concentric Rings
  const photoSize = 1180;
  const cropArea = {
    x: (CANVAS_SIZE - photoSize) / 2,
    y: (CANVAS_SIZE - photoSize) / 2 + 60,
    width: photoSize,
    height: photoSize,
  };

  const centerX = CANVAS_SIZE / 2;
  const centerY = cropArea.y + photoSize / 2;
  const radius = photoSize / 2;

  if (img) {
    drawTransformedImage(ctx, img, cropArea, transform, true);
  } else {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#005833';
    ctx.fill();
    ctx.restore();
  }

  // Concentric Rings
  ctx.save();

  // Outer Thick Yellow Ring
  ctx.lineWidth = 32;
  ctx.strokeStyle = '#FFEB00';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 20, 0, Math.PI * 2);
  ctx.stroke();

  // Inner Thin Pink Ring
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#FF007A';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 45, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();

  // 4. Top Devanagari "गोवा" Sticker Badge
  drawGoaDevanagariSticker(ctx, CANVAS_SIZE / 2 - 150, cropArea.y - 45, 300, 90, '#FFEB00');

  // 5. Bottom Branded Badge Pill
  ctx.save();
  const pillW = 480;
  const pillH = 160;
  const pillX = (CANVAS_SIZE - pillW) / 2;
  const pillY = cropArea.y + photoSize - 30;

  ctx.fillStyle = '#FF007A';
  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 80);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 48px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('HH GOA 2026', CANVAS_SIZE / 2, pillY + 70);

  ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('#FrameInGoa', CANVAS_SIZE / 2, pillY + 120);

  ctx.restore();
}

/**
 * Render Format B: Builder Badge (Full-Canvas High-Impact Layout)
 */
export function renderFormatB(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  transform: ImageTransform,
  _theme: PresetTheme,
  details: UserDetails
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  // 1. Emerald Green Background
  ctx.fillStyle = '#006B3E';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // 2. Outer Border Frame (Thin Yellow Line with Rounded Corners)
  ctx.save();
  ctx.strokeStyle = '#FFEB00';
  ctx.lineWidth = 6;
  drawRoundedRect(ctx, 50, 50, CANVAS_SIZE - 100, CANVAS_SIZE - 100, 56);
  ctx.stroke();
  ctx.restore();

  // 3. Top Right Devanagari "गोवा" Hot Pink Sticker Badge
  drawGoaDevanagariSticker(ctx, CANVAS_SIZE - 330, 90, 230, 85, '#FFFFFF');

  // 4. Header: HACKER HOUSE & Subtitle
  ctx.save();
  ctx.fillStyle = '#FFEB00';
  ctx.font = '900 135px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE', CANVAS_SIZE / 2, 230);

  ctx.fillStyle = '#FFEB00';
  ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('OFFICIAL BUILDER PASS  ·  GOA 2026', CANVAS_SIZE / 2, 295);
  ctx.restore();

  // 5. Center Photo Area (Large 860x860 px Photo Frame)
  const photoSize = 860;
  const photoX = (CANVAS_SIZE - photoSize) / 2;
  const photoY = 350;

  const photoArea = {
    x: photoX,
    y: photoY,
    width: photoSize,
    height: photoSize,
  };

  if (img) {
    drawTransformedImage(ctx, img, photoArea, transform, false);
  } else {
    ctx.save();
    drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 48);
    ctx.fillStyle = '#005833';
    ctx.fill();

    ctx.fillStyle = '#00854A';
    ctx.font = '700 42px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PHOTO AREA', photoX + photoSize / 2, photoY + photoSize / 2);
    ctx.restore();
  }

  // Photo Frame Thick Yellow Border
  ctx.save();
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#FFEB00';
  drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 48);
  ctx.stroke();
  ctx.restore();

  // 6. Name in Extra Large Bold Yellow Serif Font (125px)
  let currentY = photoY + photoSize + 150;
  ctx.save();
  const displayName = (details.name.trim() || 'SATOSHI NAKAMOTO').toUpperCase();
  ctx.fillStyle = '#FFEB00';
  ctx.font = '900 125px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText(displayName, CANVAS_SIZE / 2, currentY);

  currentY += 85;

  // 7. Role / Title Hot Pink Banner (Spans 1650px wide x 110px high across card!)
  const roleText = (details.role.trim() || 'FULLSTACK WEB3').toUpperCase();
  const titleText = (details.title.trim() || 'PROTOCOL ENGINEER').toUpperCase();
  const fullTagText = `${roleText} · ${titleText}`;

  const roleW = 1650;
  const roleH = 110;
  const roleX = (CANVAS_SIZE - roleW) / 2;

  ctx.fillStyle = '#FF007A';
  drawRoundedRect(ctx, roleX, currentY, roleW, roleH, 55);
  ctx.fill();

  ctx.fillStyle = '#FFEB00';
  ctx.font = '800 40px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(fullTagText, CANVAS_SIZE / 2, currentY + 70);

  ctx.restore();

  // 8. Footer Section (Line Rule, Grid Logo, Handle, Event Dates)
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 235, 0, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(100, CANVAS_SIZE - 180);
  ctx.lineTo(CANVAS_SIZE - 100, CANVAS_SIZE - 180);
  ctx.stroke();

  // Bottom Left: Yellow Grid Logo Icon
  drawGridPixelLogo(ctx, 100, CANVAS_SIZE - 140, 90);

  // Bottom Center: @HackerHouseGoa
  ctx.fillStyle = '#FFEB00';
  ctx.font = '800 38px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('@HackerHouseGoa', CANVAS_SIZE / 2, CANVAS_SIZE - 80);

  // Bottom Right: GOA, INDIA · 28–31 OCT 2026
  ctx.fillStyle = 'rgba(255, 235, 0, 0.9)';
  ctx.font = '700 30px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('GOA, INDIA · 28–31 OCT 2026', CANVAS_SIZE - 100, CANVAS_SIZE - 80);

  ctx.restore();
}

/**
 * Convert uploaded file to HTMLImageElement (with HEIC support)
 */
export async function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  let fileToLoad = file;

  if (file.name.toLowerCase().endsWith('.heic') || file.type === 'image/heic') {
    try {
      const heic2any = (await import('heic2any')).default;
      const convertedBlob = await heic2any({
        blob: file,
        toType: 'image/jpeg',
        quality: 0.9,
      });
      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      fileToLoad = new File([blob], file.name.replace(/\.heic$/i, '.jpg'), { type: 'image/jpeg' });
    } catch (e) {
      console.warn('HEIC fallback failed', e);
    }
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(fileToLoad);
  });
}
