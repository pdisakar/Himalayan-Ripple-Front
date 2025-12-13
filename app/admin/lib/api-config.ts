import { SERVER_URL } from '@/lib/constants';

// Admin API configuration
// Use environment variable for production, fallback to localhost for development
export const ADMIN_API_URL = SERVER_URL;
export const ADMIN_API_BASE = `${ADMIN_API_URL}/api`;

// Helper function to build API URLs
export const getApiUrl = (path: string) => {
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${ADMIN_API_BASE}/${cleanPath}`;
};

// Helper to get auth headers
export const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Helper function for image URLs
export const getImageUrl = (path: string) => {
  if (!path) return '';
  return `${ADMIN_API_URL}${path}`;
};

// Helper function to upload images
export const uploadImage = async (base64Image: string, type: string = 'image'): Promise<string> => {
  const res = await fetch(getApiUrl('upload/image'), {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ image: base64Image, type }),
  });
  if (!res.ok) throw new Error('Image upload failed');
  const data = await res.json();
  return data.path;
};

// Helper function to delete images
export const deleteImage = async (imagePath: string): Promise<void> => {
  if (!imagePath || imagePath.startsWith('data:')) return;
  try {
    await fetch(getApiUrl('upload/image'), {
      method: 'DELETE',
      headers: getAuthHeaders(),
      body: JSON.stringify({ path: imagePath }),
    });
  } catch (err) {
    console.error('Failed to delete image:', err);
  }
};

// Helper function to normalize image paths (remove localhost URL if present)
export const normalizeImagePath = (url: string): string => {
  if (!url) return '';
  if (url.startsWith(ADMIN_API_URL)) {
    return url.replace(ADMIN_API_URL, '');
  }
  return url;
};
