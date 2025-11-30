'use client';

import { useState } from 'react';
import styles from './InterestSelection.module.css';

interface InterestSelectionProps {
  label: string;
  options: string[];
  otherLabel?: string;
  otherPlaceholder?: string;
}

export const InterestSelection = ({
  label,
  options,
  otherLabel = 'Annet',
  otherPlaceholder = 'Skriv inn annet',
}: InterestSelectionProps) => {
  const [showOther, setShowOther] = useState(false);

  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option} className={styles.option}>
            <input type="checkbox" name="interest" value={option.toLowerCase()} />
            {option}
          </label>
        ))}
        <label className={styles.option}>
          <input
            type="checkbox"
            name="interest"
            value="annet"
            checked={showOther}
            onChange={(e) => setShowOther(e.target.checked)}
          />
          {otherLabel}
        </label>
        {showOther && (
          <input
            type="text"
            className={styles.otherInput}
            placeholder={otherPlaceholder}
          />
        )}
      </div>
    </div>
  );
};

