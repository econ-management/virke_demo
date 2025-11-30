import { Table } from '../../components/Table';
import { getVariableName } from '../config/kpiOptionMapper';
import { metricFormatter } from '../config/metricFormatter';

interface KpiTableProps {
  regnskap: Array<{
    year: number;
    [key: string]: number | string;
  }>;
  metric: string;
}

export const KpiTable = ({ regnskap, metric }: KpiTableProps) => {
  if (!regnskap || regnskap.length === 0) {
    return <p>Ingen regnskapsdata tilgjengelig.</p>;
  }

  const variableName = getVariableName(metric);
  const format = metricFormatter[metric] || 'numeric';

  const getMetricValue = (item: any): number => {
    if (!variableName) return 0;
    return item[variableName] || 0;
  };

  return (
    <Table
      columns={regnskap.map((item) => item.year.toString())}
      values={[regnskap.map((item) => getMetricValue(item))]}
      formats={regnskap.map(() => format)}
    />
  );
};

