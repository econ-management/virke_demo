'use client';

import styles from './VekstSelector.module.css';

interface VekstSelectorProps {
  label: string;
  options: string[];
}

export const VekstSelector = ({ label, options }: VekstSelectorProps) => {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <div className={styles.options}>
        {options.map((option) => (
          <label key={option} className={styles.option}>
            <input type="checkbox" name="vekst" value={option.toLowerCase()} />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};
