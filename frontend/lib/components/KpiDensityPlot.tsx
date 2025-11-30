import { DensityPlot } from '../../components/DensityPlot';
import { Dist } from '../api/getCompByNaceVar';
import { metricFormatter } from '../config/metricFormatter';
import { getVariableName } from '../config/kpiOptionMapper';

interface KpiDensityPlotProps {
  compData: {
    [key: string]: Dist;
  };
  regnskap: Array<{
    year: number;
    [key: string]: number | string;
  }>;
  metric: string;
}

export const KpiDensityPlot = ({ compData, regnskap, metric }: KpiDensityPlotProps) => {
  if (!compData) {
    return null;
  }

  const getDensityData = (): Array<{x: number; density: number}> | null => {
    const distData = (compData as any)[metric];
    if (distData?.density?.density) {
      return distData.density.density;
    }
    return null;
  };

  const getMarkerValue = (): number | undefined => {
    const variableName = getVariableName(metric);
    if (!variableName) return undefined;
    
    const latestRegnskap = regnskap?.find((item: any) => item.year === 2024);
    const markerValue = latestRegnskap ? (latestRegnskap as any)[variableName] : undefined;
    
    return markerValue;
  };

  const densityData = getDensityData();
  if (!densityData || densityData.length === 0) {
    return null;
  }

  const xAxisFormat = metricFormatter[metric] || 'numeric';
  const title = `Fordeling av ${metric} i din bransje i 2024`;

  return (
    <DensityPlot
      data={densityData}
      title={title}
      xAxisFormat={xAxisFormat}
      markerValue={getMarkerValue()}
    />
  );
};

