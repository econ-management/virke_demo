'use client';

import { KpiPageDataManager } from "./KpiPageDataManager";
import { KpiSelector } from "../../components/KpiSelector";
import { StatsBarChartAlternative } from "../../components/StatsBarChart/StatsBarChart_alternative";
import { StatBarText } from "../../components/StatBarText";
import { KpiDensityPlot } from "./KpiDensityPlot";
import { KpiLineChart } from "./KpiLineChart";
import { CompetitorSearchBox } from "../../components/CompetitorSearchBox";
import { CompanyLineChart } from "./CompanyLineChart";
import { KpiOption } from "../config/kpiOptions";

interface KpiAlternativePageClientProps {
  orgnr: string;
  nace: string | null;
  kpiOptions: KpiOption[];
  initialCompData: Record<string, any>;
  initialNaceDevData: Record<string, any>;
  mappedRegnskap: Array<{
    year: number;
    [key: string]: number | string;
  }>;
}

export const KpiAlternativePageClient = ({
  orgnr,
  nace,
  kpiOptions,
  initialCompData,
  initialNaceDevData,
  mappedRegnskap,
}: KpiAlternativePageClientProps) => {
  return (
    <KpiPageDataManager
      orgnr={orgnr}
      nace={nace}
      kpiOptions={kpiOptions}
      initialCompData={initialCompData}
      initialNaceDevData={initialNaceDevData}
    >
      {({ compData, naceDevData, selectedMetric, handleMetricChange, selectedCompanies, sammenligneSelskaper, handleCompanySelect, handleReset }) => {
        return (
          <>
            <div>
              <KpiSelector options={kpiOptions} onSelect={handleMetricChange} />
              <h1>{selectedMetric}</h1>
              <StatBarText selectedMetric={selectedMetric} compData={compData} regnskap={mappedRegnskap} />
              <StatsBarChartAlternative compData={compData} regnskap={mappedRegnskap} selectedMetric={selectedMetric} showText={false} />
              <h2>Fordeling av {selectedMetric} i din bransje i 2024</h2>
              <KpiDensityPlot compData={compData} regnskap={mappedRegnskap} metric={selectedMetric} showTitle={false} />
            </div>

            <div>
              <h2>Din utvikling i {selectedMetric} sammenlignet med bransjestandarden</h2>
              <KpiLineChart
                regnskap={mappedRegnskap}
                metric={selectedMetric}
                naceDevData={naceDevData}
              />
              <CompetitorSearchBox
                onCompanySelect={handleCompanySelect}
                onReset={handleReset}
              />
              <CompanyLineChart
                regnskap={mappedRegnskap}
                metric={selectedMetric}
                sammenligne_selskaper={sammenligneSelskaper}
                selectedCompanies={selectedCompanies}
              />
            </div>
          </>
        );
      }}
    </KpiPageDataManager>
  );
};
