'use client';

import { useState, useEffect } from 'react';
import { KpiOption } from '../config/kpiOptions';
import { KpiSelector } from '../../components/KpiSelector';
import { KpiTable } from './KpiTable';
import { KpiHistogram } from './KpiHistogram';
import { StatsBarChart } from '../../components/StatsBarChart';
import { HistogramBin, Dist } from '../api/getCompByNace';

interface KpiPageContentProps {
  kpiOptions: KpiOption[];
  regnskap: Array<{
    year: number;
    driftsmargin: number;
    omsetning: number;
  }>;
  compData: {
    driftsmargin: Dist;
    omsetning: Dist;
  } | null;
}

export const KpiPageContent = ({ kpiOptions, regnskap, compData }: KpiPageContentProps) => {
  const [selectedChip, setSelectedChip] = useState<string>(kpiOptions[0]?.label || '');
  const [selectedMetric, setSelectedMetric] = useState<string>(
    kpiOptions[0]?.metrics[0] || ''
  );

  const handleSelect = (selected: string, metric?: string) => {
    setSelectedChip(selected);
    
    if (metric) {
      setSelectedMetric(metric);
    }
  };

  const displayTitle = selectedMetric || selectedChip;

  const getStatsBarChart = () => {
    if (!selectedMetric || !compData) return null;
    
    const latestRegnskap = regnskap?.find((item: any) => item.year === 2024);
    
    if (selectedMetric === 'Driftsmargin' && compData.driftsmargin?.stats) {
      const markerValue = latestRegnskap?.driftsmargin;
      
      if (markerValue !== undefined && markerValue !== null) {
        return (
          <StatsBarChart
            min={compData.driftsmargin.stats.min}
            median={compData.driftsmargin.stats.median}
            mean={compData.driftsmargin.stats.mean}
            max={compData.driftsmargin.stats.max}
            markerValue={markerValue}
            format="percentage"
          />
        );
      }
    }
    
    if (selectedMetric === 'Omsetning' && compData.omsetning?.stats) {
      const markerValue = latestRegnskap?.omsetning;
      
      if (markerValue !== undefined && markerValue !== null) {
        return (
          <StatsBarChart
            min={compData.omsetning.stats.min}
            median={compData.omsetning.stats.median}
            mean={compData.omsetning.stats.mean}
            max={compData.omsetning.stats.max}
            markerValue={markerValue}
            format="numeric"
          />
        );
      }
    }
    
    return null;
  };

  return (
    <>
      <KpiSelector options={kpiOptions} onSelect={handleSelect} />
      {displayTitle && <h1>{displayTitle}</h1>}
      {selectedMetric && <KpiTable regnskap={regnskap} metric={selectedMetric} />}
      {getStatsBarChart()}
      {selectedMetric && compData && (
        <KpiHistogram compData={compData} regnskap={regnskap} metric={selectedMetric} />
      )}
    </>
  );
};

