import { getVariableName } from '../../lib/config/kpiOptionMapper';
import { metricFormatter } from '../../lib/config/metricFormatter';
import { statBarTexts } from '../../lib/config/statBarTexts';
import { formatter } from '../../lib/utils/formatter';
import { Dist } from '../../logic/api/getCompByNaceVar';

interface StatBarTextProps {
  selectedMetric: string | null;
  compData: {
    [key: string]: Dist;
  } | null;
  regnskap: Array<{
    year: number;
    [key: string]: number | string;
  }>;
}

export const StatBarText = ({ selectedMetric, compData, regnskap }: StatBarTextProps) => {
  if (!selectedMetric || !compData) return null;

  const distData = compData[selectedMetric];
  if (!statBarTexts[selectedMetric] || !distData?.stats) {
    return null;
  }

  const variableName = getVariableName(selectedMetric);
  if (!variableName) return null;

  const latestRegnskap = regnskap?.find((item: any) => item.year === 2024);
  const markerValue = latestRegnskap ? (latestRegnskap as any)[variableName] : undefined;

  if (markerValue === undefined || markerValue === null) {
    return null;
  }

  const template = statBarTexts[selectedMetric];
  const format = metricFormatter[selectedMetric] || 'numeric';
  const formattedMarker = formatter(markerValue, format);

  const parts = template.split('(value)');
  if (parts.length !== 2) return null;

  return (
    <p style={{ marginBottom: '20px', marginTop: '20px' }}>
      {parts[0]}
      <strong>{formattedMarker.string}</strong>
      {parts[1]}
    </p>
  );
};
