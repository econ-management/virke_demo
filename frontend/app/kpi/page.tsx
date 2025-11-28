import { cookies } from "next/headers";
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

export default async function KpiPage() {
  const cookieStore = await cookies();
  const orgnr = cookieStore.get("selectedOrgnr")?.value;

  if (!orgnr) {
    return (
      <div className={pageStyles.page}>
        <Header />
        <div className={pageStyles.content}>
          <Sidebar />
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

  let compData = null;
  if (brreg && brreg.length > 0 && brreg[0].naring1_kode) {
    try {
      compData = await getCompByNace(brreg[0].naring1_kode);
    } catch (error) {
      console.error('Error fetching comp data:', error);
    }
  }

  return (
    <div className={pageStyles.page}>
      <Header />

      <div className={pageStyles.content}>
        <Sidebar />

        <TwoColumnSection>
          {/* LEFT COLUMN */}
          <div>
            <KpiPageContent 
              kpiOptions={kpiOptionsList} 
              regnskap={regnskap || []}
              compData={compData}
            />
          </div>

          {/* RIGHT COLUMN */}
          <div></div>
        </TwoColumnSection>
      </div>

      <Footer />
    </div>
  );
}
