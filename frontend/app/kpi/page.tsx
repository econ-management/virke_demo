import { Suspense } from "react";
import { cookies } from "next/headers";
import { Header } from "../../components/Header";
import { Sidebar } from "../../components/Sidebar";
import { TwoColumnSection } from "../../components/TwoColumnSection";
import { Footer } from "../../components/Footer";
import { TableSectionSkeleton } from "../../components/TableSectionSkeleton";
import { HistogramSectionSkeleton } from "../../components/HistogramSectionSkeleton";
import { KpiTableSection } from "../../lib/components/KpiTableSection";
import { KpiHistogramSection } from "../../lib/components/KpiHistogramSection";
import { KpiPageContent } from "../../lib/components/KpiPageContent";
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

  return (
    <div className={pageStyles.page}>
      <Header />

      <div className={pageStyles.content}>
        <Sidebar />

        <TwoColumnSection>
          {/* LEFT COLUMN */}
          <div>
            <KpiPageContent kpiOptions={kpiOptionsList}>
              <Suspense fallback={<TableSectionSkeleton />}>
                <KpiTableSection orgnr={orgnr} />
              </Suspense>

              <Suspense fallback={<HistogramSectionSkeleton />}>
                <KpiHistogramSection orgnr={orgnr} />
              </Suspense>
            </KpiPageContent>
          </div>

          {/* RIGHT COLUMN */}
          <div></div>
        </TwoColumnSection>
      </div>

      <Footer />
    </div>
  );
}
