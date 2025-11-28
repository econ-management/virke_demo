import { LoadingSpinner } from '../../components/LoadingSpinner';
import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { TwoColumnSection } from '../../components/TwoColumnSection';
import { Footer } from '../../components/Footer';
import pageStyles from '../page.module.css';

export default function KpiLoading() {
  return (
    <div className={pageStyles.page}>
      <Header />

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

