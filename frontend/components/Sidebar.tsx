import { Suspense } from 'react';
import styles from './Sidebar.module.css';
import { SidebarCompanyInfo } from '../lib/components/SidebarCompanyInfo';
import { CompanyInfo } from './CompanyInfo';

interface SidebarProps {
  orgnr?: string;
}

export const Sidebar = ({ orgnr }: SidebarProps) => {
  return (
    <aside className={styles.sidebar}>
      {orgnr ? (
        <Suspense fallback={<CompanyInfo />}>
          <SidebarCompanyInfo orgnr={orgnr} />
        </Suspense>
      ) : (
        <CompanyInfo />
      )}
    </aside>
  );
};

