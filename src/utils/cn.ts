import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Standard utility function for combining Tailwind CSS class names
 * cleanly without conflicts, widely adopted by shadcn/ui and modern frontend skills.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
