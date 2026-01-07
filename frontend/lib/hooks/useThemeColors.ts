'use client';

import { useEffect, useState } from 'react';

export function useThemeColors() {
  const [colors, setColors] = useState({
    rosa: '#c9007f',
    orange: '#f57f00',
    black: '#000',
    white: '#fff',
    baseRosa: '#f9cfe3',
  });

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    setColors({
      rosa: root.getPropertyValue('--color-signature-rosa').trim(),
      orange: root.getPropertyValue('--color-signature-orange').trim(),
      black: root.getPropertyValue('--color-text-black').trim(),
      white: root.getPropertyValue('--color-white').trim(),
      baseRosa: root.getPropertyValue('--color-base-rosa').trim(),
    });
  }, []);

  return colors;
}
