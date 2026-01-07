// app/kpi/page.tsx — SERVER COMPONENT
import { HeaderWrapper } from "@/components/HeaderWrapper";
import { Footer } from "@/components/Footer";

import { VekstPageLayout } from "@/lib/kpi_alternative/VekstPageLayout";
import { getKpiResult } from "@/logic/api/getKpiResult";
import { mapRegnskapToMapper } from "@/lib/utils/mapRegnskapToMapper";

interface PrognoserPageProps {
  searchParams: {
    orgnr?: string;
  };
}

export default async function VekstPage({ searchParams }: PrognoserPageProps) {
  const orgnr = searchParams.orgnr;
  if (!orgnr) {
    return (
      <div className="page">
        <HeaderWrapper />
        <div>Ingen virksomhet valgt.</div>
        <Footer />
      </div>
    );
  }

  const [sys1] = await Promise.all([
    getKpiResult(orgnr)
  ]);

  const regnskap = mapRegnskapToMapper(sys1.regnskap);
  const brreg = sys1.brreg;

  return (
    <div className="page">
      <HeaderWrapper />

      <VekstPageLayout
        orgnr={orgnr}
        regnskap={regnskap}
        brreg={brreg}
      />

      <Footer />
    </div>
  );
}
