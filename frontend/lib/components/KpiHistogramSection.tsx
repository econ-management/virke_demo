import { getBrregDataOrgnr } from '../api/getBrregDataOrgnr';
import { getCompByNace } from '../api/getCompByNace';
import { getRegnskapOrgnr } from '../api/getRegnskapOrgnr';
import { Histogram } from '../../components/Histogram';

interface KpiHistogramSectionProps {
  orgnr: string;
}

export async function KpiHistogramSection({ orgnr }: KpiHistogramSectionProps) {
  const [brreg, regnskap] = await Promise.all([
    getBrregDataOrgnr(orgnr),
    getRegnskapOrgnr(orgnr)
  ]);

  if (!brreg || brreg.length === 0 || !brreg[0].naring1_kode) {
    return null;
  }

  const compData = await getCompByNace(brreg[0].naring1_kode);

  if (!compData?.driftsmargin?.hist || compData.driftsmargin.hist.length === 0) {
    return null;
  }

  const markerValue = regnskap?.find((item: any) => item.year === 2024)?.driftsmargin;

  return (
    <Histogram
      data={compData.driftsmargin.hist}
      title="Driftsmarginer 2024 i din bransje"
      xAxisFormat="percentage"
      markerValue={markerValue}
    />
  );
}

