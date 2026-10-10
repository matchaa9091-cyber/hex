import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const R2_PUBLIC_BASE = "https://pub-aa01e6dca81f482ab084275e93025a99.r2.dev";

export function getMediaUrl(url: string | null | undefined): string {
  if (!url) return '/placeholder.svg';
  
  // Route storage paths directly to Cloudflare R2 CDN (zero egress fees, no bandwidth limits)
  if (url.startsWith('/storage/')) return `${R2_PUBLIC_BASE}${url}`;
  if (url.startsWith('/profile-images/')) return `${R2_PUBLIC_BASE}/storage${url}`;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return url;

  return url;
}
