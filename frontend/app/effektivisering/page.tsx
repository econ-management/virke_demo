import { Header } from '../../components/Header';
import { Sidebar } from '../../components/Sidebar';
import { MainSection } from '../../components/MainSection';
import { Footer } from '../../components/Footer';
import pageStyles from '../page.module.css';

export default function EffektiviseringPage() {
  return (
    <div className={pageStyles.page}>
      <Header />
      <div className={pageStyles.content}>
        <Sidebar />
        <MainSection>
          <h1>Effektiviserings-side</h1>
        </MainSection>
      </div>
      <Footer />
    </div>
  );
}

