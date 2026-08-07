import type { VercelRequest, VercelResponse } from '@vercel/node';
import { put } from '@vercel/blob';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const filename = (req.query.filename as string) || `hh-id-card-${Date.now()}.jpg`;

    // Check if token exists
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return res.status(400).json({
        error: 'BLOB_READ_WRITE_TOKEN environment variable is missing on Vercel.',
        fallback: true
      });
    }

    const blob = await put(filename, req, {
      access: 'public',
      contentType: (req.headers['content-type'] as string) || 'image/jpeg',
    });

    return res.status(200).json({
      success: true,
      url: blob.url,
      downloadUrl: blob.downloadUrl,
      pathname: blob.pathname,
      contentType: blob.contentType,
    });
  } catch (error: any) {
    console.error('Vercel Blob Upload Error:', error);
    return res.status(500).json({
      error: error.message || 'Failed to upload to Vercel Blob Storage',
      fallback: true
    });
  }
}
