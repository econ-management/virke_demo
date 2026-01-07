'use client';

import { CompanySearch } from '../CompanySearch';

interface CompetitorSearchBoxProps {
  onCompanySelect: (company: { orgnr: number; navn: string } | null) => void;
  onReset: () => void;
}

export const CompetitorSearchBox = ({ onCompanySelect, onReset }: CompetitorSearchBoxProps) => {
  return (
    <div>
      <h3>Sammenligne med spesifikke konkurrenter</h3>
      <CompanySearch onCompanySelect={onCompanySelect} showSelectedBox={false} />
      <button
        onClick={onReset}
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
    </div>
  );
};
