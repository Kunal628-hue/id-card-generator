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
 * Compresses and saves photo to localStorage
 */
export function saveImageToStorage(img: HTMLImageElement): void {
  try {
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
 * Loads image from localStorage if available, or defaults to sample avatar
 */
export function loadSavedImage(): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    try {
      const savedDataUrl = localStorage.getItem(STORAGE_KEY);
      if (savedDataUrl) {
        const img = new Image();
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
