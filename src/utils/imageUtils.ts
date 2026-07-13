/**
 * Helper function to resolve image URLs
 * Prioritizes local images over external URLs
 */

interface ImageSource {
  url?: string;
  image?: string;
  photo?: string;
  localImage?: string;
  localPhoto?: string;
}

const API_URL = import.meta.env.VITE_API_URL || '';

function resolveUrl(path: string): string {
  if (!API_URL || path.startsWith('http')) return path;
  return `${API_URL}${path}`;
}

/**
 * Returns the best available image URL for an item
 * Priority: localImage/localPhoto > url/image/photo
 */
export function getImageUrl(item: ImageSource): string | null {
  if (item.localImage && item.localImage.trim() !== '') {
    return resolveUrl(item.localImage);
  }
  if (item.localPhoto && item.localPhoto.trim() !== '') {
    return resolveUrl(item.localPhoto);
  }

  if (item.url && item.url.trim() !== '') {
    return resolveUrl(item.url);
  }
  if (item.image && item.image.trim() !== '') {
    return resolveUrl(item.image);
  }
  if (item.photo && item.photo.trim() !== '') {
    return resolveUrl(item.photo);
  }

  return null;
}

/**
 * Returns the image URL with fallback to a placeholder
 */
export function getImageUrlWithFallback(
  item: ImageSource,
  fallbackUrl: string = 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80'
): string {
  return getImageUrl(item) || fallbackUrl;
}

/**
 * Checks if an image URL is a local upload
 */
export function isLocalImage(url: string | null | undefined): boolean {
  if (!url) return false;
  const resolved = resolveUrl(url);
  return resolved.includes('/uploads/');
}
