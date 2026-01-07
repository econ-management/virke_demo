// app/kpi/page.tsx
import { HeaderWrapper } from "../../components/HeaderWrapper";
import { Sidebar } from "../../components/Sidebar";
import { TwoColumnSection } from "../../components/TwoColumnSection";
import { Footer } from "../../components/Footer";

import { KpiPageClientWrapper } from "../../lib/components/KpiPageClientWrapper";
import { getKpiResult } from "../../logic/api/getKpiResult";
import { getKpiResult2 } from "../../logic/api/getKpiResult2";
import { kpiOptionsList } from "../../lib/config/kpiOptions";
import { orgnrRegnskapMapper } from "../../lib/utils/orgnrRegnskapMapper";

import pageStyles from "@/styles/sidebar_plus_main.module.css";

export const dynamic = "force-dynamic";

interface KpiPageProps {
  searchParams: {
    orgnr?: string;
  };
}

export default async function KpiPage({ searchParams }: KpiPageProps) {
  
  const orgnr = searchParams.orgnr;

  // --------------------------
  // 1. No orgnr → simple empty state
  // --------------------------
  if (!orgnr) {
    return (
      <div className={`${pageStyles.page} ${pageStyles.contentStackUntilDesktop}`}>
        <HeaderWrapper />
        <div className={pageStyles.content}>
          <Sidebar />
          <TwoColumnSection stackUntilDesktop={true}>
            <div>
              <h1>KPI side</h1>
              <p>Ingen virksomhet valgt. Velg en virksomhet først.</p>
            </div>
            <div />
          </TwoColumnSection>
        </div>
        <Footer />
      </div>
    );
  }

  // --------------------------
  // 2. Fetch initial data in parallel:
  //    - Company-specific (regnskap + brreg)
  //    - Default KPI comparison (Driftsmargin)
  // --------------------------
  const [kpiBase, kpiCompare] = await Promise.all([
    getKpiResult(orgnr),
    getKpiResult2(orgnr, "Driftsmargin"),   // <-- ONLY FIX NEEDED
  ]);

  const regnskap = kpiBase?.regnskap || [];
  console.log("SERVER RAW regnskap:", regnskap);
  const brreg = kpiBase?.brreg || [];

  const mappedRegnskap = orgnrRegnskapMapper(regnskap);
  console.log("SERVER MAPPED regnskap:", mappedRegnskap);
  const nace = brreg?.[0]?.naring1_kode || null;

  const initialCompData = kpiCompare?.comp_by_nace_var || {};
  const initialNaceDevData = kpiCompare?.nace_dev_var || {};




  // --------------------------
  // 3. Render page with initial data
  // --------------------------
  return (
    <div className={`${pageStyles.page} ${pageStyles.contentStackUntilDesktop}`}>
      <HeaderWrapper />

      <div className={pageStyles.content}>
        <Sidebar orgnr={orgnr} brreg={brreg} regnskap={mappedRegnskap} />

        <TwoColumnSection stackUntilDesktop={true}>
          <KpiPageClientWrapper
            orgnr={orgnr}
            regnskap={mappedRegnskap}
            nace={nace}
            kpiOptions={kpiOptionsList}
            initialCompData={initialCompData}
            initialNaceDevData={initialNaceDevData}
          />
        </TwoColumnSection>
      </div>

      <Footer />
    </div>
  );
}
