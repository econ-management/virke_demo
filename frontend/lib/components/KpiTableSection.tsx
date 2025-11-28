import { getRegnskapOrgnr } from '../api/getRegnskapOrgnr';
import { Table } from '../../components/Table';

interface KpiTableSectionProps {
  orgnr: string;
}

export async function KpiTableSection({ orgnr }: KpiTableSectionProps) {
  const regnskap = await getRegnskapOrgnr(orgnr);

  if (!regnskap || regnskap.length === 0) {
    return <p>Ingen regnskapsdata tilgjengelig.</p>;
  }

  return (
    <Table
      columns={regnskap.map((item: any) => item.year.toString())}
      values={[regnskap.map((item: any) => item.driftsmargin)]}
      formats={regnskap.map(() => "percentage")}
    />
  );
}

