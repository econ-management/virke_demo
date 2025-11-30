'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { HeaderWrapper } from '../components/HeaderWrapper';
import { MainSection } from '../components/MainSection';
import { Footer } from '../components/Footer';
import { CompanySearch } from '../components/CompanySearch';
import { InterestSelection } from '../components/InterestSelection';
import { preloadKpiData } from '../lib/api/preloadKpiData';
import pageStyles from './page.module.css';
import landingStyles from './landing.module.css';

export default function LandingPage() {
  const [selectedCompany, setSelectedCompany] = useState<{ orgnr: number; navn: string } | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (selectedCompany) {
      preloadKpiData(selectedCompany.orgnr.toString());
    }
  }, [selectedCompany]);

  const handleContinue = () => {
    if (selectedCompany && !isNavigating) {
      setIsNavigating(true);
      router.push(`/kpi?orgnr=${selectedCompany.orgnr}`);
    }
  };

  const interestOptions = ['Lønnsomhet', 'Vekst', 'Trender', 'Effektivisering', 'Organisasjon'];

  return (
    <div className={pageStyles.page}>
      <HeaderWrapper />
      <MainSection>
        <h1>Landingsside</h1>
        <label htmlFor="company-search" className={landingStyles.label}>
          Skriv inn navn på virksomheten din
        </label>
        <CompanySearch onCompanySelect={setSelectedCompany} />
        <InterestSelection
          label="Skriv inn hva du er mest interessert i å få data/analyser om"
          options={interestOptions}
        />
        <button
          className={landingStyles.button}
          onClick={handleContinue}
          disabled={!selectedCompany || isNavigating}
        >
          {isNavigating ? 'Laster...' : 'Fortsett'}
        </button>
      </MainSection>
      <Footer />
    </div>
  );
}

