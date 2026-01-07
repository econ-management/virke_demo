'use client';

import { useEffect, useState, useRef, createContext, useContext } from "react";
import { getKpiResult2 } from "../../logic/api/getKpiResult2";
import { getRegnskapOrgnr } from "../../logic/api/getRegnskapOrgnr";

import { KpiSelector } from "../../components/KpiSelector";
import { StatsBarChartAlternative } from "../../components/StatsBarChart/StatsBarChart_alternative";
import { StatBarText } from "../../components/StatBarText";
import { KpiDensityPlot } from "./KpiDensityPlot";
import { KpiLineChart } from "./KpiLineChart";
import { CompetitorSearchBox } from "../../components/CompetitorSearchBox";
import { CompanyLineChart } from "./CompanyLineChart";

import { KpiOption } from "../config/kpiOptions";

interface KpiPagePieces {
  kpiSelector: React.ReactNode;
  title: React.ReactNode;
  statBarText: React.ReactNode;
  statBarChart: React.ReactNode;
  densityPlotTitle: React.ReactNode;
  densityPlot: React.ReactNode;
  lineChartTitle: React.ReactNode;
  lineChart: React.ReactNode;
  competitorSearch: React.ReactNode;
  companyLineChart: React.ReactNode;
}

const KpiPagePiecesContext = createContext<KpiPagePieces | null>(null);

export const useKpiPagePieces = () => {
  const pieces = useContext(KpiPagePiecesContext);
  if (!pieces) {
    throw new Error('useKpiPagePieces must be used within KpiPageClientWrapperAlternative');
  }
  return pieces;
};

interface KpiPageClientWrapperAlternativeProps {
  orgnr: string;
  regnskap: Array<{
    year: number;
    [key: string]: number | string;
  }>;
  nace: string | null;
  kpiOptions: KpiOption[];
  initialCompData: Record<string, any>;
  initialNaceDevData: Record<string, any>;
  children: React.ReactNode;
}

export function KpiPageClientWrapperAlternative({
  orgnr,
  regnskap,
  nace,
  kpiOptions,
  initialCompData,
  initialNaceDevData,
  children,
}: KpiPageClientWrapperAlternativeProps) {
  const [compData, setCompData] = useState({ ...initialCompData });
  const [naceDevData, setNaceDevData] = useState({ ...initialNaceDevData });
  const [selectedChip, setSelectedChip] = useState<string>(kpiOptions[0]?.label || '');
  const [selectedMetric, setSelectedMetric] = useState<string>(
    kpiOptions[0]?.metrics[0] || ''
  );
  const [selectedCompanies, setSelectedCompanies] = useState<Array<{ orgnr: number; navn: string }>>([]);
  const [sammenligneSelskaper, setSammenligneSelskaper] = useState<{
    [index: number]: Array<{
      orgnr: number;
      year: number;
      [key: string]: number | string;
    }>;
  }>({});
  const loadedMetricsRef = useRef<Set<string>>(new Set(Object.keys(initialCompData)));

  useEffect(() => {
    if (!nace) return;

    let cancelled = false;
    const allMetrics: string[] = kpiOptions.flatMap(opt => opt.metrics);

    async function loadSequentially() {
      for (const metric of allMetrics) {
        if (cancelled) return;

        if (loadedMetricsRef.current.has(metric)) {
          continue;
        }

        try {
          const result = await getKpiResult2(orgnr, metric);
          if (cancelled) return;

          loadedMetricsRef.current.add(metric);

          setCompData(prev => {
            if (prev[metric]) {
              return prev;
            }
            return {
              ...prev,
              [metric]: result.comp_by_nace_var[metric],
            };
          });

          setNaceDevData(prev => ({
            ...prev,
            [metric]: result.nace_dev_var[metric],
          }));
        } catch (err) {
          console.error(`Failed fetching KPI ${metric}`, err);
        }
      }
    }

    loadSequentially();
    return () => { cancelled = true; };
  }, [orgnr, nace, kpiOptions]);

  const handleMetricChange = (selected: string, metric?: string) => {
    setSelectedChip(selected);
    if (metric) {
      setSelectedMetric(metric);
    }
  };

  const handleCompanySelect = async (company: { orgnr: number; navn: string } | null) => {
    if (!company) return;

    setSelectedCompanies((prev) => {
      const newList = [...prev, company];
      let finalList: Array<{ orgnr: number; navn: string }>;
      let newIndex: number;
      let shouldShift = false;

      if (newList.length > 5) {
        finalList = newList.slice(1);
        newIndex = 4;
        shouldShift = true;
      } else {
        finalList = newList;
        newIndex = finalList.length - 1;
      }

      if (shouldShift) {
        setSammenligneSelskaper((prevData) => {
          const newData: { [index: number]: Array<{ orgnr: number; year: number; [key: string]: number | string }> } = {};
          for (let idx = 0; idx < 4; idx++) {
            if (prevData[idx + 1]) {
              newData[idx] = prevData[idx + 1];
            }
          }
          return newData;
        });
      }

      getRegnskapOrgnr(company.orgnr.toString())
        .then((regnskapData) => {
          setSammenligneSelskaper((prevData) => ({
            ...prevData,
            [newIndex]: regnskapData,
          }));
        })
        .catch((error) => {
          console.error('Error fetching regnskap:', error);
        });

      return finalList;
    });
  };

  const handleReset = () => {
    setSelectedCompanies([]);
    setSammenligneSelskaper({});
  };

  const pieces: KpiPagePieces = {
    kpiSelector: <KpiSelector options={kpiOptions} onSelect={handleMetricChange} />,
    title: <h1>{selectedMetric}</h1>,
    statBarText: <StatBarText selectedMetric={selectedMetric} compData={compData} regnskap={regnskap} />,
    statBarChart: <StatsBarChartAlternative compData={compData} regnskap={regnskap} selectedMetric={selectedMetric} showText={false} />,
    densityPlotTitle: <h2>Fordeling av {selectedMetric} i din bransje i 2024</h2>,
    densityPlot: <KpiDensityPlot compData={compData} regnskap={regnskap} metric={selectedMetric} showTitle={false} />,
    lineChartTitle: <h2>Din utvikling i {selectedMetric} sammenlignet med bransjestandarden</h2>,
    lineChart: <KpiLineChart regnskap={regnskap} metric={selectedMetric} naceDevData={naceDevData} />,
    competitorSearch: <CompetitorSearchBox onCompanySelect={handleCompanySelect} onReset={handleReset} />,
    companyLineChart: <CompanyLineChart regnskap={regnskap} metric={selectedMetric} sammenligne_selskaper={sammenligneSelskaper} selectedCompanies={selectedCompanies} />,
  };

  return (
    <KpiPagePiecesContext.Provider value={pieces}>
      {children}
    </KpiPagePiecesContext.Provider>
  );
}
