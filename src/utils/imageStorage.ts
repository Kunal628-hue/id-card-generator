const STORAGE_KEY = 'hh_id_card_saved_photo';
const DETAILS_KEY = 'hh_id_card_saved_details';

/**
 * Creates default sample demo avatar
 */
/**
 * Creates default sample demo avatar (Tropical Goa Beach Hacker)
 */
export function createSampleAvatarImage(): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = 1000;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // 1. Goa Sunset Gradient background
      const grad = ctx.createLinearGradient(0, 0, 0, 1000);
      grad.addColorStop(0, '#FFECA8');
      grad.addColorStop(0.35, '#FF70A6');
      grad.addColorStop(0.7, '#FF007A');
      grad.addColorStop(1, '#004D2D');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1000, 1000);

      // 2. Setting Sun Disk
      ctx.fillStyle = '#FFEB00';
      ctx.beginPath();
      ctx.arc(500, 480, 260, 0, Math.PI * 2);
      ctx.fill();

      // 3. Ocean reflection water
      ctx.fillStyle = '#004D2D';
      ctx.fillRect(0, 700, 1000, 300);

      ctx.strokeStyle = '#FFEB00';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(300, 740); ctx.lineTo(700, 740);
      ctx.moveTo(350, 780); ctx.lineTo(650, 780);
      ctx.moveTo(400, 820); ctx.lineTo(600, 820);
      ctx.stroke();

      // 4. Palm trees framing sides
      // Left palm
      ctx.strokeStyle = '#002B19';
      ctx.lineWidth = 22;
      ctx.beginPath();
      ctx.moveTo(100, 900);
      ctx.quadraticCurveTo(220, 500, 120, 200);
      ctx.stroke();

      ctx.fillStyle = '#003820';
      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + (i - 2) * 0.5;
        ctx.beginPath();
        ctx.arc(120 + Math.cos(angle) * 120, 200 + Math.sin(angle) * 120, 60, 0, Math.PI * 2);
        ctx.fill();
      }

      // Right palm
      ctx.strokeStyle = '#002B19';
      ctx.lineWidth = 22;
      ctx.beginPath();
      ctx.moveTo(900, 900);
      ctx.quadraticCurveTo(780, 500, 880, 200);
      ctx.stroke();

      ctx.fillStyle = '#003820';
      for (let i = 0; i < 5; i++) {
        const angle = -Math.PI / 2 + (i - 2) * 0.5;
        ctx.beginPath();
        ctx.arc(880 + Math.cos(angle) * 120, 200 + Math.sin(angle) * 120, 60, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Goa Hacker Avatar Silhouette with sunglasses
      ctx.fillStyle = '#002B19';
      // Head
      ctx.beginPath();
      ctx.arc(500, 420, 150, 0, Math.PI * 2);
      ctx.fill();

      // Shoulders
      ctx.beginPath();
      ctx.ellipse(500, 820, 260, 220, 0, Math.PI, 0);
      ctx.fill();

      // Cool pink/yellow beach sunglasses
      ctx.fillStyle = '#FF007A';
      ctx.beginPath();
      ctx.roundRect(380, 390, 105, 55, 12);
      ctx.roundRect(515, 390, 105, 55, 12);
      ctx.fill();
      ctx.fillRect(475, 410, 50, 14);

      ctx.fillStyle = '#FFEB00';
      ctx.beginPath();
      ctx.arc(410, 415, 15, 0, Math.PI * 2);
      ctx.arc(545, 415, 15, 0, Math.PI * 2);
      ctx.fill();

      // Watermark text
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.font = '800 36px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('🌴 GOA BEACH HACKER 🌴', 500, 940);
    }
    const img = new Image();
    img.onload = () => resolve(img);
    img.src = canvas.toDataURL('image/png');
  });
}

/**
 * Uploads file to Vercel Blob Storage endpoint (/api/upload).
 * Returns the public Vercel Blob URL on success, or null if API/token not ready.
 */
export async function uploadFileToVercelBlob(file: File): Promise<string | null> {
  try {
    const filename = `id-card-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const response = await fetch(`/api/upload?filename=${encodeURIComponent(filename)}`, {
      method: 'POST',
      headers: {
        'Content-Type': file.type || 'image/jpeg',
      },
      body: file,
    });

    if (!response.ok) {
      console.warn('Vercel Blob upload HTTP status:', response.status);
      return null;
    }

    const data = await response.json();
    if (data.success && data.url) {
      console.log('Successfully uploaded photo to Vercel Blob Storage:', data.url);
      saveBlobUrlToStorage(data.url);
      return data.url;
    }
  } catch (err) {
    console.warn('Vercel Blob upload failed (fallback to local storage):', err);
  }
  return null;
}

/**
 * Save Vercel Blob URL to localStorage
 */
export function saveBlobUrlToStorage(url: string): void {
  try {
    localStorage.setItem(STORAGE_KEY, url);
  } catch (err) {
    console.warn('Failed to save Vercel Blob URL to localStorage', err);
  }
}

/**
 * Compresses and saves photo to localStorage
 */
export function saveImageToStorage(img: HTMLImageElement): void {
  try {
    // If image source is already a remote Vercel Blob URL, save URL directly
    if (img.src.startsWith('http://') || img.src.startsWith('https://')) {
      saveBlobUrlToStorage(img.src);
      return;
    }

    const canvas = document.createElement('canvas');
    const maxDim = 1000;
    let width = img.width;
    let height = img.height;

    if (width > maxDim || height > maxDim) {
      if (width > height) {
        height = Math.round((height * maxDim) / width);
        width = maxDim;
      } else {
        width = Math.round((width * maxDim) / height);
        height = maxDim;
      }
    }

    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, 0, 0, width, height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      localStorage.setItem(STORAGE_KEY, dataUrl);
    }
  } catch (err) {
    console.warn('Failed to save image to localStorage', err);
  }
}

/**
 * Loads image from Vercel Blob Storage URL / localStorage if available, or defaults to sample avatar
 */
export function loadSavedImage(): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    try {
      const savedDataUrl = localStorage.getItem(STORAGE_KEY);
      if (savedDataUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve(img);
        img.onerror = async () => {
          const sample = await createSampleAvatarImage();
          resolve(sample);
        };
        img.src = savedDataUrl;
        return;
      }
    } catch (e) {
      console.warn('localStorage read error', e);
    }

    createSampleAvatarImage().then(resolve);
  });
}

/**
 * Load saved user details from localStorage
 */
export function loadSavedDetails<T>(defaultDetails: T): T {
  try {
    const saved = localStorage.getItem(DETAILS_KEY);
    if (saved) {
      return { ...defaultDetails, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn('Failed to load saved details', e);
  }
  return defaultDetails;
}

/**
 * Save user details to localStorage
 */
export function saveDetailsToStorage<T>(details: T): void {
  try {
    localStorage.setItem(DETAILS_KEY, JSON.stringify(details));
  } catch (e) {
    console.warn('Failed to save details to storage', e);
  }
}
