import { StatBarText } from '@/components/StatBarText';

export function StatBarTextPiece({ metric, compData, regnskap }) {
  return (
    <StatBarText
      selectedMetric={metric}
      compData={compData}
      regnskap={regnskap}
    />
  );
}
