import { Suspense } from 'react';
import styles from './Sidebar.module.css';
import { SidebarCompanyInfo } from '../lib/components/SidebarCompanyInfo';
import { CompanyInfo } from './CompanyInfo';

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <Suspense fallback={<CompanyInfo />}>
        <SidebarCompanyInfo />
      </Suspense>
    </aside>
  );
};

