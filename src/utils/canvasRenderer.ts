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
 * Draw Grid Pixel Logo Icon
 */
function drawGridPixelLogo(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  yellowColor: string,
  bgColor: string
) {
  ctx.save();
  ctx.fillStyle = yellowColor;
  ctx.fillRect(x, y, size, size);

  ctx.fillStyle = bgColor;
  const grid = 3;
  const cellSize = size / grid;

  ctx.fillRect(x + cellSize, y, cellSize, cellSize);
  ctx.fillRect(x, y + cellSize, cellSize, cellSize);
  ctx.fillRect(x + cellSize * 2, y + cellSize * 2, cellSize, cellSize);

  ctx.restore();
}

/**
 * Draw Barcode graphic
 */
function drawBarcodeGraphic(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  yellowColor: string,
  bgColor: string
) {
  ctx.save();
  ctx.fillStyle = yellowColor;
  ctx.fillRect(x, y, width, height);

  ctx.fillStyle = bgColor;
  const barWidths = [4, 2, 8, 3, 6, 2, 9, 4, 3, 7, 2, 5, 8, 3, 4, 6, 2, 9, 3, 5, 7, 2, 4];
  let currX = x + 12;
  for (const bw of barWidths) {
    if (currX + bw < x + width - 12) {
      ctx.fillRect(currX, y + 10, bw, height - 20);
    }
    currX += bw + 6;
  }
  ctx.restore();
}

function drawTransformedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cropArea: { x: number; y: number; width: number; height: number },
  transform: ImageTransform,
  isCircle: boolean = false,
  fallbackBg: string = '#004D2D'
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

  ctx.fillStyle = fallbackBg;
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
  badgeBg: string = '#FF007A',
  strokeColor: string = '#FFEB00',
  textColor: string = '#FFEB00'
) {
  ctx.save();
  
  ctx.fillStyle = badgeBg;
  drawRoundedRect(ctx, x, y, width, height, height / 2);
  ctx.fill();
  
  ctx.lineWidth = 4;
  ctx.strokeStyle = strokeColor;
  ctx.stroke();

  ctx.fillStyle = textColor;
  ctx.font = '900 68px "Rozha One", "Noto Sans Devanagari", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('गोवा', x + width / 2, y + height / 2 + 22);

  ctx.restore();
}

/**
 * Render Format A: Profile Frame (Dynamic Theme Support)
 */
export function renderFormatA(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  transform: ImageTransform,
  theme: PresetTheme,
  _details: UserDetails
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  // 1. Dynamic Canvas Background
  ctx.fillStyle = theme.bgColor;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // 2. Top Title "HACKER HOUSE"
  ctx.save();
  ctx.fillStyle = theme.primaryYellow;
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
    drawTransformedImage(ctx, img, cropArea, transform, true, theme.cardBg);
  } else {
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = theme.cardBg;
    ctx.fill();
    ctx.restore();
  }

  // Concentric Rings
  ctx.save();

  // Outer Ring (primaryYellow)
  ctx.lineWidth = 32;
  ctx.strokeStyle = theme.primaryYellow;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 20, 0, Math.PI * 2);
  ctx.stroke();

  // Inner Ring (accentPink)
  ctx.lineWidth = 14;
  ctx.strokeStyle = theme.accentPink;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius + 45, 0, Math.PI * 2);
  ctx.stroke();

  ctx.restore();

  // 4. Top Devanagari "गोवा" Sticker Badge
  drawGoaDevanagariSticker(
    ctx,
    CANVAS_SIZE / 2 - 150,
    cropArea.y - 45,
    300,
    90,
    theme.accentPink,
    theme.primaryYellow,
    theme.primaryYellow
  );

  // 5. Bottom Branded Badge Pill
  ctx.save();
  const pillW = 480;
  const pillH = 160;
  const pillX = (CANVAS_SIZE - pillW) / 2;
  const pillY = cropArea.y + photoSize - 30;

  ctx.fillStyle = theme.accentPink;
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
 * Render Format B: Builder Badge (Dynamic Theme Support & Space Filled Layout)
 */
export function renderFormatB(
  canvas: HTMLCanvasElement,
  img: HTMLImageElement | null,
  transform: ImageTransform,
  theme: PresetTheme,
  details: UserDetails
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;

  // 1. Dynamic Canvas Background
  ctx.fillStyle = theme.bgColor;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // 2. Outer Border Frame
  ctx.save();
  ctx.strokeStyle = theme.primaryYellow;
  ctx.lineWidth = 6;
  drawRoundedRect(ctx, 50, 50, CANVAS_SIZE - 100, CANVAS_SIZE - 100, 56);
  ctx.stroke();
  ctx.restore();

  // 3. Top Right Devanagari "गोवा" Sticker Badge
  drawGoaDevanagariSticker(
    ctx,
    CANVAS_SIZE - 330,
    80,
    240,
    90,
    theme.accentPink,
    theme.primaryYellow,
    '#FFFFFF'
  );

  // 4. Header: HACKER HOUSE & Subtitle
  ctx.save();
  ctx.fillStyle = theme.primaryYellow;
  ctx.font = '900 135px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE', CANVAS_SIZE / 2, 210);

  ctx.fillStyle = theme.primaryYellow;
  ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '6px';
  ctx.fillText('OFFICIAL BUILDER PASS  ·  GOA 2026', CANVAS_SIZE / 2, 275);
  ctx.restore();

  // 5. Center Photo Area (Large 900x900 px Photo Frame)
  const photoSize = 900;
  const photoX = (CANVAS_SIZE - photoSize) / 2;
  const photoY = 320;

  const photoArea = {
    x: photoX,
    y: photoY,
    width: photoSize,
    height: photoSize,
  };

  if (img) {
    drawTransformedImage(ctx, img, photoArea, transform, false, theme.cardBg);
  } else {
    ctx.save();
    drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 48);
    ctx.fillStyle = theme.cardBg;
    ctx.fill();

    ctx.fillStyle = theme.primaryYellow;
    ctx.font = '700 44px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('PHOTO AREA', photoX + photoSize / 2, photoY + photoSize / 2);
    ctx.restore();
  }

  // Photo Frame Border
  ctx.save();
  ctx.lineWidth = 14;
  ctx.strokeStyle = theme.primaryYellow;
  drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 48);
  ctx.stroke();
  ctx.restore();

  // 6. Name in Extra Large Bold Serif Font (130px)
  let currentY = photoY + photoSize + 140;
  ctx.save();
  const displayName = (details.name.trim() || 'SATOSHI NAKAMOTO').toUpperCase();
  ctx.fillStyle = theme.primaryYellow;
  ctx.font = '900 130px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText(displayName, CANVAS_SIZE / 2, currentY);

  currentY += 75;

  // 7. Role / Title Hot Pink Banner
  const roleText = (details.role.trim() || 'FULLSTACK WEB3').toUpperCase();
  const titleText = (details.title.trim() || 'PROTOCOL ENGINEER').toUpperCase();
  const fullTagText = `${roleText} · ${titleText}`;

  const roleW = 1720;
  const roleH = 130;
  const roleX = (CANVAS_SIZE - roleW) / 2;

  ctx.fillStyle = theme.accentPink;
  drawRoundedRect(ctx, roleX, currentY, roleW, roleH, 65);
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = theme.primaryYellow;
  ctx.stroke();

  ctx.fillStyle = theme.primaryYellow;
  ctx.font = '800 46px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(fullTagText, CANVAS_SIZE / 2, currentY + 82);

  currentY += 180;

  // 8. Secondary ID Pass Banner & Barcode Strip (100% Space Filled)
  const bannerW = 1720;
  const bannerH = 170;
  const bannerX = (CANVAS_SIZE - bannerW) / 2;
  const bannerY = currentY;

  ctx.save();
  ctx.fillStyle = theme.cardBg;
  drawRoundedRect(ctx, bannerX, bannerY, bannerW, bannerH, 28);
  ctx.fill();

  ctx.lineWidth = 3;
  ctx.strokeStyle = theme.primaryYellow;
  ctx.stroke();

  // Barcode Graphic on Left
  drawBarcodeGraphic(ctx, bannerX + 35, bannerY + 25, 340, 120, theme.primaryYellow, theme.bgColor);

  // Center & Right text inside banner
  const handleText = details.handle.trim()
    ? (details.handle.startsWith('@') ? details.handle : `@${details.handle}`)
    : '@HackerHouseGoa';

  ctx.fillStyle = theme.primaryYellow;
  ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('VERIFIED BUILDER PASS', bannerX + 410, bannerY + 70);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 34px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`${handleText}  ·  GOA 2026`, bannerX + 410, bannerY + 122);

  ctx.restore();

  // 9. Footer Section
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 235, 0, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(100, CANVAS_SIZE - 160);
  ctx.lineTo(CANVAS_SIZE - 100, CANVAS_SIZE - 160);
  ctx.stroke();

  // Bottom Left: Yellow Grid Logo Icon
  drawGridPixelLogo(ctx, 100, CANVAS_SIZE - 130, 85, theme.primaryYellow, theme.bgColor);

  // Bottom Center: #FrameInGoa
  ctx.fillStyle = theme.primaryYellow;
  ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('#FrameInGoa', CANVAS_SIZE / 2, CANVAS_SIZE - 75);

  // Bottom Right: GOA, INDIA · 28–31 OCT 2026
  ctx.fillStyle = 'rgba(255, 235, 0, 0.9)';
  ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('GOA, INDIA · 28–31 OCT 2026', CANVAS_SIZE - 100, CANVAS_SIZE - 75);

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
