import React, { useState, useEffect } from 'react';
import { getLocalStorage, setLocalStorage } from '../utils';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => getLocalStorage(key, initialValue));

  useEffect(() => {
    setLocalStorage(key, state);
  }, [key, state]);

  return [state, setState] as const;
}
