import { Histogram } from '../../components/Histogram';
import { HistogramBin, Dist } from '../api/getCompByNace';

interface KpiHistogramProps {
  compData: {
    driftsmargin: Dist;
    omsetning: Dist;
  };
  regnskap: Array<{
    year: number;
    driftsmargin: number;
    omsetning: number;
  }>;
  metric: string;
}

export const KpiHistogram = ({ compData, regnskap, metric }: KpiHistogramProps) => {
  if (!compData) {
    return null;
  }

  const getHistogramData = (): HistogramBin[] | null => {
    if (metric === 'Driftsmargin' && compData.driftsmargin?.hist) {
      return compData.driftsmargin.hist;
    } else if (metric === 'Omsetning' && compData.omsetning?.hist) {
      return compData.omsetning.hist;
    }
    return null;
  };

  const getMarkerValue = (): number | undefined => {
    const latestRegnskap = regnskap?.find((item) => item.year === 2024);
    if (!latestRegnskap) {
      const latestAny = regnskap && regnskap.length > 0 
        ? regnskap.reduce((latest, current) => 
            current.year > latest.year ? current : latest
          )
        : null;
      if (!latestAny) return undefined;
      
      if (metric === 'Driftsmargin') {
        return latestAny.driftsmargin;
      } else if (metric === 'Omsetning') {
        return latestAny.omsetning;
      }
      return undefined;
    }

    if (metric === 'Driftsmargin') {
      return latestRegnskap.driftsmargin;
    } else if (metric === 'Omsetning') {
      return latestRegnskap.omsetning;
    }
    return undefined;
  };

  const histogramData = getHistogramData();
  if (!histogramData || histogramData.length === 0) {
    return null;
  }

  const xAxisFormat = metric === 'Driftsmargin' ? 'percentage' : 'numeric';
  const title = metric === 'Driftsmargin' 
    ? 'Driftsmarginer 2024 i din bransje'
    : 'Omsetning 2024 i din bransje';

  return (
    <Histogram
      data={histogramData}
      title={title}
      xAxisFormat={xAxisFormat}
      markerValue={getMarkerValue()}
    />
  );
};

