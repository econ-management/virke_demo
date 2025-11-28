'use client';

import { useState } from 'react';
import styles from './KpiSelector.module.css';

interface KpiSelectorProps {
  options: string[];
  onSelect?: (selected: string) => void;
}

export const KpiSelector = ({ options, onSelect }: KpiSelectorProps) => {
  const [selected, setSelected] = useState<string>(options[0] || '');

  const handleSelect = (option: string) => {
    setSelected(option);
    onSelect?.(option);
  };

  return (
    <div className={styles.container}>
      {options.map((option) => (
        <button
          key={option}
          className={`${styles.chip} ${selected === option ? styles.selected : ''}`}
          onClick={() => handleSelect(option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  );
};

