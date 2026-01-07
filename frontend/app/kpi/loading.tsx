import { LoadingSpinner } from '../../components/LoadingSpinner';
import { HeaderWrapper } from '../../components/HeaderWrapper';
import { Sidebar } from '../../components/Sidebar';
import { TwoColumnSection } from '../../components/TwoColumnSection';
import { Footer } from '../../components/Footer';
import pageStyles from '@/styles/sidebar_plus_main.module.css';

export default function KpiLoading() {
  return (
    <div className={pageStyles.page}>
      <HeaderWrapper />

      <div className={pageStyles.content}>
        <Sidebar />

        <TwoColumnSection>
          <div>
            <h1>KPI side</h1>
            <LoadingSpinner />
          </div>
          <div></div>
        </TwoColumnSection>
      </div>

      <Footer />
    </div>
  );
}

