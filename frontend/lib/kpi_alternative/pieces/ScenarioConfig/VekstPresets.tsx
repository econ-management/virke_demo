'use client';

import styles from './VekstPresets.module.css';

interface VekstPresetsProps {
  onSelect: (presetKey: string) => void;
  activePreset: string | null;
}

const PRESETS = [
  { key: 'last5', label: 'Fortsette siste 5 års utvikling' },
  { key: 'last3', label: 'Fortsette siste 3 års utvikling' },
  { key: 'last1', label: 'Fortsette siste års utvikling' },
];

export function VekstPresets({ onSelect, activePreset }: VekstPresetsProps) {
  return (
    <div className={styles.container}>
      {PRESETS.map(preset => (
        <button
          key={preset.key}
          className={`${styles.button} ${activePreset === preset.key ? styles.active : ''}`}
          onClick={() => onSelect(preset.key)}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
