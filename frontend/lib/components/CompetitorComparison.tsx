'use client';

import { useState } from 'react';
import { CompanySearch } from '../../components/CompanySearch';
import { CompanyLineChart } from './CompanyLineChart';
import { getRegnskapOrgnr } from '../api/getRegnskapOrgnr';

interface CompetitorComparisonProps {
  regnskap: Array<{
    year: number;
    [key: string]: number | string;
  }>;
  metric: string;
}

export const CompetitorComparison = ({ regnskap, metric }: CompetitorComparisonProps) => {
  const [selectedCompanies, setSelectedCompanies] = useState<Array<{ orgnr: number; navn: string }>>([]);
  const [sammenligne_selskaper, setSammenligneSelskaper] = useState<{
    [index: number]: Array<{
      orgnr: number;
      year: number;
      [key: string]: number | string;
    }>;
  }>({});

  const formatOrgnr = (orgnr: number): string => {
    return orgnr.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const handleReset = () => {
    setSelectedCompanies([]);
    setSammenligneSelskaper({});
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

  return (
    <div>
      <h3 style={{ marginLeft: '20px', marginTop: '40px', marginBottom: '20px' }}>Sammenligne med spesifikke konkurrenter</h3>
      <div style={{ marginLeft: '20px' }}>
        <CompanySearch onCompanySelect={handleCompanySelect} showSelectedBox={false} />
        <button
          onClick={handleReset}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: 'transparent',
            border: '1px solid #000',
            cursor: 'pointer',
            fontSize: '14px',
          }}
        >
          Nullstill utvalg
        </button>
        <div style={{ marginLeft: '0', width: '100%' }}>
          <CompanyLineChart regnskap={regnskap} metric={metric} sammenligne_selskaper={sammenligne_selskaper} selectedCompanies={selectedCompanies} />
        </div>
      </div>
    </div>
  );
};

