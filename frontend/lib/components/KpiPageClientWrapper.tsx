'use client';

import { useState, useEffect, useRef } from 'react';
import { KpiPageContent } from './KpiPageContent';
import { KpiLineChart } from './KpiLineChart';
import { CompetitorComparison } from './CompetitorComparison';
import { KpiOption } from '../config/kpiOptions';
import { Dist } from '../api/getCompByNaceVar';
import { getCompByNaceVar } from '../api/getCompByNaceVar';
import { getNaceDevVar } from '../api/getNaceDevVar';
import { kpiOptionMapper } from '../config/kpiOptionMapper';

interface KpiPageClientWrapperProps {
  kpiOptions: KpiOption[];
  regnskap: Array<{
    year: number;
    [key: string]: number | string;
  }>;
  compData: {
    [key: string]: Dist;
  } | null;
  naceDevData: {
    [key: string]: {
      [year: number]: {
        min: number;
        max: number;
        median: number;
        mean: number;
      };
    };
  } | null;
  nace: string | null;
}

export const KpiPageClientWrapper = ({ kpiOptions, regnskap, compData, naceDevData, nace }: KpiPageClientWrapperProps) => {
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [data_comp_by_nace_var, setDataCompByNaceVar] = useState<{ [key: string]: Dist }>(compData || {});
  const [data_nace_dev_var, setDataNaceDevVar] = useState<{ 
    [key: string]: { 
      [year: number]: { 
        min: number; 
        max: number; 
        median: number; 
        mean: number; 
      }; 
    }; 
  }>(naceDevData as any || {});
  const preloadStartedRef = useRef(false);
  const uncheckedListRef = useRef<string[]>([]);
  const processingRef = useRef(false);

  useEffect(() => {
    if (compData) {
      setDataCompByNaceVar(compData);
    }
  }, [compData]);

  useEffect(() => {
    if (naceDevData) {
      setDataNaceDevVar(naceDevData);
    }
  }, [naceDevData]);

  useEffect(() => {
    const allMetrics = Object.keys(kpiOptionMapper);
    uncheckedListRef.current = allMetrics.filter(metric => metric !== "Driftsmargin");
  }, []);

  useEffect(() => {
    if (!nace || preloadStartedRef.current || processingRef.current) return;
    
    const waitForDriftsmarginAndProcess = async () => {
      const checkDriftsmargin = () => {
        return data_comp_by_nace_var["Driftsmargin"] && data_nace_dev_var["Driftsmargin"] && Object.keys(data_nace_dev_var["Driftsmargin"]).length > 0;
      };

      if (!checkDriftsmargin()) {
        return;
      }

      preloadStartedRef.current = true;
      processingRef.current = true;

      while (uncheckedListRef.current.length > 0) {
        const metric = uncheckedListRef.current[0];

        try {
          const compDataResult = await getCompByNaceVar(nace, metric);
          const compData = (compDataResult as any)[metric] ? (compDataResult as any)[metric] : compDataResult;
          setDataCompByNaceVar(prev => ({ ...prev, [metric]: compData as Dist }));

          const naceDevDataResult = await getNaceDevVar(nace, metric);
          const naceDevData = (naceDevDataResult as any)[metric] ? (naceDevDataResult as any)[metric] : naceDevDataResult;
          setDataNaceDevVar(prev => ({ ...prev, [metric]: naceDevData as { [year: number]: { min: number; max: number; median: number; mean: number; } } }));

          uncheckedListRef.current = uncheckedListRef.current.slice(1);
          
          if (uncheckedListRef.current.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        } catch (error) {
          console.error(`Error fetching metric data for ${metric}:`, error);
          uncheckedListRef.current = uncheckedListRef.current.slice(1);
          
          if (uncheckedListRef.current.length > 0) {
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }
      }

      processingRef.current = false;
    };

    waitForDriftsmarginAndProcess();
  }, [nace, data_comp_by_nace_var, data_nace_dev_var]);

  const handleMetricChange = async (metric: string) => {
    setSelectedMetric(metric);

    if (!nace) return;

    // Check if data already exists
    if (data_comp_by_nace_var[metric] && data_nace_dev_var[metric]) {
      return;
    }

    // Fetch missing data
    try {
      if (!data_comp_by_nace_var[metric]) {
        const compDataResult = await getCompByNaceVar(nace, metric);
        const compData = (compDataResult as any)[metric] ? (compDataResult as any)[metric] : compDataResult;
        setDataCompByNaceVar(prev => ({ ...prev, [metric]: compData as Dist }));
      }

      if (!data_nace_dev_var[metric]) {
        const naceDevDataResult = await getNaceDevVar(nace, metric);
        const naceDevData = (naceDevDataResult as any)[metric] ? (naceDevDataResult as any)[metric] : naceDevDataResult;
        setDataNaceDevVar(prev => ({ ...prev, [metric]: naceDevData as { [year: number]: { min: number; max: number; median: number; mean: number; } } }));
      }
    } catch (error) {
      console.error('Error fetching metric data:', error);
    }
  };

  return (
    <>
      <div>
        <KpiPageContent 
          kpiOptions={kpiOptions} 
          regnskap={regnskap}
          compData={data_comp_by_nace_var}
          naceDevData={data_nace_dev_var as any}
          onMetricChange={handleMetricChange}
        />
      </div>
      <div>
        {selectedMetric && (
          <>
            <KpiLineChart regnskap={regnskap} metric={selectedMetric} naceDevData={data_nace_dev_var} />
            <CompetitorComparison regnskap={regnskap} metric={selectedMetric} />
          </>
        )}
      </div>
    </>
  );
};

