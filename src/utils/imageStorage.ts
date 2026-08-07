const STORAGE_KEY = 'hh_id_card_saved_photo';
const DETAILS_KEY = 'hh_id_card_saved_details';

/**
 * Creates default sample demo avatar
 */
export function createSampleAvatarImage(): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Emerald background
      ctx.fillStyle = '#005833';
      ctx.fillRect(0, 0, 800, 800);

      // Yellow head
      ctx.fillStyle = '#FFECA8';
      ctx.beginPath();
      ctx.arc(400, 320, 140, 0, Math.PI * 2);
      ctx.fill();

      // Glasses
      ctx.fillStyle = '#006B3E';
      ctx.fillRect(290, 290, 95, 55);
      ctx.fillRect(415, 290, 95, 55);
      ctx.fillRect(380, 310, 40, 15);

      // Body
      ctx.fillStyle = '#FFECA8';
      ctx.beginPath();
      ctx.ellipse(400, 720, 240, 220, 0, 0, Math.PI * 2);
      ctx.fill();
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
