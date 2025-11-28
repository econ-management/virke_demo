'use client';

import { useState, useEffect, useRef } from 'react';
import { KpiOption } from '../lib/config/kpiOptions';
import styles from './KpiSelector.module.css';

interface KpiSelectorProps {
  options: KpiOption[];
  onSelect?: (selected: string, metric?: string) => void;
}

export const KpiSelector = ({ options, onSelect }: KpiSelectorProps) => {
  const [selected, setSelected] = useState<string>(options[0]?.label || '');
  const [selectedMetric, setSelectedMetric] = useState<string>('');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChipClick = (optionLabel: string) => {
    const option = options.find(opt => opt.label === optionLabel);
    if (openDropdown === optionLabel) {
      setOpenDropdown(null);
    } else {
      setSelected(optionLabel);
      setOpenDropdown(option?.metrics && option.metrics.length > 0 ? optionLabel : null);
      onSelect?.(optionLabel);
    }
  };

  const handleMetricSelect = (metric: string) => {
    setSelectedMetric(metric);
    setOpenDropdown(null);
    onSelect?.(selected, metric);
  };

  return (
    <div ref={containerRef} className={styles.container}>
      {options.map((option) => {
        const isSelected = selected === option.label;
        const isOpen = openDropdown === option.label;
        const hasMetrics = option.metrics && option.metrics.length > 0;

        return (
          <div key={option.label} className={styles.chipWrapper}>
            <button
              className={`${styles.chip} ${isSelected ? styles.selected : ''}`}
              onClick={() => handleChipClick(option.label)}
              type="button"
            >
              {option.label}
            </button>
            {isOpen && hasMetrics && (
              <ul className={styles.dropdown}>
                {option.metrics.map((metric) => (
                  <li
                    key={metric}
                    className={`${styles.dropdownItem} ${selectedMetric === metric ? styles.selectedItem : ''}`}
                    onClick={() => handleMetricSelect(metric)}
                  >
                    {metric}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
};

