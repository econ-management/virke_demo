import { getRegnskapOrgnr } from '../api/getRegnskapOrgnr';
import { Table } from '../../components/Table';
import { getVariableName } from '../config/kpiOptionMapper';
import { metricFormatter } from '../config/metricFormatter';

interface KpiTableSectionProps {
  orgnr: string;
  metric: string;
}

export async function KpiTableSection({ orgnr, metric }: KpiTableSectionProps) {
  const regnskap = await getRegnskapOrgnr(orgnr);

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
      columns={regnskap.map((item: any) => item.year.toString())}
      values={[regnskap.map((item: any) => getMetricValue(item))]}
      formats={regnskap.map(() => format)}
    />
  );
}

