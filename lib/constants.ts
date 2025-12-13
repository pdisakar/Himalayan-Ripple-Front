const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "https://himalayan-ripple-server.onrender.com";
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://himalayan-ripple-front.vercel.app/";
export const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;
export const SERVER_URL = rawApiUrl.replace(/\/api$/, '');
export const IMAGE_URL = SERVER_URL; // Alias for backward compatibility if needed
export const API_KEY = 'himalayan-ripple-secure-key';