'use client';

import { useState, useEffect } from 'react';
import { KpiOption } from '../config/kpiOptions';
import { KpiSelector } from '../../components/KpiSelector';

interface KpiPageContentProps {
  kpiOptions: KpiOption[];
  children: React.ReactNode;
}

export const KpiPageContent = ({ kpiOptions, children }: KpiPageContentProps) => {
  const [selectedChip, setSelectedChip] = useState<string>(kpiOptions[0]?.label || '');

  useEffect(() => {
    if (kpiOptions.length > 0 && !selectedChip) {
      setSelectedChip(kpiOptions[0].label);
    }
  }, [kpiOptions, selectedChip]);

  const handleSelect = (selected: string) => {
    setSelectedChip(selected);
  };

  return (
    <>
      <KpiSelector options={kpiOptions} onSelect={handleSelect} />
      {selectedChip && <h1>{selectedChip}</h1>}
      {children}
    </>
  );
};

