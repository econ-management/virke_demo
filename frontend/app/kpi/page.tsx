import { Suspense } from "react";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { TwoColumnSection } from "../../components/TwoColumnSection";
import { Footer } from "../../components/Footer";
import { KpiPageContent } from "../../lib/components/KpiPageContent";
import { getRegnskapOrgnr } from "../../lib/api/getRegnskapOrgnr";
import { getBrregDataOrgnr } from "../../lib/api/getBrregDataOrgnr";
import { getCompByNace } from "../../lib/api/getCompByNace";
import { kpiOptionsList } from "../../lib/config/kpiOptions";
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
        <Header />
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

  const [regnskap, brreg] = await Promise.all([
    getRegnskapOrgnr(orgnr),
    getBrregDataOrgnr(orgnr)
  ]);

  const nace = brreg && brreg.length > 0 && brreg[0].naring1_kode ? brreg[0].naring1_kode : null;

  return (
    <div className={pageStyles.page}>
      <Header />

      <div className={pageStyles.content}>
        <Sidebar orgnr={orgnr} />

        <TwoColumnSection>
          {/* LEFT COLUMN */}
          <div>
            {nace ? (
              <Suspense fallback={
                <KpiPageContent 
                  kpiOptions={kpiOptionsList} 
                  regnskap={regnskap || []}
                  compData={null}
                />
              }>
                <CompDataWrapper nace={nace} regnskap={regnskap || []} />
              </Suspense>
            ) : (
              <KpiPageContent 
                kpiOptions={kpiOptionsList} 
                regnskap={regnskap || []}
                compData={null}
              />
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div></div>
        </TwoColumnSection>
      </div>

      <Footer />
    </div>
  );
}

async function CompDataWrapper({ nace, regnskap }: { nace: string; regnskap: any[] }) {
  const compData = await getCompByNace(nace);
  return (
    <KpiPageContent 
      kpiOptions={kpiOptionsList} 
      regnskap={regnskap}
      compData={compData}
    />
  );
}
