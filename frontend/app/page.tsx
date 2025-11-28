'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '../components/Header';
import { MainSection } from '../components/MainSection';
import { Footer } from '../components/Footer';
import { CompanySearch } from '../components/CompanySearch';
import { InterestSelection } from '../components/InterestSelection';
import pageStyles from './page.module.css';
import landingStyles from './landing.module.css';

export default function LandingPage() {
  const [selectedCompany, setSelectedCompany] = useState<{ orgnr: number; navn: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Clear the selectedOrgnr cookie when landing page loads
    document.cookie = 'selectedOrgnr=; path=/; max-age=0';
  }, []);

  const interestOptions = ['Lønnsomhet', 'Vekst', 'Trender', 'Effektivisering', 'Organisasjon'];

  return (
    <div className={pageStyles.page}>
      <Header />
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
          onClick={() => {
            if (selectedCompany) {
              document.cookie = `selectedOrgnr=${selectedCompany.orgnr}; path=/; max-age=3600`;
              router.push('/kpi');
            }
          }}
          disabled={!selectedCompany}
        >
          Fortsett
        </button>
      </MainSection>
      <Footer />
    </div>
  );
}

