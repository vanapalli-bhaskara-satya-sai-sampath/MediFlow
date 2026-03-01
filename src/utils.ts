import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getLocalStorage = <T,>(key: string, defaultValue: T): T => {
  const stored = localStorage.getItem(key);
  if (!stored) return defaultValue;
  
  // If we have an empty array stored but the default value has items, 
  // it's likely the user needs the seed data to be initialized.
  if (Array.isArray(defaultValue) && defaultValue.length > 0 && stored === '[]') {
    return defaultValue;
  }

  try {
    return JSON.parse(stored) as T;
  } catch {
    return defaultValue;
  }
};

export const setLocalStorage = <T,>(key: string, value: T): void => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const generateId = () => Math.random().toString(36).substr(2, 9).toUpperCase();
