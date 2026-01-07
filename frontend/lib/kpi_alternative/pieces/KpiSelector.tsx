'use client';

import { useState } from 'react';
import { KpiOption } from '@/lib/config/kpiOptions';
import { KpiSelector as KpiSelectorUI } from '@/components/KpiSelector';

interface Props {
  kpiOptions: KpiOption[];
}

export function KpiSelector({ kpiOptions }: Props) {
  const [selectedChip, setSelectedChip] = useState<string>(
    kpiOptions[0]?.label ?? ''
  );

  const handleSelect = (label: string, metric?: string) => {
    setSelectedChip(label);
  };

  return (
    <KpiSelectorUI
      options={kpiOptions}
      onSelect={handleSelect}
    />
  );
}
