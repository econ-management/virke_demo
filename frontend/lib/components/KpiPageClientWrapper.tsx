
'use client';

import { useEffect, useState, useRef } from "react";
import { getKpiResult2 } from "../../logic/api/getKpiResult2";

import { KpiPageContent } from "./KpiPageContent";
import { KpiLineChart } from "./KpiLineChart";
import { CompetitorComparison } from "./CompetitorComparison";

import { KpiOption } from "../config/kpiOptions";
import { Dist } from "../../logic/api/getCompByNaceVar";

interface Props {
  orgnr: string;
  regnskap: any[];
  nace: string | null;
  kpiOptions: KpiOption[];
  initialCompData: Record<string, any>;
  initialNaceDevData: Record<string, any>;
}

export function KpiPageClientWrapper({
  orgnr,
  regnskap,
  nace,
  kpiOptions,
  initialCompData,
  initialNaceDevData,
}: Props) {


  console.log("CLIENT regnskap:", regnskap);
  // -----------------------------
  // STATE
  // -----------------------------
  const [compData, setCompData] = useState({ ...initialCompData });
  const [naceDevData, setNaceDevData] = useState({ ...initialNaceDevData });
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [loadingLabel, setLoadingLabel] = useState<string | null>(null);


  // avoid repeated sequential loading
  const loadingRef = useRef(false);

  // -----------------------------
  // SEQUENTIAL KPI LOADING
  // -----------------------------
  useEffect(() => {
    if (!nace) return;
  
    let cancelled = false;
  
    // Flatten the KPI metrics (NOT the option labels)
    const allMetrics: string[] = kpiOptions.flatMap(opt => opt.metrics);
  
    async function loadSequentially() {
      for (const metric of allMetrics) {
  
        // Skip metrics already loaded (including Driftsmargin)
        if (compData[metric]) continue;
  
        if (cancelled) return;
  
        setLoadingLabel(metric);
  
        try {
          const result = await getKpiResult2(orgnr, metric);
  
          if (cancelled) return;
  
          setCompData(prev => ({
            ...prev,
            [metric]: result.comp_by_nace_var[metric],
          }));
  
          setNaceDevData(prev => ({
            ...prev,
            [metric]: result.nace_dev_var[metric],
          }));
  
        } catch (err) {
          console.error(`Failed fetching KPI ${metric}`, err);
        }
      }
  
      setLoadingLabel(null);
    }
  
    loadSequentially();
  
    return () => { cancelled = true; };
  }, [orgnr, nace]);
  


  // -----------------------------
  // METRIC CHANGE HANDLER (for charts)
  // -----------------------------
  const handleMetricChange = (metric: string) => {
    setSelectedMetric(metric);
  };

  // -----------------------------
  // FULL RESTORED LAYOUT
  // -----------------------------
  return (
    <>
      {/* KPI selector + density plot + stats */}
      <div>
        <KpiPageContent
          kpiOptions={kpiOptions}
          regnskap={regnskap}
          compData={compData}
          naceDevData={naceDevData}
          onMetricChange={handleMetricChange}
        />
      </div>

      {/* Line chart + competitor chart */}
      <div>
        {selectedMetric && (
          <>
            <KpiLineChart
              regnskap={regnskap}
              metric={selectedMetric}
              naceDevData={naceDevData}
            />

            <CompetitorComparison
              regnskap={regnskap}
              metric={selectedMetric}
            />
          </>
        )}
      </div>
    </>
  );
}
