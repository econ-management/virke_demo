'use client';

import { useEffect, useState, useRef } from 'react';
import { getKpiResult2 } from '../../logic/api/getKpiResult2';
import { getRegnskapOrgnr } from '../../logic/api/getRegnskapOrgnr';
import { KpiOption } from '../config/kpiOptions';

interface KpiPageDataManagerProps {
  orgnr: string;
  nace: string | null;
  kpiOptions: KpiOption[];
  initialCompData: Record<string, any>;
  initialNaceDevData: Record<string, any>;
  children: (data: {
    compData: Record<string, any>;
    naceDevData: Record<string, any>;
    selectedMetric: string | null;
    handleMetricChange: (selected: string, metric?: string) => void;
    selectedCompanies: Array<{ orgnr: number; navn: string }>;
    sammenligneSelskaper: {
      [index: number]: Array<{
        orgnr: number;
        year: number;
        [key: string]: number | string;
      }>;
    };
    handleCompanySelect: (company: { orgnr: number; navn: string } | null) => void;
    handleReset: () => void;
  }) => React.ReactNode;
}

export const KpiPageDataManager = ({
  orgnr,
  nace,
  kpiOptions,
  initialCompData,
  initialNaceDevData,
  children,
}: KpiPageDataManagerProps) => {
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

  return (
    <>
      {children({
        compData,
        naceDevData,
        selectedMetric,
        handleMetricChange,
        selectedCompanies,
        sammenligneSelskaper,
        handleCompanySelect,
        handleReset,
      })}
    </>
  );
};
