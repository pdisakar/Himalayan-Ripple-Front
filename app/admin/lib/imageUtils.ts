/**
 * Process an image file for upload (backend will convert to AVIF)
 * @param file - The image file to process
 * @param quality - Quality setting (0.0 to 1.0), default 0.92
 * @param maxSize - Maximum file size in bytes, default 5MB
 * @returns Base64 encoded image string
 */
export async function processImageToWebP(
  file: File,
  quality: number = 0.92,
  maxSize: number = 1024 * 1024 * 5
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const img = new Image();
      
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Calculate dimensions (max 4000px to prevent huge uploads)
        const maxDimension = 4000;
        let width = img.naturalWidth;
        let height = img.naturalHeight;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height / width) * maxDimension;
            width = maxDimension;
          } else {
            width = (width / height) * maxDimension;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Draw the image
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to high-quality JPEG for upload (backend will convert to AVIF)
        // Using JPEG here ensures compatibility and the backend handles final optimization
        let imageData = canvas.toDataURL('image/jpeg', quality);
        let currentQuality = quality;

        // Check file size and reduce quality if needed
        const checkSize = async (dataUrl: string): Promise<number> => {
          const base64 = dataUrl.split(',')[1];
          const bytes = atob(base64).length;
          return bytes;
        };

        let size = await checkSize(imageData);

        // Reduce quality if file is too large
        while (size > maxSize && currentQuality > 0.5) {
          currentQuality *= 0.9;
          imageData = canvas.toDataURL('image/jpeg', currentQuality);
          size = await checkSize(imageData);
        }

        if (size > maxSize) {
          reject(new Error(`Image size (${(size / 1024 / 1024).toFixed(2)}MB) exceeds maximum allowed size (${(maxSize / 1024 / 1024).toFixed(2)}MB)`));
          return;
        }

        resolve(imageData);
      };

      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };

      img.src = e.target?.result as string;
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Validate if a base64 image exceeds the size limit
 * @param base64Image - Base64 encoded image string
 * @param maxSizeMB - Maximum size in megabytes
 * @returns Object with isValid boolean and size in MB
 */
export function validateImageSize(base64Image: string, maxSizeMB: number = 5): { isValid: boolean; sizeMB: number } {
  if (!base64Image || !base64Image.startsWith('data:')) {
    return { isValid: true, sizeMB: 0 };
  }

  const base64Data = base64Image.split(',')[1];
  const bytes = atob(base64Data).length;
  const sizeMB = bytes / (1024 * 1024);

  return {
    isValid: sizeMB <= maxSizeMB,
    sizeMB: parseFloat(sizeMB.toFixed(2))
  };
}
