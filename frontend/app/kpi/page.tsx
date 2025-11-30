import { Suspense } from "react";
import { HeaderWrapper } from "../../components/HeaderWrapper";
import { Sidebar } from "../../components/Sidebar";
import { TwoColumnSection } from "../../components/TwoColumnSection";
import { Footer } from "../../components/Footer";
import { KpiPageClientWrapper } from "../../lib/components/KpiPageClientWrapper";
import { getKpiResult } from "../../lib/api/getKpiResult";
import { getKpiResult2 } from "../../lib/api/getKpiResult2";
import { kpiOptionsList } from "../../lib/config/kpiOptions";
import { mapRegnskapToMapper } from "../../lib/utils/mapRegnskapToMapper";
import pageStyles from "../page.module.css";

export const dynamic = "force-dynamic";

interface KpiPageProps {
  searchParams: {
    orgnr?: string;
  };
}

export default async function KpiPage({ searchParams }: KpiPageProps) {
  const orgnr = searchParams.orgnr;

  if (!orgnr) {
    return (
      <div className={pageStyles.page}>
        <HeaderWrapper />
        <div className={pageStyles.content}>
          <Sidebar orgnr={orgnr} />
          <TwoColumnSection>
            <div>
              <h1>KPI side</h1>
              <p>Ingen virksomhet valgt. Velg en virksomhet først.</p>
            </div>
            <div></div>
          </TwoColumnSection>
        </div>
        <Footer />
      </div>
    );
  }

  const { regnskap, brreg } = await getKpiResult(orgnr);
  
  const mappedRegnskap = mapRegnskapToMapper(regnskap || []);
  
  const nace = brreg && brreg.length > 0 && brreg[0].naring1_kode ? brreg[0].naring1_kode : null;

  return (
    <div className={pageStyles.page}>
      <HeaderWrapper />

      <div className={pageStyles.content}>
        <Sidebar orgnr={orgnr} brreg={brreg} regnskap={mappedRegnskap} />

        <TwoColumnSection>
          {nace ? (
            <Suspense fallback={
              <KpiPageClientWrapper 
                kpiOptions={kpiOptionsList} 
                regnskap={mappedRegnskap}
                compData={null}
                naceDevData={null}
                nace={nace}
              />
            }>
              <CompDataWrapper nace={nace} regnskap={mappedRegnskap} orgnr={orgnr} />
            </Suspense>
          ) : (
            <KpiPageClientWrapper 
              kpiOptions={kpiOptionsList} 
              regnskap={mappedRegnskap}
              compData={null}
              naceDevData={null}
              nace={null}
            />
          )}
        </TwoColumnSection>
      </div>

      <Footer />
    </div>
  );
}

async function CompDataWrapper({ nace, regnskap, orgnr }: { nace: string; regnskap: any[]; orgnr: string }) {
  const kpiResult2 = await getKpiResult2(orgnr);
  
  const data_comp_by_nace_var = kpiResult2?.comp_by_nace_var || {};
  const data_nace_dev_var = kpiResult2?.nace_dev_var || {};
  
  return (
    <KpiPageClientWrapper 
      kpiOptions={kpiOptionsList} 
      regnskap={regnskap}
      compData={data_comp_by_nace_var}
      naceDevData={data_nace_dev_var}
      nace={nace}
    />
  );
}
