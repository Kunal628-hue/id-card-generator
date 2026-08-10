import type { UserDetails, ImageTransform, PresetTheme, PhotoShape } from '../types';
import { DEFAULT_BEACH_BAG } from '../types';
import QRCode from 'qrcode';

export const CANVAS_SIZE = 2000;

const PAPER_COLOR = '#FDF6E9';

/**
 * Returns high-contrast dark ink color for printing text on the cream postcard paper
 */
function paperInk(theme: PresetTheme): string {
  if (theme.id === 'palolem-sunset') {
    return '#4A1521'; // Deep Burgundy Coffee Ink
  }
  if (theme.id === 'vagator-night') {
    return '#0F172A'; // Deep Midnight Navy Ink
  }
  if (theme.id === 'candolim-turquoise') {
    return '#003820'; // Deep Forest Green Ink
  }
  return '#0B4D2E'; // Deep Emerald Forest Ink
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
 * Draw rounded rectangle path
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
 * Draw scannable QR Code graphic onto canvas (always crisp high-contrast dark modules)
 */
function drawQRCodeGraphic(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  size: number,
  darkColor: string = '#0B4D2E',
  lightColor: string = '#FFFFFF',
  borderRadius: number = 16
) {
  if (!text || text.trim() === '') return;

  try {
    const qr = QRCode.create(text, { errorCorrectionLevel: 'M' });
    const moduleCount = qr.modules.size;
    const padding = 14;
    const availableSize = size - padding * 2;
    const cellSize = availableSize / moduleCount;

    ctx.save();
    // Background card for QR with subtle stroke
    ctx.fillStyle = lightColor;
    drawRoundedRect(ctx, x, y, size, size, borderRadius);
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = darkColor;
    ctx.stroke();

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

/**
 * Draw default tropical avatar when no user photo is uploaded yet
 */
function drawDefaultAvatar(
  ctx: CanvasRenderingContext2D,
  cropArea: { x: number; y: number; width: number; height: number },
  shape: PhotoShape,
  theme: PresetTheme
) {
  const ink = paperInk(theme);
  const cx = cropArea.x + cropArea.width / 2;
  const cy = cropArea.y + cropArea.height / 2;
  const w = cropArea.width;
  const h = cropArea.height;

  ctx.save();
  drawShapePath(ctx, shape, cropArea);
  ctx.clip();

  // 1. Tropical sunset gradient sky
  const skyGrad = ctx.createLinearGradient(cx, cropArea.y, cx, cropArea.y + h);
  skyGrad.addColorStop(0, '#FFE89E');
  skyGrad.addColorStop(0.4, '#FFB3D9');
  skyGrad.addColorStop(0.75, '#FF4081');
  skyGrad.addColorStop(1, ink);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(cropArea.x, cropArea.y, w, h);

  // 2. Glowing sun on horizon
  ctx.fillStyle = '#FFEB00';
  ctx.beginPath();
  ctx.arc(cx, cy + h * 0.1, w * 0.22, 0, Math.PI * 2);
  ctx.fill();

  // Sun glow ring
  ctx.fillStyle = 'rgba(255, 235, 0, 0.3)';
  ctx.beginPath();
  ctx.arc(cx, cy + h * 0.1, w * 0.3, 0, Math.PI * 2);
  ctx.fill();

  // 3. Ocean water reflections at bottom
  ctx.fillStyle = ink;
  ctx.fillRect(cropArea.x, cy + h * 0.25, w, h * 0.25);

  ctx.strokeStyle = '#FFEB00';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx - w * 0.25, cy + h * 0.3);
  ctx.lineTo(cx + w * 0.25, cy + h * 0.3);
  ctx.moveTo(cx - w * 0.18, cy + h * 0.35);
  ctx.lineTo(cx + w * 0.18, cy + h * 0.35);
  ctx.moveTo(cx - w * 0.1, cy + h * 0.4);
  ctx.lineTo(cx + w * 0.1, cy + h * 0.4);
  ctx.stroke();

  // 4. Leaning Palm Tree Silhouettes
  drawLushPalmTree(ctx, cropArea.x + w * 0.18, cy + h * 0.35, w * 0.45, theme.accentPink, ink, theme, false);
  drawLushPalmTree(ctx, cropArea.x + w * 0.82, cy + h * 0.35, w * 0.4, theme.accentPink, ink, theme, true);

  // 5. Flying bird silhouettes
  drawBirdMark(ctx, cx - w * 0.15, cy - h * 0.2, 24, ink);
  drawBirdMark(ctx, cx + w * 0.12, cy - h * 0.24, 18, ink);

  // 6. Center Builder Silhouette
  ctx.fillStyle = ink;
  ctx.beginPath();
  ctx.arc(cx, cy - h * 0.05, w * 0.13, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(cx, cy + h * 0.22, w * 0.24, h * 0.16, 0, Math.PI, 0);
  ctx.fill();

  // 7. Watermark banner text
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = `800 ${Math.round(w * 0.048)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('✦ UPLOAD YOUR PHOTO ✦', cx, cy + h * 0.42);

  ctx.restore();
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

/** Cream paper card panel with themed ink borders & corner flourishes */
function drawPaperPanel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  theme: PresetTheme,
  radius: number = 56
) {
  const ink = paperInk(theme);
  ctx.save();

  // Soft shadow behind main paper
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 35;
  ctx.shadowOffsetY = 14;

  // Warm sun-drenched Retro Goa Postcard gradient fill
  const cardGrad = ctx.createLinearGradient(x, y, x, y + h);
  cardGrad.addColorStop(0, '#FFFDF7');
  cardGrad.addColorStop(0.35, '#FFF6E5');
  cardGrad.addColorStop(0.7, '#FFEAD2');
  cardGrad.addColorStop(1, '#FDF0D5');

  drawRoundedRect(ctx, x, y, w, h, radius);
  ctx.fillStyle = cardGrad;
  ctx.fill();

  // Reset shadow
  ctx.shadowColor = 'transparent';

  // Subtle sunburst rays background texture (softened opacity so it never obscures text)
  ctx.save();
  drawRoundedRect(ctx, x, y, w, h, radius);
  ctx.clip();
  const rayCX = x + w / 2;
  const rayCY = y + h * 0.45;
  ctx.fillStyle = `${theme.primaryYellow}0E`;
  const totalRays = 18;
  for (let i = 0; i < totalRays; i += 2) {
    const a1 = (Math.PI * 2 * i) / totalRays;
    const a2 = (Math.PI * 2 * (i + 1)) / totalRays;
    ctx.beginPath();
    ctx.moveTo(rayCX, rayCY);
    ctx.arc(rayCX, rayCY, Math.max(w, h), a1, a2);
    ctx.closePath();
    ctx.fill();
  }
  ctx.restore();

  // Outer primary ink border
  ctx.lineWidth = 10;
  ctx.strokeStyle = ink;
  ctx.stroke();

  // Inner accent pink border line
  ctx.lineWidth = 4;
  ctx.strokeStyle = theme.accentPink;
  drawRoundedRect(ctx, x + 18, y + 18, w - 36, h - 36, Math.max(radius - 14, 0));
  ctx.stroke();

  // Decorative corner stars (✦) in 4 corners of the panel
  const corners = [
    { cx: x + 44, cy: y + 44 },
    { cx: x + w - 44, cy: y + 44 },
    { cx: x + 44, cy: y + h - 44 },
    { cx: x + w - 44, cy: y + h - 44 },
  ];
  corners.forEach((c) => {
    drawSparkle(ctx, c.cx, c.cy, 14, theme.accentPink);
    drawSparkle(ctx, c.cx, c.cy, 8, theme.primaryYellow);
  });

  ctx.restore();
}

/** Detailed tropical Goa coconut palm tree */
function drawLushPalmTree(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  size: number,
  leafColor: string,
  trunkColor: string,
  theme?: PresetTheme,
  flipHorizontally: boolean = false
) {
  ctx.save();
  const scaleX = flipHorizontally ? -1 : 1;
  ctx.translate(cx, baseY);
  ctx.scale(scaleX, 1);

  // Curved textured trunk
  ctx.strokeStyle = trunkColor;
  ctx.lineWidth = size * 0.15;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(0, size * 0.6);
  ctx.quadraticCurveTo(size * 0.22, size * 0.1, 0, -size * 0.35);
  ctx.stroke();

  // Trunk bark ring textures
  ctx.strokeStyle = PAPER_COLOR;
  ctx.lineWidth = 2.5;
  for (let i = 1; i <= 4; i++) {
    const t = i / 5;
    const px = t * (0 - size * 0.1);
    const py = size * 0.6 - t * (size * 0.95);
    ctx.beginPath();
    ctx.moveTo(px - size * 0.06, py);
    ctx.lineTo(px + size * 0.06, py);
    ctx.stroke();
  }

  // Coconuts at crown
  const topX = 0;
  const topY = -size * 0.35;
  ctx.fillStyle = theme ? theme.primaryYellow : '#FFEB00';
  [
    { dx: -size * 0.06, dy: size * 0.04, r: size * 0.07 },
    { dx: size * 0.06, dy: size * 0.04, r: size * 0.07 },
    { dx: 0, dy: size * 0.09, r: size * 0.065 },
  ].forEach((c) => {
    ctx.beginPath();
    ctx.arc(topX + c.dx, topY + c.dy, c.r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = trunkColor;
    ctx.lineWidth = 2;
    ctx.stroke();
  });

  // 6 Lush sweeping palm fronds
  ctx.fillStyle = leafColor;
  const frondAngles = [-2.2, -1.6, -1.0, -0.4, 0.2, 0.7];
  frondAngles.forEach((angle) => {
    const length = size * 0.65;
    const endX = topX + Math.cos(angle) * length;
    const endY = topY + Math.sin(angle) * length;
    const midX = topX + Math.cos(angle + 0.15) * length * 0.55;
    const midY = topY + Math.sin(angle + 0.15) * length * 0.55;

    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(midX, midY, endX, endY);
    ctx.quadraticCurveTo(
      topX + Math.cos(angle - 0.2) * length * 0.5,
      topY + Math.sin(angle - 0.2) * length * 0.5,
      topX,
      topY
    );
    ctx.closePath();
    ctx.fill();

    // Central frond rib stroke
    ctx.strokeStyle = theme ? theme.accentPink : '#FF007A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(topX, topY);
    ctx.quadraticCurveTo(midX, midY, endX, endY);
    ctx.stroke();
  });

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

function drawHibiscusFlower(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  petalColor: string,
  centerColor: string
) {
  ctx.save();
  ctx.fillStyle = petalColor;
  const petals = 5;
  for (let i = 0; i < petals; i++) {
    const angle = (Math.PI * 2 * i) / petals - Math.PI / 2;
    const px = cx + Math.cos(angle) * size * 0.5;
    const py = cy + Math.sin(angle) * size * 0.5;
    ctx.beginPath();
    ctx.arc(px, py, size * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }

  // Center stamen
  ctx.fillStyle = centerColor;
  ctx.beginPath();
  ctx.arc(cx, cy, size * 0.25, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = centerColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + size * 0.4, cy - size * 0.4);
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(cx + size * 0.4, cy - size * 0.4, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBirdMark(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color: string) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(2, size * 0.16);
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
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  const bumps = Math.max(3, Math.round(w / 50));
  ctx.moveTo(x, y);
  for (let i = 0; i < bumps; i++) {
    const segW = w / bumps;
    const midX = x + segW * i + segW / 2;
    const endX = x + segW * (i + 1);
    ctx.quadraticCurveTo(midX, y + (i % 2 === 0 ? -14 : 14), endX, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawFirework(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, color1: string, color2: string) {
  ctx.save();
  ctx.lineWidth = Math.max(3, size * 0.06);
  ctx.lineCap = 'round';
  const rays = 12;
  for (let i = 0; i < rays; i++) {
    const angle = (Math.PI * 2 * i) / rays;
    const isLong = i % 2 === 0;
    const length = isLong ? size : size * 0.6;
    const start = size * 0.18;
    ctx.strokeStyle = isLong ? color1 : color2;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * start, cy + Math.sin(angle) * start);
    ctx.lineTo(cx + Math.cos(angle) * length, cy + Math.sin(angle) * length);
    ctx.stroke();

    if (isLong) {
      ctx.fillStyle = color2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(angle) * (length + size * 0.15), cy + Math.sin(angle) * (length + size * 0.15), size * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();
}

function drawParachute(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, canopyColor: string, stringColor: string) {
  ctx.save();
  ctx.fillStyle = canopyColor;
  ctx.beginPath();
  ctx.arc(cx, cy, size, Math.PI, 0);
  const segments = 4;
  const segW = (size * 2) / segments;
  for (let i = segments; i > 0; i--) {
    const xEnd = cx - size + (i - 1) * segW;
    const xStart = cx - size + i * segW;
    const midX = (xStart + xEnd) / 2;
    ctx.quadraticCurveTo(midX, cy - size * 0.15, xEnd, cy);
  }
  ctx.fill();

  ctx.strokeStyle = stringColor;
  ctx.lineWidth = Math.max(2.5, size * 0.05);
  ctx.beginPath();
  const basketY = cy + size * 1.5;
  for (let i = 0; i <= segments; i++) {
    const px = cx - size + i * segW;
    ctx.moveTo(px, cy);
    ctx.lineTo(cx, basketY);
  }
  ctx.stroke();

  ctx.fillStyle = stringColor;
  ctx.fillRect(cx - size * 0.15, basketY, size * 0.3, size * 0.2);
  ctx.restore();
}

function drawSailboat(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, sailColor: string, hullColor: string) {
  ctx.save();
  // Hull
  ctx.fillStyle = hullColor;
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.8, cy);
  ctx.lineTo(cx + size * 0.8, cy);
  ctx.quadraticCurveTo(cx + size * 0.5, cy + size * 0.4, cx, cy + size * 0.4);
  ctx.quadraticCurveTo(cx - size * 0.5, cy + size * 0.4, cx - size * 0.8, cy);
  ctx.fill();

  // Mast
  ctx.strokeStyle = hullColor;
  ctx.lineWidth = Math.max(3, size * 0.05);
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - size * 1.3);
  ctx.stroke();

  // Main sail
  ctx.fillStyle = sailColor;
  ctx.beginPath();
  ctx.moveTo(cx + size * 0.05, cy - size * 1.2);
  ctx.lineTo(cx + size * 0.75, cy - size * 0.1);
  ctx.lineTo(cx + size * 0.05, cy - size * 0.1);
  ctx.closePath();
  ctx.fill();

  // Jib sail
  ctx.fillStyle = PAPER_COLOR;
  ctx.beginPath();
  ctx.moveTo(cx - size * 0.05, cy - size * 1.05);
  ctx.lineTo(cx - size * 0.55, cy - size * 0.1);
  ctx.lineTo(cx - size * 0.05, cy - size * 0.1);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = hullColor;
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.restore();
}

function drawSurfboard(ctx: CanvasRenderingContext2D, cx: number, cy: number, length: number, angle: number, mainColor: string, stripeColor: string) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle);
  const width = length * 0.28;

  ctx.fillStyle = mainColor;
  ctx.beginPath();
  ctx.moveTo(0, -length / 2);
  ctx.bezierCurveTo(width / 2, -length / 4, width / 2, length / 4, 0, length / 2);
  ctx.bezierCurveTo(-width / 2, length / 4, -width / 2, -length / 4, 0, -length / 2);
  ctx.fill();

  ctx.strokeStyle = stripeColor;
  ctx.lineWidth = Math.max(3, length * 0.03);
  ctx.stroke();

  // Tropical Stripe
  ctx.fillStyle = stripeColor;
  ctx.beginPath();
  ctx.moveTo(-width * 0.15, -length * 0.42);
  ctx.lineTo(width * 0.15, -length * 0.42);
  ctx.lineTo(width * 0.15, length * 0.42);
  ctx.lineTo(-width * 0.15, length * 0.42);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawBunting(
  ctx: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  count: number,
  color1: string,
  color2: string
) {
  ctx.save();
  ctx.strokeStyle = color2;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  const ctrlX = (startX + endX) / 2;
  const ctrlY = (startY + endY) / 2 + 35;
  ctx.quadraticCurveTo(ctrlX, ctrlY, endX, endY);
  ctx.stroke();

  for (let i = 1; i <= count; i++) {
    const t = i / (count + 1);
    const u = 1 - t;
    const px = u * u * startX + 2 * u * t * ctrlX + t * t * endX;
    const py = u * u * startY + 2 * u * t * ctrlY + t * t * endY;

    const dx = 2 * (1 - t) * (ctrlX - startX) + 2 * t * (endX - ctrlX);
    const dy = 2 * (1 - t) * (ctrlY - startY) + 2 * t * (endY - ctrlY);
    const angle = Math.atan2(dy, dx);

    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(angle);
    ctx.fillStyle = i % 2 === 0 ? color1 : color2;
    const flagW = 26;
    const flagH = 34;
    ctx.beginPath();
    ctx.moveTo(-flagW / 2, 0);
    ctx.lineTo(flagW / 2, 0);
    ctx.lineTo(0, flagH);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#00000033';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.restore();
  }
  ctx.restore();
}

function drawSun(ctx: CanvasRenderingContext2D, cx: number, cy: number, size: number, coreColor: string, rayColor: string, isHalf: boolean = false) {
  ctx.save();
  ctx.fillStyle = coreColor;
  ctx.beginPath();
  if (isHalf) {
    ctx.arc(cx, cy, size * 0.5, Math.PI, 0);
  } else {
    ctx.arc(cx, cy, size * 0.5, 0, Math.PI * 2);
  }
  ctx.fill();

  ctx.strokeStyle = rayColor;
  ctx.lineWidth = Math.max(3, size * 0.08);
  ctx.lineCap = 'round';
  const rays = isHalf ? 7 : 12;
  const startAngle = isHalf ? Math.PI : 0;
  const angleRange = isHalf ? Math.PI : Math.PI * 2;
  for (let i = 0; i <= rays; i++) {
    const angle = startAngle + (angleRange * i) / rays;
    if (!isHalf && i === rays) continue;
    const rayDistStart = size * 0.62;
    const rayDistEnd = size * 0.96;
    ctx.beginPath();
    ctx.moveTo(cx + Math.cos(angle) * rayDistStart, cy + Math.sin(angle) * rayDistStart);
    ctx.lineTo(cx + Math.cos(angle) * rayDistEnd, cy + Math.sin(angle) * rayDistEnd);
    ctx.stroke();

    // Ray tips
    if (i % 2 === 0) {
      ctx.fillStyle = rayColor;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(angle) * (rayDistEnd + 8), cy + Math.sin(angle) * (rayDistEnd + 8), 5, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (isHalf) {
    ctx.strokeStyle = coreColor;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(cx - size * 0.65, cy);
    ctx.lineTo(cx + size * 0.65, cy);
    ctx.stroke();
  }
  ctx.restore();
}

/** Perforated-edge postage stamp with genuine cutouts & high-contrast dark ink text */
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

  // Create postage stamp base with serrated perforated edges
  const toothRadius = 6;
  const numTeethX = 8;
  const numTeethY = 10;
  const stepX = w / numTeethX;
  const stepY = h / numTeethY;

  ctx.fillStyle = PAPER_COLOR;
  ctx.fillRect(x, y, w, h);

  // Punch out perforation holes along 4 edges
  ctx.fillStyle = theme.bgColor;
  for (let i = 0; i <= numTeethX; i++) {
    ctx.beginPath();
    ctx.arc(x + i * stepX, y, toothRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + i * stepX, y + h, toothRadius, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let j = 0; j <= numTeethY; j++) {
    ctx.beginPath();
    ctx.arc(x, y + j * stepY, toothRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + w, y + j * stepY, toothRadius, 0, Math.PI * 2);
    ctx.fill();
  }

  // Inner frame of stamp
  const pad = w * 0.12;
  const ix = x + pad;
  const iy = y + pad;
  const iw = w - pad * 2;
  const ih = h * 0.62;

  ctx.save();
  drawRoundedRect(ctx, ix, iy, iw, ih, 4);
  ctx.clip();
  ctx.fillStyle = PAPER_COLOR;
  ctx.fillRect(ix, iy, iw, ih);

  // Sun
  ctx.fillStyle = theme.accentPink;
  ctx.beginPath();
  ctx.arc(ix + iw * 0.72, iy + ih * 0.32, ih * 0.25, 0, Math.PI * 2);
  ctx.fill();

  // Sea line & palm
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(ix, iy + ih * 0.75);
  ctx.lineTo(ix + iw, iy + ih * 0.75);
  ctx.stroke();

  drawLushPalmTree(ctx, ix + iw * 0.28, iy + ih * 0.88, ih * 0.55, theme.accentPink, ink, theme);
  ctx.restore();

  // Stamp labels (High-contrast dark ink)
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.font = `900 ${Math.round(w * 0.16)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('GOA', x + w / 2, y + h * 0.82);
  ctx.font = `800 ${Math.round(w * 0.085)}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('INDIA · 2026', x + w / 2, y + h * 0.94);

  // Postal cancellation wavy postmark across stamp corner
  ctx.strokeStyle = `${ink}99`;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  for (let wave = 0; wave < 3; wave++) {
    const wy = y + h * 0.2 + wave * 14;
    ctx.moveTo(x - 20, wy);
    ctx.quadraticCurveTo(x + w * 0.3, wy - 10, x + w * 0.6, wy);
    ctx.quadraticCurveTo(x + w * 0.8, wy + 10, x + w + 30, wy);
  }
  ctx.stroke();

  ctx.restore();
}

/** Small hanging tag/ribbon with lanyard hole & notch */
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

  // Tag body
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h * 0.75);
  ctx.lineTo(x + w / 2, y + h);
  ctx.lineTo(x, y + h * 0.75);
  ctx.closePath();
  ctx.fill();

  ctx.lineWidth = 3;
  ctx.strokeStyle = PAPER_COLOR;
  ctx.stroke();

  // Eyelet ring at top
  ctx.fillStyle = PAPER_COLOR;
  ctx.beginPath();
  ctx.arc(cx, y + 14, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  if (lines[0]) {
    ctx.font = `900 ${Math.round(h * 0.3)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(lines[0], cx, y + h * 0.44);
  }
  if (lines[1]) {
    ctx.font = `800 ${Math.round(h * 0.17)}px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(lines[1], cx, y + h * 0.65);
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

  ctx.lineWidth = 3;
  ctx.strokeStyle = PAPER_COLOR;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = `900 ${fontSize}px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(text, x + w / 2, y + h * 0.68);
  ctx.restore();
}

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

/** Circular seal/stamp badge with high-contrast dark ink text */
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
  ctx.setLineDash([6, 8]);
  ctx.lineWidth = 2.5;
  ctx.strokeStyle = ink;
  ctx.stroke();
  ctx.setLineDash([]);

  drawLushPalmTree(ctx, cx, cy + r * 0.1, r * 0.45, theme.accentPink, ink, theme);

  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `800 ${Math.round(r * 0.125)}px "Plus Jakarta Sans", sans-serif`;
  if (lines[0]) drawTextAlongArc(ctx, `★ ${lines[0]} ★`, cx, cy, r - 26, 0, false);
  if (lines[1]) drawTextAlongArc(ctx, `★ ${lines[1]} ★`, cx, cy, r - 26, 0, true);
  ctx.restore();
}

/** Two-tone scalloped sunburst ring around circular photos */
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
  const teeth = 36;

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

  ctx.lineWidth = 4;
  ctx.strokeStyle = paperInk(theme);
  ctx.beginPath();
  ctx.arc(cx, cy, rOuter, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

/** Wooden signpost with directional arrows */
function drawSignpost(ctx: CanvasRenderingContext2D, x: number, y: number, height: number, theme: PresetTheme) {
  const ink = paperInk(theme);
  ctx.save();

  // Wooden pole
  ctx.fillStyle = ink;
  ctx.fillRect(x - 8, y, 16, height);

  const labels: { text: string; fill: string; textColor: string; stroke?: boolean }[] = [
    { text: 'BUILD ➔', fill: theme.accentPink, textColor: '#FFFFFF' },
    { text: 'SHIP ➔', fill: ink, textColor: '#FFFFFF' },
    { text: 'REPEAT ➔', fill: PAPER_COLOR, textColor: ink, stroke: true },
  ];
  const signW = 220;
  const signH = 74;
  const gap = 32;

  labels.forEach((l, i) => {
    const sy = y + 24 + i * (signH + gap);
    ctx.fillStyle = l.fill;
    ctx.beginPath();
    ctx.moveTo(x, sy);
    ctx.lineTo(x + signW - 28, sy);
    ctx.lineTo(x + signW, sy + signH / 2);
    ctx.lineTo(x + signW - 28, sy + signH);
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
    ctx.font = `900 32px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(l.text, x + signW / 2 - 10, sy + signH / 2 + 11);
  });

  ctx.restore();
}

/** Goan Portuguese Villa & beach scene */
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

  // Sand dune line
  ctx.strokeStyle = ink;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(x, y + h * 0.92);
  ctx.quadraticCurveTo(x + w * 0.5, y + h * 0.85, x + w, y + h * 0.92);
  ctx.stroke();

  const houseW = w * 0.64;
  const houseH = h * 0.44;
  const hx = x + w * 0.22;
  const hy = y + h * 0.42;

  // House body
  ctx.fillStyle = PAPER_COLOR;
  ctx.fillRect(hx, hy, houseW, houseH);
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3.5;
  ctx.strokeRect(hx, hy, houseW, houseH);

  // Terracotta roof
  ctx.fillStyle = theme.accentPink;
  ctx.beginPath();
  ctx.moveTo(hx - 18, hy);
  ctx.lineTo(hx + houseW / 2, hy - houseH * 0.58);
  ctx.lineTo(hx + houseW + 18, hy);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = ink;
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Door
  ctx.fillStyle = ink;
  ctx.fillRect(hx + houseW * 0.4, hy + houseH * 0.4, houseW * 0.22, houseH * 0.6);

  // Windows
  ctx.strokeStyle = ink;
  ctx.lineWidth = 2.5;
  ctx.strokeRect(hx + houseW * 0.1, hy + houseH * 0.16, houseW * 0.18, houseH * 0.24);
  ctx.strokeRect(hx + houseW * 0.72, hy + houseH * 0.16, houseW * 0.18, houseH * 0.24);

  // Palm tree next to house
  drawLushPalmTree(ctx, x + w * 0.1, y + h * 0.9, w * 0.35, theme.accentPink, ink, theme);

  // Retro Goan Scooter parked by the villa
  const mx = x + w * 0.84;
  const my = y + h * 0.88;
  ctx.strokeStyle = ink;
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(mx - 24, my, 16, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(mx + 22, my, 16, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = theme.accentPink;
  ctx.beginPath();
  ctx.moveTo(mx - 24, my - 14);
  ctx.quadraticCurveTo(mx, my - 44, mx + 22, my - 14);
  ctx.stroke();

  ctx.restore();
}

/** Decorative barcode */
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

/** Bordered name plate box with crisp high-contrast dark ink text */
function drawNamePlate(ctx: CanvasRenderingContext2D, cx: number, y: number, w: number, h: number, text: string, theme: PresetTheme, fontSize: number) {
  const ink = paperInk(theme);
  ctx.save();

  ctx.fillStyle = PAPER_COLOR;
  drawRoundedRect(ctx, cx - w / 2, y, w, h, 20);
  ctx.fill();

  ctx.lineWidth = 4;
  ctx.strokeStyle = ink;
  ctx.stroke();

  // Corner star flourishes
  drawSparkle(ctx, cx - w / 2 + 24, y + h / 2, 10, theme.accentPink);
  drawSparkle(ctx, cx + w / 2 - 24, y + h / 2, 10, theme.accentPink);

  // High contrast dark ink for name text
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.font = `900 ${fontSize}px "Playfair Display", serif`;
  ctx.fillText(text, cx, y + h * 0.68);
  ctx.restore();
}

/** "HACKER गोवा HOUSE" title with Devanagari text in vibrant pink & crisp dark ink for English */
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

  // HACKER in dark ink
  ctx.fillStyle = ink;
  ctx.fillText(partA, curX, y);
  curX += wA;

  // Devanagari word "गोवा" in vibrant sunset pink with gold shadow
  ctx.save();
  ctx.fillStyle = theme.primaryYellow;
  ctx.fillText(partB, curX + 2, y + 2);
  ctx.fillStyle = theme.accentPink;
  ctx.fillText(partB, curX, y);
  ctx.restore();
  curX += wB;

  // HOUSE in dark ink
  ctx.fillStyle = ink;
  ctx.fillText(partC, curX, y);

  ctx.restore();
}

/**
 * Render Format A: Profile Frame — illustrated postcard, social media share format
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

  // 2. Cream paper panel with corner flourishes
  drawPaperPanel(ctx, 56, 56, CANVAS_SIZE - 112, CANVAS_SIZE - 112, theme, 72);

  // 3. Postage stamp (top-left) & circular seal (top-right)
  drawPostageStamp(ctx, 130, 130, 230, 270, theme);
  drawCircularSeal(ctx, 1740, 270, 145, theme, ['BUILD IN GOA', 'SHIP FROM PARADISE']);

  // 4. Hanging event tag
  drawHangingTag(ctx, CANVAS_SIZE / 2, 18, 350, 125, ['HH GOA 2026', "LET'S BUILD"], ink);

  // 5. Title & Subtitle with balanced spacing
  drawPostcardTitle(ctx, CANVAS_SIZE / 2, 475, theme, 104);
  ctx.save();
  ctx.fillStyle = theme.accentPink;
  ctx.textAlign = 'center';
  ctx.font = `800 32px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('✦ #FRAMEINGOA · GOA, INDIA ✦', CANVAS_SIZE / 2, 528);
  ctx.restore();

  // 6. Center Photo Frame
  const photoSize = 960;
  const cropArea = {
    x: (CANVAS_SIZE - photoSize) / 2,
    y: 580,
    width: photoSize,
    height: photoSize,
  };

  if (img) {
    drawTransformedImage(ctx, img, cropArea, transform, photoShape, PAPER_COLOR);
  } else {
    drawDefaultAvatar(ctx, cropArea, photoShape, theme);
  }

  if (photoShape === 'circle') {
    drawScallopedRing(ctx, cropArea, theme, 48);
  } else {
    ctx.save();
    ctx.lineWidth = 36;
    ctx.strokeStyle = theme.primaryYellow;
    drawShapePath(ctx, photoShape, cropArea, 20);
    ctx.stroke();
    ctx.lineWidth = 18;
    ctx.strokeStyle = theme.accentPink;
    drawShapePath(ctx, photoShape, cropArea, 50);
    ctx.stroke();
    ctx.restore();
  }

  // 7. Name plate (High-contrast dark ink text)
  const displayName = (details.name.trim() || 'SATOSHI NAKAMOTO').toUpperCase();
  drawNamePlate(ctx, CANVAS_SIZE / 2, cropArea.y + photoSize + 40, 920, 135, displayName, theme, 54);

  // 8. Role / title pill
  const roleText = (details.role.trim() || 'FULLSTACK WEB3').toUpperCase();
  const titleText = (details.title.trim() || 'PROTOCOL ENGINEER').toUpperCase();
  ctx.save();
  const pillY = cropArea.y + photoSize + 198;
  const pillW = 920;
  const pillH = 105;
  ctx.fillStyle = theme.accentPink;
  drawRoundedRect(ctx, (CANVAS_SIZE - pillW) / 2, pillY, pillW, pillH, 52);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = PAPER_COLOR;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.font = `800 36px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(`◆ ${roleText} · ${titleText} ◆`, CANVAS_SIZE / 2, pillY + 66);
  ctx.restore();

  // 9. Scattered doodles (Lush Goa Festival Vibe)
  drawBunting(ctx, 56, 56, CANVAS_SIZE / 2 - 200, 56, 5, theme.accentPink, theme.primaryYellow);
  drawBunting(ctx, CANVAS_SIZE / 2 + 200, 56, CANVAS_SIZE - 56, 56, 5, theme.primaryYellow, theme.accentPink);

  drawFirework(ctx, 240, 760, 120, theme.accentPink, theme.primaryYellow);
  drawFirework(ctx, 1760, 840, 130, theme.primaryYellow, theme.accentPink);

  drawParachute(ctx, 300, 480, 75, theme.primaryYellow, ink);
  drawParachute(ctx, 1750, 520, 70, theme.accentPink, ink);

  drawSun(ctx, 280, 1680, 150, theme.primaryYellow, theme.accentPink, false);
  drawSailboat(ctx, 520, 1800, 95, theme.accentPink, ink);
  drawSurfboard(ctx, 1760, 1300, 230, Math.PI / 6, theme.primaryYellow, theme.accentPink);

  drawHibiscusFlower(ctx, 140, 1420, 42, theme.accentPink, theme.primaryYellow);
  drawHibiscusFlower(ctx, 1840, 1140, 48, theme.primaryYellow, theme.accentPink);

  drawSparkle(ctx, 200, 1340, 36, theme.primaryYellow);
  drawSparkle(ctx, 1820, 1040, 44, theme.accentPink);

  drawBirdMark(ctx, 1680, 500, 40, ink);
  drawBirdMark(ctx, 1750, 540, 30, ink);
  drawBirdMark(ctx, 350, 1000, 45, ink);

  drawWaveLine(ctx, 130, 1860, 300, ink);
  drawWaveLine(ctx, 380, 1840, 200, ink);

  drawLushPalmTree(ctx, 240, 1220, 130, theme.accentPink, ink, theme);
  drawLushPalmTree(ctx, 1800, 1640, 130, theme.primaryYellow, ink, theme, true);

  // 10. QR Code (bottom-right, high-contrast dark ink modules)
  if (details.showQrCode ?? true) {
    const qrText = details.qrData?.trim() || 'https://x.com/HackerHouseGoa';
    drawQRCodeGraphic(ctx, qrText, CANVAS_SIZE - 320, CANVAS_SIZE - 290, 180, ink, PAPER_COLOR, 22);
  }

  // 11. Bottom-left hashtag
  ctx.save();
  ctx.fillStyle = ink;
  ctx.textAlign = 'left';
  ctx.font = `800 36px "Plus Jakarta Sans", sans-serif`;
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
  drawPostageStamp(ctx, 100, 110, 210, 250, theme);
  const badgeTypeLabel = details.badgeType ? details.badgeType.toUpperCase() : 'BUILDER';
  drawCircularSeal(ctx, 1790, 240, 140, theme, ['BUILD IN GOA', 'SHIP FROM PARADISE']);

  // 5. Hanging event tag
  drawHangingTag(ctx, CANVAS_W / 2, 18, 340, 125, ['HH GOA 2026', `${badgeTypeLabel} PASS`], ink);

  // 6. Title
  drawPostcardTitle(ctx, CANVAS_W / 2, 435, theme, 96);
  ctx.save();
  ctx.fillStyle = theme.accentPink;
  ctx.textAlign = 'center';
  ctx.font = `800 30px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText(`✦ OFFICIAL ${badgeTypeLabel} PASS · GOA 2026 ✦`, CANVAS_W / 2, 484);
  ctx.restore();

  // 7. Center Photo Area
  const photoSize = 780;
  const photoX = (CANVAS_W - photoSize) / 2;
  const photoY = 530;
  const photoArea = { x: photoX, y: photoY, width: photoSize, height: photoSize };

  if (img) {
    drawTransformedImage(ctx, img, photoArea, transform, photoShape, PAPER_COLOR);
  } else {
    drawDefaultAvatar(ctx, photoArea, photoShape, theme);
  }

  if (photoShape === 'circle') {
    drawScallopedRing(ctx, photoArea, theme, 42);
  } else {
    ctx.save();
    ctx.lineWidth = 22;
    ctx.strokeStyle = theme.primaryYellow;
    drawShapePath(ctx, photoShape, photoArea);
    ctx.stroke();
    ctx.lineWidth = 10;
    ctx.strokeStyle = theme.accentPink;
    drawShapePath(ctx, photoShape, photoArea, 16);
    ctx.stroke();
    ctx.restore();
  }

  // 8. Signpost (left) & beach house scene (right) with clean spacing
  drawSignpost(ctx, 240, 700, 560, theme);
  drawSun(ctx, 1670, 720, 200, theme.primaryYellow, theme.accentPink, true);
  drawBeachHouseScene(ctx, 1460, 680, 440, 640, theme);

  // Festival Vibes
  drawBunting(ctx, 48, 48, CANVAS_W / 2 - 200, 48, 4, theme.primaryYellow, theme.accentPink);
  drawBunting(ctx, CANVAS_W / 2 + 200, 48, CANVAS_W - 48, 48, 4, theme.accentPink, theme.primaryYellow);

  drawFirework(ctx, 320, 520, 80, theme.primaryYellow, theme.accentPink);
  drawParachute(ctx, 160, 480, 60, theme.primaryYellow, ink);
  drawFirework(ctx, 1750, 440, 80, theme.accentPink, theme.primaryYellow);

  drawSurfboard(ctx, 150, 1200, 220, Math.PI / 16, theme.primaryYellow, theme.accentPink);
  drawLushPalmTree(ctx, 160, 1550, 120, theme.accentPink, ink, theme);

  drawHibiscusFlower(ctx, 1550, 1380, 36, theme.accentPink, theme.primaryYellow);
  drawSparkle(ctx, 380, 1440, 40, theme.primaryYellow);
  drawSparkle(ctx, 1550, 1440, 50, theme.accentPink);

  drawBirdMark(ctx, 1550, 480, 40, ink);
  drawBirdMark(ctx, 1620, 520, 30, ink);

  // 9. Name plate (High-contrast dark ink text, enlarged size)
  let currentY = photoY + photoSize + 40;
  const displayName = (details.name.trim() || 'SATOSHI NAKAMOTO').toUpperCase();
  drawNamePlate(ctx, CANVAS_W / 2, currentY, 880, 135, displayName, theme, 56);
  currentY += 135 + 24;

  // 10. Role pill (Enlarged text & size)
  const roleText = (details.role.trim() || 'FULLSTACK WEB3').toUpperCase();
  ctx.save();
  const pillW = 880;
  const pillH = 100;
  const pillX = (CANVAS_W - pillW) / 2;
  ctx.fillStyle = theme.accentPink;
  drawRoundedRect(ctx, pillX, currentY, pillW, pillH, 50);
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = PAPER_COLOR;
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = `800 40px "Plus Jakarta Sans", sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(`◆ ${roleText} ◆`, CANVAS_W / 2, currentY + 65);
  ctx.restore();
  currentY += pillH + 36;

  // 11. Three-column footer detail card (Expanded height 740px & larger fonts to fill vertical space)
  const cardW = 1824;
  const cardH = 740;
  const cardX = (CANVAS_W - cardW) / 2;
  const cardY = currentY;

  ctx.save();
  ctx.fillStyle = PAPER_COLOR;
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, 44);
  ctx.fill();
  ctx.lineWidth = 4;
  ctx.strokeStyle = ink;
  ctx.stroke();

  const colW = cardW / 3;

  // Vertical dividers
  ctx.strokeStyle = `${ink}55`;
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 10]);
  [1, 2].forEach((i) => {
    ctx.beginPath();
    ctx.moveTo(cardX + colW * i, cardY + 45);
    ctx.lineTo(cardX + colW * i, cardY + cardH - 45);
    ctx.stroke();
  });
  ctx.setLineDash([]);

  const colLabelFont = `800 36px "Plus Jakarta Sans", sans-serif`;

  // Column 1: Builder Class + Large Scannable QR Code
  const col1CX = cardX + colW * 0.5;
  ctx.fillStyle = theme.accentPink;
  ctx.textAlign = 'center';
  ctx.font = colLabelFont;
  ctx.fillText('✦ BUILDER CLASS ✦', col1CX, cardY + 75);

  const builderClass = (details.title.trim() || 'Terminal Wizard').toUpperCase();
  ctx.fillStyle = ink;
  ctx.font = `900 42px "Plus Jakarta Sans", sans-serif`;
  wrapCenteredText(ctx, builderClass, col1CX, cardY + 138, colW - 50, 48);

  if (details.showQrCode ?? true) {
    const qrText = details.qrData?.trim() || 'https://x.com/HackerHouseGoa';
    const qrSize = 360;
    drawQRCodeGraphic(ctx, qrText, col1CX - qrSize / 2, cardY + 280, qrSize, ink, PAPER_COLOR, 24);
  }

  // Column 2: Beach Bag (Larger item text & spacing)
  const col2CX = cardX + colW * 1.5;
  ctx.fillStyle = theme.accentPink;
  ctx.font = colLabelFont;
  ctx.fillText('✦ BEACH BAG ✦', col2CX, cardY + 75);

  const filledBeachBag = (details.beachBag ?? []).map((v) => v.trim()).filter((v) => v !== '');
  const beachBag = filledBeachBag.length > 0 ? filledBeachBag.slice(0, 3) : DEFAULT_BEACH_BAG;
  ctx.textAlign = 'left';
  const col2ItemX = cardX + colW * 1.15;
  beachBag.forEach((item, i) => {
    const iy = cardY + 195 + i * 115;
    drawLushPalmTree(ctx, cardX + colW * 1.09, iy - 14, 34, theme.accentPink, ink, theme);
    ctx.fillStyle = ink;
    ctx.font = `700 38px "Plus Jakarta Sans", sans-serif`;
    ctx.fillText(item, col2ItemX, iy);
  });

  // Column 3: Currently Shipping + Barcode + Builder ID (Enlarged)
  const col3CX = cardX + colW * 2.5;
  ctx.textAlign = 'center';
  ctx.fillStyle = theme.accentPink;
  ctx.font = colLabelFont;
  ctx.fillText('✦ CURRENTLY SHIPPING ✦', col3CX, cardY + 75);

  const shippingText = (details.currentlyShipping?.trim() || 'BUILDING THE FUTURE').toUpperCase();
  ctx.fillStyle = ink;
  ctx.font = `900 40px "Plus Jakarta Sans", sans-serif`;
  wrapCenteredText(ctx, shippingText, col3CX, cardY + 138, colW - 50, 46);

  const builderId = generateBuilderId(details.handle || details.name || 'HHGOA2026');
  const barcodeW = colW - 80;
  const barcodeX = col3CX - barcodeW / 2;
  drawBarcode(ctx, barcodeX, cardY + 370, barcodeW, 95, details.handle || details.name || 'HHGOA2026', ink);

  ctx.fillStyle = ink;
  ctx.font = `700 30px "Courier New", monospace`;
  ctx.fillText(`BUILDER ID  ${builderId}`, col3CX, cardY + 530);

  ctx.restore();

  // 12. Bottom ribbon (Enlarged height & font)
  const ribbonW = 1650;
  const ribbonH = 115;
  drawFullRibbon(ctx, (CANVAS_W - ribbonW) / 2, CANVAS_H - 225, ribbonW, ribbonH, '#FRAMEINGOA', theme.accentPink, 48);

  // 13. Footer credit line
  ctx.save();
  ctx.fillStyle = ink;
  ctx.textAlign = 'center';
  ctx.font = `700 30px "Plus Jakarta Sans", sans-serif`;
  ctx.fillText('✦ GOA, INDIA · 28–31 OCT 2026 ✦', CANVAS_W / 2, CANVAS_H - 72);
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
