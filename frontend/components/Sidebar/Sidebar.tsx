import { Suspense } from 'react';
import styles from './Sidebar.module.css';
import { SidebarCompanyInfo } from '../../lib/components/SidebarCompanyInfo';
import { CompanyInfo } from '../CompanyInfo';

interface SidebarProps {
  orgnr?: string;
  brreg?: any[];
  regnskap?: any[];
}

export const Sidebar = ({ orgnr, brreg, regnskap }: SidebarProps) => {
  return (
    <aside className={styles.sidebar}>
      {orgnr && brreg && regnskap ? (
        <SidebarCompanyInfo orgnr={orgnr} brreg={brreg} regnskap={regnskap} />
      ) : orgnr ? (
        <Suspense fallback={<CompanyInfo />}>
          <SidebarCompanyInfo orgnr={orgnr} />
        </Suspense>
      ) : (
        <CompanyInfo />
      )}
    </aside>
  );
};

