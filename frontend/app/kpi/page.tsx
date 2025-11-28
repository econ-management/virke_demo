import { cookies } from "next/headers";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { TwoColumnSection } from "../../components/TwoColumnSection";
import { Footer } from "../../components/Footer";
import { Table } from "../../components/Table";
import { Histogram } from "../../components/Histogram";
import pageStyles from "../page.module.css";

import { getRegnskapOrgnr } from "../../lib/api/getRegnskapOrgnr";
import { getBrregDataOrgnr } from "../../lib/api/getBrregDataOrgnr";
import { getCompByNace } from "../../lib/api/getCompByNace";
export const dynamic = "force-dynamic";

export default async function KpiPage() {
  const cookieStore = await cookies();
  const orgnr = cookieStore.get("selectedOrgnr")?.value;

  let regnskap: any = null;
  let compData: any = null;
  let error = null;

  if (!orgnr) {
    error = "Ingen virksomhet valgt. Velg en virksomhet først.";
  } else {
    try {
      regnskap = await getRegnskapOrgnr(orgnr);
      const brreg = await getBrregDataOrgnr(orgnr);
      
      if (brreg && brreg.length > 0 && brreg[0].naring1_kode) {
        compData = await getCompByNace(brreg[0].naring1_kode);
      }
    } catch (err) {
      error = "Kunne ikke hente data. Backend svarer ikke.";
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
            <h1>KPI side</h1>

            {error ? (
              <p>{error}</p>
            ) : (
              <>
                {regnskap && regnskap.length > 0 ? (
                  <Table
                    columns={regnskap.map((item: any) => item.year.toString())}
                    values={[regnskap.map((item: any) => item.driftsmargin)]}
                    formats={regnskap.map(() => "percentage")}
                  />
                ) : (
                  <p>Ingen regnskapsdata tilgjengelig.</p>
                )}
                {compData?.driftsmargin?.hist && compData.driftsmargin.hist.length > 0 && (
                  <Histogram
                    data={compData.driftsmargin.hist}
                    title="Driftsmarginer 2024 i din bransje"
                    xAxisFormat="percentage"
                    markerValue={regnskap?.find((item: any) => item.year === 2024)?.driftsmargin}
                  />
                )}
              </>
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
