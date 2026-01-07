'use client';

import { useContext } from 'react';
import { VekstDataContext } from './VekstDataContext';

export function useVekstData() {
  const ctx = useContext(VekstDataContext);

  if (!ctx) {
    throw new Error('useVekstData must be used within VekstClientProvider');
  }

  return ctx;
}
