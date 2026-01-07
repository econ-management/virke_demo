'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

import { HeaderWrapper } from '../components/HeaderWrapper';
import { MainSection } from '../components/MainSection';
import { Footer } from '../components/Footer';
import { CompanySearch } from '../components/CompanySearch';
import { InterestSelection } from '../components/InterestSelection';

import { preloadKpiDataFull } from '../logic/api/preloadKpiDataFull';

import pageStyles from '@/styles/sidebar_plus_main.module.css';
import landingStyles from './landing.module.css';

export default function LandingPage() {
  const [selectedCompany, setSelectedCompany] = useState<{
    orgnr: number;
    navn: string;
  } | null>(null);

  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const currentOrgnrRef = useRef<string | null>(null);

  /** Reset state on component mount */
  useEffect(() => {
    currentOrgnrRef.current = null;
    setSelectedCompany(null);
  }, []);

  /** When company changes → fire-and-forget preload-full */
  useEffect(() => {
    if (!selectedCompany) return;

    const orgnr = selectedCompany.orgnr.toString();
    currentOrgnrRef.current = orgnr;

    // Fire preload immediately (no waiting)
    preloadKpiDataFull(orgnr).catch(err => {
      console.error('Preload-full failed (non-critical):', err);
    });

  }, [selectedCompany]);

  /** Navigation handler */
  const handleContinue = () => {
    if (selectedCompany && !isNavigating) {
      setIsNavigating(true);
      router.push(`/kpi?orgnr=${selectedCompany.orgnr}`);
    }
  };

  const interestOptions = [
    'Lønnsomhet',
    'Vekst',
    'Trender',
    'Effektivisering',
    'Organisasjon',
  ];

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
