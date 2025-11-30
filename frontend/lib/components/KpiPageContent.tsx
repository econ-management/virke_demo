'use client';

import { useState, useEffect } from 'react';
import { KpiOption } from '../config/kpiOptions';
import { getVariableName } from '../config/kpiOptionMapper';
import { KpiSelector } from '../../components/KpiSelector';
import { KpiDensityPlot } from './KpiDensityPlot';
import { StatsBarChart } from '../../components/StatsBarChart';
import { Dist } from '../api/getCompByNaceVar';
import { metricFormatter } from '../config/metricFormatter';

interface KpiPageContentProps {
  kpiOptions: KpiOption[];
  regnskap: Array<{
    year: number;
    [key: string]: number | string;
  }>;
  compData: {
    [key: string]: Dist;
  } | null;
  naceDevData?: {
    [key: string]: Dist;
  } | null;
  onMetricChange?: (metric: string) => void;
}

export const KpiPageContent = ({ kpiOptions, regnskap, compData, naceDevData, onMetricChange }: KpiPageContentProps) => {
  const [selectedChip, setSelectedChip] = useState<string>(kpiOptions[0]?.label || '');
  const [selectedMetric, setSelectedMetric] = useState<string>(
    kpiOptions[0]?.metrics[0] || ''
  );

  useEffect(() => {
    if (onMetricChange && selectedMetric) {
      onMetricChange(selectedMetric);
    }
  }, [selectedMetric, onMetricChange]);

  const handleSelect = (selected: string, metric?: string) => {
    setSelectedChip(selected);
    
    if (metric) {
      setSelectedMetric(metric);
    }
  };

  const displayTitle = selectedMetric || selectedChip;

  const getStatsBarChart = () => {
    if (!selectedMetric || !compData) return null;
    
    const distData = (compData as any)[selectedMetric];
    if (!distData?.stats) return null;
    
    const variableName = getVariableName(selectedMetric);
    if (!variableName) return null;
    
    const latestRegnskap = regnskap?.find((item: any) => item.year === 2024);
    const markerValue = latestRegnskap ? (latestRegnskap as any)[variableName] : undefined;
    
    if (markerValue !== undefined && markerValue !== null) {
      return (
        <StatsBarChart
          min={distData.stats.min}
          median={distData.stats.median}
          mean={distData.stats.mean}
          max={distData.stats.max}
          markerValue={markerValue}
          format={metricFormatter[selectedMetric] || 'numeric'}
          metric={selectedMetric}
        />
      );
    }
    
    return null;
  };

  return (
    <>
      <KpiSelector options={kpiOptions} onSelect={handleSelect} />
      {displayTitle && <h1>{displayTitle}</h1>}
      {getStatsBarChart()}
      {selectedMetric && compData && (
        <KpiDensityPlot compData={compData} regnskap={regnskap} metric={selectedMetric} />
      )}
    </>
  );
};

