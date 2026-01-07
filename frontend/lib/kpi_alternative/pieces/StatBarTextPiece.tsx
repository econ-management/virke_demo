import { StatBarText } from '@/components/StatBarText';
import { Dist } from '@/logic/api/getCompByNaceVar';

interface StatBarTextPieceProps {
  metric: string | null;
  compData: {
    [key: string]: Dist;
  } | null;
  regnskap: Array<{
    year: number;
    [key: string]: number | string;
  }>;
}

export function StatBarTextPiece({ metric, compData, regnskap }: StatBarTextPieceProps) {
  return (
    <StatBarText
      selectedMetric={metric}
      compData={compData}
      regnskap={regnskap}
    />
  );
}
