import type { UserDetails, ImageTransform, PresetTheme, PhotoShape } from '../types';
import QRCode from 'qrcode';

export const CANVAS_SIZE = 2000;

/**
 * Mathematically perfect rounded rectangle path without corner artifacts
 */
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.arcTo(x + w, y, x + w, y + radius, radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.arcTo(x + w, y + h, x + w - radius, y + h, radius);
  ctx.lineTo(x + radius, y + h);
  ctx.arcTo(x, y + h, x, y + h - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

/**
 * Draw polygon shape (Circle, Square, Squircle, Hexagon)
 */
function drawShapePath(
  ctx: CanvasRenderingContext2D,
  shape: PhotoShape,
  cropArea: { x: number; y: number; width: number; height: number },
  padding: number = 0
) {
  const x = cropArea.x - padding;
  const y = cropArea.y - padding;
  const w = cropArea.width + padding * 2;
  const h = cropArea.height + padding * 2;
  const cx = x + w / 2;
  const cy = y + h / 2;

  ctx.beginPath();

  if (shape === 'circle') {
    const radius = Math.min(w, h) / 2;
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  } else if (shape === 'squircle') {
    const radius = Math.min(w, h) * 0.35 + padding;
    drawRoundedRect(ctx, x, y, w, h, radius);
  } else if (shape === 'hexagon') {
    const r = Math.min(w, h) / 2;
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = cx + r * Math.cos(angle);
      const py = cy + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
  } else {
    // Default rounded square
    const radius = 48 + padding;
    drawRoundedRect(ctx, x, y, w, h, radius);
  }
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
 * Draw scannable QR Code graphic onto canvas
 */
function drawQRCodeGraphic(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  darkColor: string = '#000000',
  lightColor: string = '#FFFFFF',
  borderRadius: number = 16
) {
  if (!text || text.trim() === '') return;

  try {
    const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
    const moduleCount = qr.modules.size;
    const padding = 12;
    const availableSize = size - padding * 2;
    const cellSize = availableSize / moduleCount;

    ctx.save();
    // Background card for QR
    ctx.fillStyle = lightColor;
    drawRoundedRect(ctx, x, y, size, size, borderRadius);
    ctx.fill();

    // Dark modules
    ctx.fillStyle = darkColor;
    for (let r = 0; r < moduleCount; r++) {
      for (let c = 0; c < moduleCount; c++) {
        if (qr.modules.get(r, c)) {
          const modX = x + padding + c * cellSize;
          const modY = y + padding + r * cellSize;
          ctx.fillRect(modX, modY, cellSize + 0.4, cellSize + 0.4);
        }
      }
    }
    ctx.restore();
  } catch (err) {
    console.warn('Failed to render QR Code:', err);
  }
}

function drawTransformedImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  cropArea: { x: number; y: number; width: number; height: number },
  transform: ImageTransform,
  shape: PhotoShape = 'circle',
  fallbackBg: string = '#004D2D'
) {
  ctx.save();
  
  drawShapePath(ctx, shape, cropArea);
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
  strokeColor: string = '#FFECA8',
  textColor: string = '#FFFFFF'
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
 * Render Format A: Profile Frame
 */
export function renderFormatA(
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

  const photoShape = details.photoShape || 'circle';

  // 1. Canvas Background
  ctx.fillStyle = theme.bgColor;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // 2. Top Title "HACKER HOUSE"
  ctx.save();
  ctx.fillStyle = theme.headerTextColor;
  ctx.font = '900 140px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE', CANVAS_SIZE / 2, 280);
  ctx.restore();

  // 3. Center Photo Frame
  const photoSize = 1180;
  const cropArea = {
    x: (CANVAS_SIZE - photoSize) / 2,
    y: (CANVAS_SIZE - photoSize) / 2 + 60,
    width: photoSize,
    height: photoSize,
  };

  if (img) {
    drawTransformedImage(ctx, img, cropArea, transform, photoShape, theme.cardBg);
  } else {
    ctx.save();
    drawShapePath(ctx, photoShape, cropArea);
    ctx.fillStyle = theme.cardBg;
    ctx.fill();
    ctx.restore();
  }

  // Concentric Rings (Smooth Pathing)
  ctx.save();

  // Outer Ring
  ctx.lineWidth = 44;
  ctx.strokeStyle = theme.primaryYellow;
  drawShapePath(ctx, photoShape, cropArea, 26);
  ctx.stroke();

  // Inner Ring
  ctx.lineWidth = 22;
  ctx.strokeStyle = theme.accentPink;
  drawShapePath(ctx, photoShape, cropArea, 58);
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
    '#FFFFFF'
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

  // 6. QR Code (Bottom Right Corner)
  if (details.showQrCode ?? true) {
    const qrText = details.qrData?.trim() || 'https://x.com/HackerHouseGoa';
    drawQRCodeGraphic(
      ctx,
      qrText,
      CANVAS_SIZE - 280,
      CANVAS_SIZE - 280,
      200,
      '#000000',
      '#FFFFFF',
      24
    );
  }
}

/**
 * Render Format B: Builder Badge
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

  const CANVAS_W = 2000;
  const CANVAS_H = 2800;

  canvas.width = CANVAS_W;
  canvas.height = CANVAS_H;

  const photoShape = details.photoShape || 'square';

  // 1. Canvas Background
  ctx.fillStyle = theme.bgColor;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // 2. Outer Border Frame
  ctx.save();
  ctx.strokeStyle = theme.primaryYellow;
  ctx.lineWidth = 8;
  drawRoundedRect(ctx, 40, 40, CANVAS_W - 80, CANVAS_H - 80, 60);
  ctx.stroke();
  ctx.restore();

  // 3. Top Lanyard Hole Slot (Realistic Event Badge Punch Slot)
  ctx.save();
  ctx.fillStyle = theme.cardBg;
  drawRoundedRect(ctx, 840, 30, 320, 46, 23);
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = theme.primaryYellow;
  ctx.stroke();

  drawRoundedRect(ctx, 880, 40, 240, 26, 13);
  ctx.fillStyle = theme.bgColor;
  ctx.fill();
  ctx.restore();

  // 4. Top Right Sticker Badge (Devanagari "गोवा" or Badge Type)
  const badgeTypeLabel = details.badgeType ? details.badgeType.toUpperCase() : 'BUILDER';
  drawGoaDevanagariSticker(
    ctx,
    CANVAS_W - 320,
    90,
    260,
    90,
    theme.accentPink,
    theme.primaryYellow,
    '#FFFFFF'
  );

  // 5. Header: HACKER HOUSE & Subtitle
  ctx.save();
  ctx.fillStyle = theme.headerTextColor;
  ctx.font = '900 135px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE', CANVAS_W / 2, 220);

  ctx.fillStyle = theme.primaryYellow;
  ctx.font = '800 32px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`OFFICIAL ${badgeTypeLabel} PASS  ·  GOA 2026`, CANVAS_W / 2, 285);
  ctx.restore();

  // 6. Center Photo Area
  const photoSize = 880;
  const photoX = (CANVAS_W - photoSize) / 2;
  const photoY = 340;

  const photoArea = {
    x: photoX,
    y: photoY,
    width: photoSize,
    height: photoSize,
  };

  if (img) {
    drawTransformedImage(ctx, img, photoArea, transform, photoShape, theme.cardBg);
  } else {
    ctx.save();
    drawShapePath(ctx, photoShape, photoArea);
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
  ctx.lineWidth = 22;
  ctx.strokeStyle = theme.primaryYellow;
  drawShapePath(ctx, photoShape, photoArea);
  ctx.stroke();
  ctx.restore();

  // 7. Full Name
  let currentY = photoY + photoSize + 130;
  ctx.save();
  const displayName = (details.name.trim() || 'SATOSHI NAKAMOTO').toUpperCase();
  ctx.fillStyle = theme.headerTextColor;
  ctx.font = '900 120px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText(displayName, CANVAS_W / 2, currentY);

  currentY += 80;

  // 8. Role & Title Pill Banner
  const roleText = (details.role.trim() || 'FULLSTACK WEB3').toUpperCase();
  const titleText = (details.title.trim() || 'PROTOCOL ENGINEER').toUpperCase();
  const fullTagText = `${roleText} · ${titleText}`;

  const roleW = 1680;
  const roleH = 120;
  const roleX = (CANVAS_W - roleW) / 2;

  ctx.fillStyle = theme.accentPink;
  drawRoundedRect(ctx, roleX, currentY, roleW, roleH, 60);
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = theme.primaryYellow;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 44px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(fullTagText, CANVAS_W / 2, currentY + 76);

  currentY += 170;

  // 9. Dedicated Verification Card & Scannable QR Block (Y: 1640 to 2500)
  const cardW = 1680;
  const cardH = 860;
  const cardX = (CANVAS_W - cardW) / 2;
  const cardY = currentY + 20;

  ctx.save();
  ctx.fillStyle = theme.cardBg;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 44);
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = theme.primaryYellow;
  ctx.stroke();

  // QR Code on Left of Card Block (Large, crisp 640x640)
  if (details.showQrCode ?? true) {
    const qrSize = 640;
    const qrX = cardX + 80;
    const qrY = cardY + 110;
    const qrText = details.qrData?.trim() || 'https://x.com/HackerHouseGoa';
    drawQRCodeGraphic(ctx, qrText, qrX, qrY, qrSize, '#000000', '#FFFFFF', 28);
  }

  // Right Side Info inside Card Block
  const textX = cardX + 780;
  const handleText = details.handle.trim()
    ? (details.handle.startsWith('@') ? details.handle : `@${details.handle}`)
    : '@HackerHouseGoa';
  const companyText = details.company.trim() || 'HH GOA 2026';
  const passIdText = `PASS ID: HH26-${(details.handle || 'GOA').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8)}-${(details.badgeType || 'BUILDER').toUpperCase()}`;

  ctx.fillStyle = theme.primaryYellow;
  ctx.font = '900 46px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('VERIFIED BUILDER PASS', textX, cardY + 160);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '800 48px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(handleText, textX, cardY + 250);

  ctx.fillStyle = theme.textColor;
  ctx.font = '700 40px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`ORG: ${companyText.toUpperCase()}`, textX, cardY + 340);

  ctx.fillStyle = theme.accentPink;
  ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`CATEGORY: ${details.badgeType ? details.badgeType.toUpperCase() : 'BUILDER'}`, textX, cardY + 430);

  ctx.fillStyle = theme.primaryYellow;
  ctx.font = '700 28px "Courier New", monospace';
  ctx.fillText(passIdText, textX, cardY + 520);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.font = '700 26px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('📷 SCAN QR CODE TO VERIFY CREDENTIALS', textX, cardY + 680);

  ctx.restore();

  // 10. Footer Bar
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 235, 0, 0.4)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(100, CANVAS_H - 160);
  ctx.lineTo(CANVAS_H - 100, CANVAS_H - 160);
  ctx.stroke();

  // Bottom Left: Yellow Grid Logo Icon
  drawGridPixelLogo(ctx, 100, CANVAS_H - 130, 85, theme.primaryYellow, theme.bgColor);

  // Bottom Center: #FrameInGoa
  ctx.fillStyle = theme.primaryYellow;
  ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('#FrameInGoa', CANVAS_W / 2, CANVAS_H - 75);

  // Bottom Right: GOA, INDIA · 28–31 OCT 2026
  ctx.fillStyle = theme.textColor;
  ctx.font = '700 32px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('GOA, INDIA · 28–31 OCT 2026', CANVAS_W - 100, CANVAS_H - 75);

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
