const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl}/api`;
export const SERVER_URL = rawApiUrl.replace(/\/api$/, '');
export const IMAGE_URL = SERVER_URL; // Alias for backward compatibility if needed
export const API_KEY = 'himalayan-ripple-secure-key';