'use client';

import { useState, useEffect } from 'react';
import { KpiOption } from '@/lib/config/kpiOptions';
import { useKpiData } from '../context/useVekstData';
import { KpiSelector as KpiSelectorUI } from '@/components/KpiSelector';

interface Props {
  kpiOptions: KpiOption[];
}

export function KpiSelector({ kpiOptions }: Props) {
  const { setSelectedMetric } = useKpiData();

  const [selectedChip, setSelectedChip] = useState<string>(
    kpiOptions[0]?.label ?? ''
  );

  const [selectedMetric, setLocalSelectedMetric] = useState<string>(
    kpiOptions[0]?.metrics[0] ?? ''
  );

  // 🔁 Sync local selection → provider
  useEffect(() => {
    if (selectedMetric) {
      setSelectedMetric(selectedMetric);
    }
  }, [selectedMetric, setSelectedMetric]);

  const handleSelect = (label: string, metric?: string) => {
    setSelectedChip(label);
    if (metric) {
      setLocalSelectedMetric(metric);
    }
  };

  return (
    <KpiSelectorUI
      options={kpiOptions}
      onSelect={handleSelect}
    />
  );
}
