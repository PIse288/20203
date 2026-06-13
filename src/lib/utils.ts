import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** 合并 Tailwind 类名，支持条件判断
 * @example cn('p-4', condition && 'bg-primary') */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
