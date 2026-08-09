import type { UserDetails, ImageTransform, PresetTheme, PhotoShape } from '../types';
import { DEFAULT_BEACH_BAG } from '../types';
import QRCode from 'qrcode';

export const CANVAS_SIZE = 2000;

const PAPER_COLOR = '#FDF6E9';
// official-emerald's headerTextColor is bright yellow, tuned for its dark bg — too low-contrast as ink on the cream paper panel.
const PAPER_INK_FALLBACK = '#0B4D2E';

function paperInk(theme: PresetTheme): string {
  return theme.id === 'official-emerald' ? PAPER_INK_FALLBACK : theme.headerTextColor;
}

function seededRandom(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

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

/* ------------------------------------------------------------------------ */
/* Postcard illustration primitives                                         */
/* ------------------------------------------------------------------------ */

/** Cream paper card panel with a themed ink border, the base of the postcard layout */
function drawPaperPanel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  theme: PresetTheme,
  radius: number = 56
) {
  ctx.save();
  ctx.fillStyle = PAPER_COLOR;
  drawRoundedRect(ctx, x, y, w, h, radius);
  ctx.fill();

  ctx.lineWidth = 10;
  ctx.strokeStyle = paperInk(theme);
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.strokeStyle = theme.accentPink;
  drawRoundedRect(ctx, x + 18, y + 18, w - 36, h - 36, Math.max(radius - 14, 0));
  ctx.stroke();
  ctx.restore();
}

function drawMiniPalm(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  size: number,
  leafColor: string,
  trunkColor: string
) {
  ctx.save();
  ctx.strokeStyle = trunkColor;
  ctx.lineWidth = size * 0.14;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, baseY + size * 0.6);
  ctx.quadraticCurveTo(cx + size * 0.15, baseY + size * 0.1, cx, baseY - size * 0.3);
  ctx.stroke();

  ctx.fillStyle = leafColor;
  const topX = cx;
  const topY = baseY - size * 0.3;
  for (let i = 0; i < 5; i++) {
    const angle = -Math.PI / 2 + (i - 2) * 0.55;
    const lx = topX + Math.cos(angle) * size * 0.55;
    const ly = topY + Math.sin(angle) * size * 0.55;
    const cx1 = topX + Math.cos(angle) * size * 0.25 - Math.sin(angle) * size * 0.12;
    const cx2 = topX + Math.cos(angle) * size * 0.25 + Math.sin(angle) * size * 0.12;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(cx1, topY + Math.sin(angle) * size * 0.25, lx, ly);
    ctx.quadraticCurveTo(cx2, topY + Math.sin(angle) * size * 0.25, topX, topY);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();
}

function drawSparkle(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy - size);
  ctx.quadraticCurveTo(cx + size * 0.15, cy - size * 0.15, cx + size, cy);
  ctx.quadraticCurveTo(cx + size * 0.15, cy + size * 0.15, cx, cy + size);
  ctx.quadraticCurveTo(cx - size * 0.15, cy + size * 0.15, cx - size, cy);
  ctx.quadraticCurveTo(cx - size * 0.15, cy - size * 0.15, cx, cy - size);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function drawBirdMark(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = size * 0.16;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - size, cy);
  ctx.quadraticCurveTo(cx - size * 0.3, cy - size * 0.7, cx, cy);
  ctx.quadraticCurveTo(cx + size * 0.3, cy - size * 0.7, cx + size, cy);
  ctx.stroke();
  ctx.restore();
}

function drawWaveLine(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.beginPath();
  const bumps = Math.max(2, Math.round(w / 60));
  ctx.moveTo(x, y);
  for (let i = 0; i < bumps; i++) {
    const segW = w / bumps;
    const midX = x + segW * i + segW / 2;
    const endX = x + segW * (i + 1);
    ctx.quadraticCurveTo(midX, y + (i % 2 === 0 ? -12 : 12), endX, y);
  }
  ctx.stroke();
  ctx.restore();
}

/** Perforated-edge postage stamp with a tiny beach scene */
function drawPostageStamp(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  theme: PresetTheme
) {
  const ink = paperInk(theme);
  ctx.save();

  ctx.fillStyle = PAPER_COLOR;
  drawRoundedRect(ctx, x, y, w, h, 10);
  ctx.fill();

  ctx.strokeStyle = ink;
  ctx.lineWidth = 4;
  ctx.setLineDash([w / 16, w / 32]);
  drawRoundedRect(ctx, x, y, w, h, 10);
  ctx.stroke();
  ctx.setLineDash([]);

  const pad = w * 0.14;
  const ix = x + pad;
  const iy = y + pad;
  const iw = w - pad * 2;
  const ih = h * 0.6;

  ctx.save();
  drawRoundedRect(ctx, ix, iy, iw, ih, 4);
  ctx.clip();
  ctx.fillStyle = PAPER_COLOR;
  ctx.fillRect(ix, iy, iw, ih);

  // sun
  ctx.fillStyle = theme.accentPink;
  ctx.beginPath();
  ctx.arc(ix + iw * 0.72, iy + ih * 0.3, ih * 0.24, 0, Math.PI * 2);
  ctx.fill();

  // sea line
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(ix, iy + ih * 0.72);
  ctx.lineTo(ix + iw, iy + ih * 0.72);
  ctx.stroke();

  drawMiniPalm(ctx, ix + iw * 0.28, iy + ih * 0.85, ih * 0.55, theme.accentPink, ink);
  ctx.restore();

  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.font = `900 ${Math.round(w * 0.16)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('GOA', x + w / 2, y + h * 0.84);
  ctx.font = `700 ${Math.round(w * 0.08)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('INDIA', x + w / 2, y + h * 0.95);

  ctx.restore();
}

/** Small hanging tag/ribbon with a single point cut into the bottom edge */
function drawHangingTag(
  ctx: CanvasRenderingContext2D,
  cx: number,
  y: number,
  w: number,
  h: number,
  lines: string[],
  fill: string
) {
  const x = cx - w / 2;
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h * 0.72);
  ctx.lineTo(x + w / 2, y + h);
  ctx.lineTo(x, y + h * 0.72);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  if (lines[0]) {
    ctx.font = `900 ${Math.round(h * 0.34)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(lines[0], cx, y + h * 0.42);
  }
  if (lines[1]) {
    ctx.font = `700 ${Math.round(h * 0.18)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(lines[1], cx, y + h * 0.62);
  }
  ctx.restore();
}

/** Full-width ribbon banner with arrow-notched ends */
function drawFullRibbon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  text: string,
  fill: string,
  fontSize: number
) {
  const notch = h * 0.4;
  ctx.save();
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w - notch, y + h / 2);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x + notch, y + h / 2);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = `900 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(text, x + w / 2, y + h * 0.68);
  ctx.restore();
}

/** Circular seal/stamp badge with two lines of caption text */
function drawTextAlongArc(
  ctx: CanvasRenderingContext2D,
  text: string,
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  isBottom: boolean = false
) {
  ctx.save();
  ctx.translate(cx, cy);
  const textWidth = ctx.measureText(text).width;
  const totalAngle = textWidth / radius;
  
  if (isBottom) {
    ctx.rotate(startAngle + totalAngle / 2);
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charWidth = ctx.measureText(char).width;
      ctx.rotate(-charWidth / (2 * radius));
      ctx.fillText(char, 0, radius);
      ctx.rotate(-charWidth / (2 * radius));
    }
  } else {
    ctx.rotate(startAngle - totalAngle / 2);
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const charWidth = ctx.measureText(char).width;
      ctx.rotate(charWidth / (2 * radius));
      ctx.fillText(char, 0, -radius);
      ctx.rotate(charWidth / (2 * radius));
    }
  }
  ctx.restore();
}

function drawCircularSeal(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  r: number,
  theme: PresetTheme,
  lines: string[]
) {
  const ink = paperInk(theme);
  ctx.save();

  ctx.fillStyle = PAPER_COLOR;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  ctx.lineWidth = 5;
  ctx.strokeStyle = ink;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, r - 14, 0, Math.PI * 2);
  ctx.setLineDash([5, 7]);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = ink;
  ctx.stroke();
  ctx.setLineDash([]);

  drawMiniPalm(ctx, cx, cy + r * 0.05, r * 0.3, theme.accentPink, ink);

  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `800 ${Math.round(r * 0.13)}px "Plus Jakarta Sans", sans-serif`;
  if (lines[0]) drawTextAlongArc(ctx, lines[0], cx, cy, r - 26, 0, false);
  if (lines[1]) drawTextAlongArc(ctx, lines[1], cx, cy, r - 26, 0, true);
  ctx.restore();
}

/** Two-tone scalloped/zigzag ring, used around circular photos */
function drawScallopedRing(
  ctx: CanvasRenderingContext2D,
  cropArea: { x: number; y: number; width: number; height: number },
  theme: PresetTheme,
  ringWidth: number = 50
) {
  const cx = cropArea.x + cropArea.width / 2;
  const cy = cropArea.y + cropArea.height / 2;
  const rInner = Math.max(cropArea.width, cropArea.height) / 2 + 8;
  const rOuter = rInner + ringWidth;
  const teeth = 30;

  ctx.save();
  for (let i = 0; i < teeth; i++) {
    const a0 = (Math.PI * 2 * i) / teeth;
    const a1 = (Math.PI * 2 * (i + 1)) / teeth;
    const aMid = (a0 + a1) / 2;
    ctx.fillStyle = i % 2 === 0 ? theme.primaryYellow : theme.accentPink;
    ctx.beginPath();
    ctx.moveTo(cx + rInner * Math.cos(a0), cy + rInner * Math.sin(a0));
    ctx.lineTo(cx + rOuter * Math.cos(aMid), cy + rOuter * Math.sin(aMid));
    ctx.lineTo(cx + rInner * Math.cos(a1), cy + rInner * Math.sin(a1));
    ctx.closePath();
    ctx.fill();
  }

  ctx.lineWidth = 8;
  ctx.strokeStyle = paperInk(theme);
  ctx.beginPath();
  ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** Signpost with stacked BUILD / SHIP / REPEAT arrow signs */
function drawSignpost(ctx: CanvasRenderingContext2D, x: number, y: number, height: number, theme: PresetTheme) {
  const ink = paperInk(theme);
  ctx.save();

  ctx.fillStyle = ink;
  ctx.fillRect(x - 7, y, 14, height);

  const labels: { text: string; fill: string; textColor: string; stroke?: boolean }[] = [
    { text: 'BUILD', fill: theme.accentPink, textColor: '#FFFFFF' },
    { text: 'SHIP', fill: ink, textColor: '#FFFFFF' },
    { text: 'REPEAT', fill: PAPER_COLOR, textColor: ink, stroke: true },
  ];
  const signW = 230;
  const signH = 76;
  const gap = 30;

  labels.forEach((l, i) => {
    const sy = y + 24 + i * (signH + gap);
    ctx.fillStyle = l.fill;
    ctx.beginPath();
    ctx.moveTo(x, sy);
    ctx.lineTo(x + signW - 26, sy);
    ctx.lineTo(x + signW, sy + signH / 2);
    ctx.lineTo(x + signW - 26, sy + signH);
    ctx.lineTo(x, sy + signH);
    ctx.closePath();
    ctx.fill();
    if (l.stroke) {
      ctx.lineWidth = 4;
      ctx.strokeStyle = ink;
      ctx.stroke();
    }

    ctx.fillStyle = l.textColor;
    ctx.textAlign = 'center';
    ctx.font = `900 34px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(l.text, x + signW / 2 - 10, sy + signH / 2 + 12);
  });

  ctx.restore();
}

/** Simplified beach house scene: house, palm, moped, waterline */
function drawBeachHouseScene(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  theme: PresetTheme
) {
  const ink = paperInk(theme);
  ctx.save();

  ctx.strokeStyle = ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.92);
  ctx.quadraticCurveTo(x + w * 0.5, y + h * 0.86, x + w, y + h * 0.92);
  ctx.stroke();

  const houseW = w * 0.62;
  const houseH = h * 0.42;
  const hx = x + w * 0.24;
  const hy = y + h * 0.42;

  ctx.fillStyle = PAPER_COLOR;
  ctx.fillRect(hx, hy, houseW, houseH);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3;
  ctx.strokeRect(hx, hy, houseW, houseH);

  ctx.fillStyle = theme.accentPink;
  ctx.beginPath();
  ctx.moveTo(hx - 16, hy);
  ctx.lineTo(hx + houseW / 2, hy - houseH * 0.55);
  ctx.lineTo(hx + houseW + 16, hy);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = ink;
  ctx.stroke();

  ctx.fillStyle = ink;
  ctx.fillRect(hx + houseW * 0.4, hy + houseH * 0.42, houseW * 0.2, houseH * 0.58);

  ctx.strokeStyle = ink;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(hx + houseW * 0.1, hy + houseH * 0.16, houseW * 0.18, houseH * 0.22);
  ctx.strokeRect(hx + houseW * 0.72, hy + houseH * 0.16, houseW * 0.18, houseH * 0.22);

  drawMiniPalm(ctx, x + w * 0.1, y + h * 0.9, w * 0.32, theme.accentPink, ink);

  const mx = x + w * 0.82;
  const my = y + h * 0.88;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(mx - 24, my, 15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(mx + 20, my, 15, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = theme.accentPink;
  ctx.beginPath();
  ctx.moveTo(mx - 24, my - 13);
  ctx.quadraticCurveTo(mx, my - 42, mx + 20, my - 13);
  ctx.stroke();

  ctx.restore();
}

/** Decorative (non-scannable) barcode made of deterministic pseudo-random bars */
function drawBarcode(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seedText: string, color: string) {
  const rand = seededRandom(seedText || 'HHGOA2026');
  ctx.save();
  ctx.fillStyle = color;
  let cx = x;
  while (cx < x + w) {
    const barW = 2 + Math.floor(rand() * 5);
    if (rand() > 0.35) {
      ctx.fillRect(cx, y, barW, h);
    }
    cx += barW + 2;
  }
  ctx.restore();
}

function generateBuilderId(seedText: string): string {
  const rand = seededRandom(seedText || 'HHGOA2026');
  const num = 1000 + Math.floor(rand() * 9000);
  return `#HH-GOA-${num}`;
}

/** Bordered name plate box */
function drawNamePlate(ctx: CanvasRenderingContext2D, cx: number, y: number, w: number, h: number, text: string, theme: PresetTheme, fontSize: number) {
  const ink = paperInk(theme);
  ctx.save();
  ctx.fillStyle = PAPER_COLOR;
  drawRoundedRect(ctx, cx - w / 2, y, w, h, 18);
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = ink;
  ctx.stroke();

  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.font = `900 ${fontSize}px "Playfair Display", serif`;
  ctx.fillText(text, cx, y + h * 0.68);
  ctx.restore();
}

/** "HACKER गोवा HOUSE" title with the Devanagari word picked out in accent pink */
function drawPostcardTitle(ctx: CanvasRenderingContext2D, cx: number, y: number, theme: PresetTheme, fontSize: number) {
  const ink = paperInk(theme);
  ctx.save();
  ctx.font = `900 ${fontSize}px "Playfair Display", serif`;

  const partA = 'HACKER ';
  const partB = 'गोवा';
  const partC = ' HOUSE';
  const wA = ctx.measureText(partA).width;
  const wB = ctx.measureText(partB).width;
  const wC = ctx.measureText(partC).width;
  const total = wA + wB + wC;

  let curX = cx - total / 2;
  ctx.textAlign = 'left';

  ctx.fillStyle = ink;
  ctx.fillText(partA, curX, y);
  curX += wA;

  ctx.fillStyle = theme.accentPink;
  ctx.fillText(partB, curX, y);
  curX += wB;

  ctx.fillStyle = ink;
  ctx.fillText(partC, curX, y);

  ctx.restore();
}

/**
 * Render Format A: Profile Frame — illustrated postcard, lighter single-image share format
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
  const ink = paperInk(theme);

  // 1. Outer themed background
  ctx.fillStyle = theme.bgColor;
  ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

  // 2. Cream paper panel
  drawPaperPanel(ctx, 56, 56, CANVAS_SIZE - 112, CANVAS_SIZE - 112, theme, 72);

  // 3. Postage stamp (top-left) & circular seal (top-right)
  drawPostageStamp(ctx, 140, 140, 230, 270, theme);
  drawCircularSeal(ctx, 1730, 290, 150, theme, ['BUILD IN GOA', 'SHIP FROM PARADISE']);

  // 4. Hanging event tag
  drawHangingTag(ctx, CANVAS_SIZE / 2, 20, 340, 140, ['HH GOA 2026', "LET'S BUILD"], ink);

  // 5. Title
  drawPostcardTitle(ctx, CANVAS_SIZE / 2, 470, theme, 108);
  ctx.save();
  ctx.fillStyle = theme.accentPink;
  ctx.textAlign = 'center';
  ctx.font = `800 32px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('#FRAMEINGOA · GOA, INDIA', CANVAS_SIZE / 2, 522);
  ctx.restore();

  // 6. Center Photo Frame
  const photoSize = 1000;
  const cropArea = {
    x: (CANVAS_SIZE - photoSize) / 2,
    y: 580,
    width: photoSize,
    height: photoSize,
  };

  if (img) {
    drawTransformedImage(ctx, img, cropArea, transform, photoShape, PAPER_COLOR);
  } else {
    ctx.save();
    drawShapePath(ctx, photoShape, cropArea);
    ctx.fillStyle = PAPER_COLOR;
    ctx.fill();
    ctx.restore();
  }

  if (photoShape === 'circle') {
    drawScallopedRing(ctx, cropArea, theme, 50);
  } else {
    ctx.save();
    ctx.lineWidth = 40;
    ctx.strokeStyle = theme.primaryYellow;
    drawShapePath(ctx, photoShape, cropArea, 24);
    ctx.stroke();
    ctx.lineWidth = 20;
    ctx.strokeStyle = theme.accentPink;
    drawShapePath(ctx, photoShape, cropArea, 54);
    ctx.stroke();
    ctx.restore();
  }

  // 7. Name plate
  const displayName = (details.name.trim() || 'SATOSHI NAKAMOTO').toUpperCase();
  drawNamePlate(ctx, CANVAS_SIZE / 2, cropArea.y + photoSize + 40, 900, 140, displayName, theme, 54);

  // 8. Role / title pill
  const roleText = (details.role.trim() || 'FULLSTACK WEB3').toUpperCase();
  const titleText = (details.title.trim() || 'PROTOCOL ENGINEER').toUpperCase();
  ctx.save();
  const pillY = cropArea.y + photoSize + 200;
  const pillW = 900;
  const pillH = 110;
  ctx.fillStyle = theme.accentPink;
  drawRoundedRect(ctx, (CANVAS_SIZE - pillW) / 2, pillY, pillW, pillH, 55);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = `800 40px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(`${roleText} · ${titleText}`, CANVAS_SIZE / 2, pillY + 70);
  ctx.restore();

  // 9. Scattered doodles
  drawSparkle(ctx, 160, 1720, 26, theme.primaryYellow);
  drawBirdMark(ctx, 1780, 500, 30, ink);
  drawBirdMark(ctx, 1840, 560, 22, ink);
  drawWaveLine(ctx, 130, 1860, 300, ink);

  // 10. QR Code (bottom-right)
  if (details.showQrCode ?? true) {
    const qrText = details.qrData?.trim() || 'https://x.com/HackerHouseGoa';
    drawQRCodeGraphic(ctx, qrText, CANVAS_SIZE - 320, CANVAS_SIZE - 300, 180, ink, PAPER_COLOR, 20);
  }

  // 11. Bottom-left hashtag
  ctx.save();
  ctx.fillStyle = ink;
  ctx.textAlign = 'left';
  ctx.font = `800 34px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('#FrameInGoa', 130, 1900);
  ctx.restore();
}

/**
 * Render Format B: Builder Badge — full illustrated postcard pass with footer detail card
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
  const ink = paperInk(theme);

  // 1. Outer themed background
  ctx.fillStyle = theme.bgColor;
  ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

  // 2. Cream paper panel
  drawPaperPanel(ctx, 48, 48, CANVAS_W - 96, CANVAS_H - 96, theme, 64);

  // 3. Lanyard punch slot
  ctx.save();
  ctx.fillStyle = PAPER_COLOR;
  drawRoundedRect(ctx, 840, 24, 320, 46, 23);
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = ink;
  ctx.stroke();
  drawRoundedRect(ctx, 880, 34, 240, 26, 13);
  ctx.fillStyle = theme.bgColor;
  ctx.fill();
  ctx.restore();

  // 4. Postage stamp (top-left) & circular seal (top-right)
  drawPostageStamp(ctx, 100, 110, 200, 240, theme);
  const badgeTypeLabel = details.badgeType ? details.badgeType.toUpperCase() : 'BUILDER';
  drawCircularSeal(ctx, 1790, 240, 140, theme, ['BUILD IN GOA', 'SHIP FROM PARADISE']);

  // 5. Hanging event tag
  drawHangingTag(ctx, CANVAS_W / 2, 20, 320, 130, ['HH GOA 2026', `${badgeTypeLabel} PASS`], ink);

  // 6. Title
  drawPostcardTitle(ctx, CANVAS_W / 2, 430, theme, 96);
  ctx.save();
  ctx.fillStyle = theme.accentPink;
  ctx.textAlign = 'center';
  ctx.font = `800 30px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(`OFFICIAL ${badgeTypeLabel} PASS · GOA 2026`, CANVAS_W / 2, 478);
  ctx.restore();

  // 7. Center Photo Area
  const photoSize = 760;
  const photoX = (CANVAS_W - photoSize) / 2;
  const photoY = 540;
  const photoArea = { x: photoX, y: photoY, width: photoSize, height: photoSize };

  if (img) {
    drawTransformedImage(ctx, img, photoArea, transform, photoShape, PAPER_COLOR);
  } else {
    ctx.save();
    drawShapePath(ctx, photoShape, photoArea);
    ctx.fillStyle = PAPER_COLOR;
    ctx.fill();
    ctx.fillStyle = ink;
    ctx.font = `700 36px "Plus Jakarta Sans", sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('PHOTO AREA', photoX + photoSize / 2, photoY + photoSize / 2);
    ctx.restore();
  }

  if (photoShape === 'circle') {
    drawScallopedRing(ctx, photoArea, theme, 42);
  } else {
    ctx.save();
    ctx.lineWidth = 22;
    ctx.strokeStyle = theme.primaryYellow;
    drawShapePath(ctx, photoShape, photoArea);
    ctx.stroke();
    ctx.restore();
  }

  // 8. Signpost (left) & beach house scene (right), flanking the photo/name column
  drawSignpost(ctx, 260, 700, 560, theme);
  drawBeachHouseScene(ctx, 1440, 680, 460, 640, theme);

  // 9. Name plate
  let currentY = photoY + photoSize + 50;
  const displayName = (details.name.trim() || 'SATOSHI NAKAMOTO').toUpperCase();
  drawNamePlate(ctx, CANVAS_W / 2, currentY, 850, 130, displayName, theme, 52);
  currentY += 130 + 26;

  // 10. Role pill (title moves to the Builder Class footer column below)
  const roleText = (details.role.trim() || 'FULLSTACK WEB3').toUpperCase();
  ctx.save();
  const pillW = 850;
  const pillH = 100;
  const pillX = (CANVAS_W - pillW) / 2;
  ctx.fillStyle = theme.accentPink;
  drawRoundedRect(ctx, pillX, currentY, pillW, pillH, 50);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 40px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(roleText, CANVAS_W / 2, currentY + 66);
  ctx.restore();
  currentY += pillH + 40;

  // 11. Three-column footer detail card
  const cardW = 1824;
  const cardH = 650;
  const cardX = (CANVAS_W - cardW) / 2;
  const cardY = currentY;

  ctx.save();
  ctx.fillStyle = PAPER_COLOR;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 40);
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = ink;
  ctx.stroke();

  const colW = cardW / 3;

  // Vertical dividers
  ctx.strokeStyle = `${ink}66`;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 10]);
  [1, 2].forEach((i) => {
    ctx.beginPath();
    ctx.moveTo(cardX + colW * i, cardY + 40);
    ctx.lineTo(cardX + colW * i, cardY + cardH - 40);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  const colLabelFont = `800 32px "Plus Jakarta Sans", sans-serif`;

  // Column 1: Builder Class + QR
  const col1CX = cardX + colW * 0.5;
  ctx.fillStyle = theme.accentPink;
  ctx.textAlign = 'center';
  ctx.font = colLabelFont;
  ctx.fillText('BUILDER CLASS', col1CX, cardY + 70);

  const builderClass = (details.title.trim() || 'Terminal Wizard').toUpperCase();
  ctx.fillStyle = ink;
  ctx.font = `900 40px "Plus Jakarta Sans", sans-serif`;
  wrapCenteredText(ctx, builderClass, col1CX, cardY + 130, colW - 60, 46);

  if (details.showQrCode ?? true) {
    const qrText = details.qrData?.trim() || 'https://x.com/HackerHouseGoa';
    const qrSize = 320;
    drawQRCodeGraphic(ctx, qrText, col1CX - qrSize / 2, cardY + 240, qrSize, ink, PAPER_COLOR, 24);
  }

  // Column 2: Beach Bag
  const col2CX = cardX + colW * 1.5;
  ctx.fillStyle = theme.accentPink;
  ctx.font = colLabelFont;
  ctx.fillText('BEACH BAG', col2CX, cardY + 70);

  const filledBeachBag = (details.beachBag ?? []).map((v) => v.trim()).filter((v) => v !== '');
  const beachBag = filledBeachBag.length > 0 ? filledBeachBag.slice(0, 3) : DEFAULT_BEACH_BAG;
  ctx.textAlign = 'left';
  const col2ItemX = cardX + colW * 1.12;
  beachBag.forEach((item, i) => {
    const iy = cardY + 160 + i * 90;
    drawMiniPalm(ctx, cardX + colW * 1.08 - 6, iy - 12, 26, theme.accentPink, ink);
    ctx.fillStyle = ink;
    ctx.font = `700 34px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(item, col2ItemX, iy);
  });

  // Column 3: Currently Shipping + barcode + Builder ID
  const col3CX = cardX + colW * 2.5;
  ctx.textAlign = 'center';
  ctx.fillStyle = theme.accentPink;
  ctx.font = colLabelFont;
  ctx.fillText('CURRENTLY SHIPPING', col3CX, cardY + 70);

  const shippingText = (details.currentlyShipping?.trim() || 'BUILDING THE FUTURE').toUpperCase();
  ctx.fillStyle = ink;
  ctx.font = `900 38px "Plus Jakarta Sans", sans-serif`;
  wrapCenteredText(ctx, shippingText, col3CX, cardY + 130, colW - 60, 44);

  const builderId = generateBuilderId(details.handle || details.name || 'HHGOA2026');
  const barcodeW = colW - 100;
  const barcodeX = col3CX - barcodeW / 2;
  drawBarcode(ctx, barcodeX, cardY + 300, barcodeW, 100, details.handle || details.name || 'HHGOA2026', ink);

  ctx.fillStyle = ink;
  ctx.font = `700 26px "Courier New", monospace`;
  ctx.fillText(`BUILDER ID  ${builderId}`, col3CX, cardY + 440);

  ctx.restore();

  // 12. Bottom ribbon
  const ribbonW = 1600;
  const ribbonH = 110;
  drawFullRibbon(ctx, (CANVAS_W - ribbonW) / 2, CANVAS_H - 220, ribbonW, ribbonH, '#FRAMEINGOA', theme.accentPink, 46);

  // 13. Footer credit line
  ctx.save();
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.font = `700 28px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('GOA, INDIA · 28–31 OCT 2026', CANVAS_W / 2, CANVAS_H - 76);
  ctx.restore();
}

/** Center-aligned text wrapped across up to two lines within maxWidth */
function wrapCenteredText(ctx: CanvasRenderingContext2D, text: string, cx: number, y: number, maxWidth: number, lineHeight: number) {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;
    if (ctx.measureText(testLine).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = testLine;
    }
  }
  if (line) lines.push(line);

  const shown = lines.slice(0, 2);
  ctx.textAlign = 'center';
  shown.forEach((l, i) => {
    ctx.fillText(l, cx, y + i * lineHeight);
  });
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
