'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { HeaderWrapper } from '../components/HeaderWrapper';
import { MainSection } from '../components/MainSection';
import { Footer } from '../components/Footer';
import { CompanySearch } from '../components/CompanySearch';
import { InterestSelection } from '../components/InterestSelection';
import { preloadKpiData } from '../lib/api/preloadKpiData';
import { preloadKpiData2 } from '../lib/api/preloadKpiData2';
import { getKpiResult } from '../lib/api/getKpiResult';
import { getKpiResult2 } from '../lib/api/getKpiResult2';
import pageStyles from './page.module.css';
import landingStyles from './landing.module.css';

export default function LandingPage() {
  const [selectedCompany, setSelectedCompany] = useState<{ orgnr: number; navn: string } | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const cancelledRef = useRef(false);
  const currentOrgnrRef = useRef<string | null>(null);

  useEffect(() => {
    cancelledRef.current = true;
    currentOrgnrRef.current = null;
    setSelectedCompany(null);
  }, []);

  useEffect(() => {
    if (!selectedCompany) {
      return;
    }

    cancelledRef.current = false;
    let timeoutId: NodeJS.Timeout | null = null;
    let preload2Called = false;
    const abortController = new AbortController();

    const orgnr = selectedCompany.orgnr.toString();
    currentOrgnrRef.current = orgnr;
    
    if (cancelledRef.current) {
      return;
    }
    
    preloadKpiData(orgnr);
    
    const checkAndPreload2 = async () => {
      const maxAttempts = 50;
      const delay = 100;
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (cancelledRef.current || abortController.signal.aborted || currentOrgnrRef.current !== orgnr) {
          return;
        }
        
        try {
          const result = await getKpiResult(orgnr);
          if (cancelledRef.current || abortController.signal.aborted || currentOrgnrRef.current !== orgnr) {
            return;
          }
          
          if (result && result.brreg && result.brreg.length > 0 && result.brreg[0].naring1_kode) {
            if (!cancelledRef.current && !abortController.signal.aborted && currentOrgnrRef.current === orgnr && !preload2Called) {
              preload2Called = true;
              preloadKpiData2(orgnr).catch(err => {
                if (!cancelledRef.current && currentOrgnrRef.current === orgnr) {
                  console.error('Error calling preloadKpiData2:', err);
                }
              });
              return;
            }
          }
        } catch (error) {
          if (cancelledRef.current || abortController.signal.aborted || currentOrgnrRef.current !== orgnr) {
            return;
          }
          // Continue polling
        }
        
        if (attempt < maxAttempts - 1 && !cancelledRef.current && !abortController.signal.aborted && currentOrgnrRef.current === orgnr) {
          await new Promise(resolve => {
            timeoutId = setTimeout(resolve, delay);
          });
        }
      }
    };
    
    checkAndPreload2();
    
    return () => {
      cancelledRef.current = true;
      currentOrgnrRef.current = null;
      abortController.abort();
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
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

