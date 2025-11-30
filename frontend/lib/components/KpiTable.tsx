import { Table } from '../../components/Table';

interface KpiTableProps {
  regnskap: Array<{
    year: number;
    driftsmargin: number;
    omsetning: number;
  }>;
  metric: string;
}

export const KpiTable = ({ regnskap, metric }: KpiTableProps) => {
  if (!regnskap || regnskap.length === 0) {
    return <p>Ingen regnskapsdata tilgjengelig.</p>;
  }

  const getMetricValue = (item: any): number => {
    if (metric === 'Driftsmargin') {
      return item.driftsmargin;
    } else if (metric === 'Omsetning') {
      return item.omsetning;
    }
    return 0;
  };

  const getFormat = (): 'percentage' | 'monetary' | 'numeric' => {
    if (metric === 'Driftsmargin') {
      return 'percentage';
    } else if (metric === 'Omsetning') {
      return 'monetary';
    }
    return 'numeric';
  };

  const format = getFormat();

  return (
    <Table
      columns={regnskap.map((item) => item.year.toString())}
      values={[regnskap.map((item) => getMetricValue(item))]}
      formats={regnskap.map(() => format)}
    />
  );
};

