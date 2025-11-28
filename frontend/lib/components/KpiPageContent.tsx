'use client';

import { useState, useEffect } from 'react';
import { KpiOption } from '../config/kpiOptions';
import { KpiSelector } from '../../components/KpiSelector';
import { KpiTable } from './KpiTable';
import { KpiHistogram } from './KpiHistogram';
import { HistogramBin } from '../api/getCompByNace';

interface KpiPageContentProps {
  kpiOptions: KpiOption[];
  regnskap: Array<{
    year: number;
    driftsmargin: number;
    omsetning: number;
  }>;
  compData: {
    driftsmargin: { hist: HistogramBin[] };
    omsetning: { hist: HistogramBin[] };
  } | null;
}

export const KpiPageContent = ({ kpiOptions, regnskap, compData }: KpiPageContentProps) => {
  const [selectedChip, setSelectedChip] = useState<string>(kpiOptions[0]?.label || '');
  const [selectedMetric, setSelectedMetric] = useState<string>('');

  useEffect(() => {
    if (kpiOptions.length > 0 && !selectedChip) {
      const firstOption = kpiOptions[0];
      setSelectedChip(firstOption.label);
      if (firstOption.metrics.length > 0) {
        setSelectedMetric(firstOption.metrics[0]);
      }
    }
  }, [kpiOptions, selectedChip]);

  const handleSelect = (selected: string, metric?: string) => {
    setSelectedChip(selected);
    setSelectedMetric(metric || '');
  };

  const displayTitle = selectedMetric || selectedChip;

  return (
    <>
      <KpiSelector options={kpiOptions} onSelect={handleSelect} />
      {displayTitle && <h1>{displayTitle}</h1>}
      {selectedMetric && <KpiTable regnskap={regnskap} metric={selectedMetric} />}
      {selectedMetric && compData && (
        <KpiHistogram compData={compData} regnskap={regnskap} metric={selectedMetric} />
      )}
    </>
  );
};

