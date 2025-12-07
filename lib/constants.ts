export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
export const IMAGE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/api$/, '');