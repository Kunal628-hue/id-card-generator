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
 * Draw an ultra-clean, elegant vector camera & photo placeholder when no custom photo is loaded
 */
function drawVectorPlaceholder(
  ctx: CanvasRenderingContext2D,
  cropArea: { x: number; y: number; width: number; height: number },
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

  // Rich Dark Emerald Background
  ctx.fillStyle = '#004729';
  ctx.fill();

  const cx = cropArea.x + cropArea.width / 2;
  const cy = cropArea.y + cropArea.height / 2;

  // Sleek Camera Icon Body
  const iconW = cropArea.width * 0.28;
  const iconH = cropArea.width * 0.22;
  
  ctx.fillStyle = '#00331D';
  drawRoundedRect(ctx, cx - iconW / 2, cy - iconH / 2, iconW, iconH, 20);
  ctx.fill();
  ctx.strokeStyle = '#FFEB00';
  ctx.lineWidth = 6;
  ctx.stroke();

  // Camera Lens Ring
  ctx.beginPath();
  ctx.arc(cx, cy, iconH * 0.32, 0, Math.PI * 2);
  ctx.strokeStyle = '#FFEB00';
  ctx.lineWidth = 6;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, iconH * 0.16, 0, Math.PI * 2);
  ctx.fillStyle = '#FF007A';
  ctx.fill();

  // Elegant Prompt Text
  ctx.fillStyle = '#FFEB00';
  ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('UPLOAD PHOTO', cx, cy + iconH / 2 + 70);

  ctx.restore();
}

/**
 * Draw QR Code / Barcode graphic on canvas
 */
function drawQRCodeGraphic(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  ctx.save();
  ctx.fillStyle = '#FFEB00';
  drawRoundedRect(ctx, x, y, size, size, 16);
  ctx.fill();

  ctx.fillStyle = '#004729';
  const grid = 7;
  const cellSize = (size - 24) / grid;
  
  for (let i = 0; i < grid; i++) {
    for (let j = 0; j < grid; j++) {
      if ((i === 0 || i === grid - 1 || j === 0 || j === grid - 1 || (i % 2 === 0 && j % 2 === 1)) && !(i > 1 && i < 5 && j > 1 && j < 5)) {
        ctx.fillRect(x + 12 + i * cellSize, y + 12 + j * cellSize, cellSize - 1.5, cellSize - 1.5);
      }
    }
  }
  
  ctx.fillStyle = '#FF007A';
  ctx.fillRect(x + size / 2 - 10, y + size / 2 - 10, 20, 20);
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

  ctx.fillStyle = '#004226';
  ctx.fill();

  ctx.filter = `brightness(${transform.brightness}%) contrast(${transform.contrast}%)`;

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
function drawGoaDevanagariSticker(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) {
  ctx.save();
  
  ctx.fillStyle = '#FF007A';
  drawRoundedRect(ctx, x, y, width, height, height / 2);
  ctx.fill();
  
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#FFEB00';
  ctx.stroke();

  ctx.fillStyle = '#FFEB00';
  ctx.font = '900 96px "Rozha One", "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('गोवा', x + width / 2, y + height / 2 + 30);

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

  // 1. Rich Emerald Green Canvas Background
  ctx.fillStyle = '#006B3E';
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // Outer Card Frame Border
  ctx.save();
  ctx.strokeStyle = '#00824A';
  ctx.lineWidth = 16;
  drawRoundedRect(ctx, 40, 40, CANVAS_SIZE - 80, CANVAS_SIZE - 80, 80);
  ctx.stroke();
  ctx.restore();

  // Poster Meta Header
  ctx.save();
  ctx.fillStyle = '#FFEB00';
  ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('247PM.STUDIO', 100, 110);

  ctx.textAlign = 'right';
  ctx.fillText('HHGOA.COM', CANVAS_SIZE - 100, 110);
  ctx.restore();

  // 2. Poster Tall Serif Title "HACKER HOUSE"
  ctx.save();
  ctx.fillStyle = '#FFEB00';
  ctx.font = '900 130px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE', CANVAS_SIZE / 2, 230);
  ctx.restore();

  // 3. Photo Area (Center Circular Frame)
  const photoSize = 1150;
  const cropArea = {
    x: (CANVAS_SIZE - photoSize) / 2,
    y: (CANVAS_SIZE - photoSize) / 2 + 50,
    width: photoSize,
    height: photoSize,
  };

  if (img) {
    drawTransformedImage(ctx, img, cropArea, transform, true);
  } else {
    drawVectorPlaceholder(ctx, cropArea, true);
  }

  // 4. Concentric Dual Ring Frames (Yellow + Hot Pink)
  ctx.save();
  const centerX = CANVAS_SIZE / 2;
  const centerY = cropArea.y + photoSize / 2;
  const radius = photoSize / 2;

  // Outer Yellow Ring (#FFEB00)
  ctx.lineWidth = 32;
  ctx.strokeStyle = '#FFEB00';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 24, 0, Math.PI * 2);
  ctx.stroke();

  // Inner Hot Pink Ring (#FF007A)
  ctx.lineWidth = 18;
  ctx.strokeStyle = '#FF007A';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 48, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 5. Devanagari "गोवा" Hot Pink Sticker Badge Overlay
  drawGoaDevanagariSticker(ctx, CANVAS_SIZE / 2 - 220, 240, 440, 140);

  // 6. Bottom Branded Badge Pill
  ctx.save();
  const pillW = 1000;
  const pillH = 170;
  const pillX = (CANVAS_SIZE - pillW) / 2;
  const pillY = CANVAS_SIZE - 320;

  ctx.fillStyle = '#FF007A';
  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 85);
  ctx.fill();

  ctx.lineWidth = 6;
  ctx.strokeStyle = '#FFEB00';
  ctx.stroke();

  ctx.fillStyle = '#FFEB00';
  ctx.font = '900 64px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('HH GOA 2026', CANVAS_SIZE / 2, pillY + 75);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('#FrameInGoa', CANVAS_SIZE / 2, pillY + 130);

  ctx.restore();

  // 7. Poster Footer Line Rule & Details
  ctx.save();
  ctx.strokeStyle = '#FFEB00';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(100, CANVAS_SIZE - 110);
  ctx.lineTo(CANVAS_SIZE - 100, CANVAS_SIZE - 110);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('GOA, INDIA  •  28-31 OCT 2026', 100, CANVAS_SIZE - 60);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#FFEB00';
  ctx.fillText('EDITION 2026', CANVAS_SIZE - 100, CANVAS_SIZE - 60);
  ctx.restore();
}

/**
 * Render Format B: Builder Badge (Bold, Cool, & Perfectly Spaced Layout)
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

  // Outer Card Frame
  ctx.save();
  ctx.fillStyle = '#005632';
  drawRoundedRect(ctx, 50, 50, CANVAS_SIZE - 100, CANVAS_SIZE - 100, 64);
  ctx.fill();

  ctx.lineWidth = 6;
  ctx.strokeStyle = '#00824A';
  ctx.stroke();
  ctx.restore();

  // 2. Poster Header
  ctx.save();
  ctx.fillStyle = '#FFEB00';
  ctx.font = '900 115px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE', CANVAS_SIZE / 2, 185);

  ctx.fillStyle = '#FF007A';
  ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('OFFICIAL BUILDER PASS  •  GOA 2026', CANVAS_SIZE / 2, 245);
  ctx.restore();

  // 3. Photo Area
  const photoSize = 780;
  const photoX = (CANVAS_SIZE - photoSize) / 2;
  const photoY = 295;

  const photoArea = {
    x: photoX,
    y: photoY,
    width: photoSize,
    height: photoSize,
  };

  if (img) {
    drawTransformedImage(ctx, img, photoArea, transform, false);
  } else {
    drawVectorPlaceholder(ctx, photoArea, false);
  }

  // Photo Frame Yellow Border
  ctx.save();
  ctx.lineWidth = 14;
  ctx.strokeStyle = '#FFEB00';
  drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 40);
  ctx.stroke();
  ctx.restore();

  // 4. Devanagari "गोवा" Hot Pink Sticker Badge Overlay
  drawGoaDevanagariSticker(ctx, CANVAS_SIZE / 2 - 190, photoY + photoSize - 55, 380, 120);

  // 5. User Details Section
  let currentY = photoY + photoSize + 155;

  // Name in Large Bold Serif Font
  ctx.save();
  const displayName = details.name.trim() || 'Ada Lovelace';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 105px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText(displayName, CANVAS_SIZE / 2, currentY);

  currentY += 95;

  // Role / Stack Tag (Hot Pink Pill)
  const displayRole = details.role.trim() || 'Full-stack • React / Node';
  ctx.fillStyle = '#FF007A';
  const roleW = Math.max(560, ctx.measureText(displayRole.toUpperCase()).width + 120);
  const roleX = (CANVAS_SIZE - roleW) / 2;
  drawRoundedRect(ctx, roleX, currentY - 45, roleW, 76, 38);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 34px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(displayRole.toUpperCase(), CANVAS_SIZE / 2, currentY + 6);

  currentY += 105;

  // Builder Title (Electric Yellow)
  const displayTitle = details.title.trim() || 'Full-Stack Wanderer';
  ctx.fillStyle = '#FFEB00';
  ctx.font = '800 48px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`— ${displayTitle.toUpperCase()} —`, CANVAS_SIZE / 2, currentY);

  currentY += 85;

  // 6. QR Code & Security Stamp
  const qrSize = 140;
  const qrX = CANVAS_SIZE / 2 - 270;
  const qrY = currentY;

  drawQRCodeGraphic(ctx, qrX, qrY, qrSize);

  // Security Stamp Box next to QR Code
  ctx.save();
  const stampX = CANVAS_SIZE / 2 - 100;
  const stampW = 380;
  const stampH = qrSize;

  ctx.fillStyle = '#004729';
  drawRoundedRect(ctx, stampX, qrY, stampW, stampH, 20);
  ctx.fill();

  ctx.lineWidth = 3;
  ctx.strokeStyle = '#FFEB00';
  ctx.stroke();

  ctx.fillStyle = '#FFEB00';
  ctx.font = '800 28px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('VERIFIED BUILDER', stampX + 24, qrY + 55);

  const handleText = details.handle.trim()
    ? (details.handle.startsWith('@') ? details.handle : `@${details.handle}`)
    : '@adalovelace';

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(handleText, stampX + 24, qrY + 105);

  ctx.restore();

  // 7. Footer Line & Details
  ctx.save();
  ctx.strokeStyle = '#FFEB00';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(100, CANVAS_SIZE - 100);
  ctx.lineTo(CANVAS_SIZE - 100, CANVAS_SIZE - 100);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 28px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('GOA, INDIA  •  28-31 OCT 2026', 100, CANVAS_SIZE - 50);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#FFEB00';
  ctx.fillText('#FrameInGoa', CANVAS_SIZE - 100, CANVAS_SIZE - 50);
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
