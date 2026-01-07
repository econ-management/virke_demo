import { HeaderWrapper } from '../../components/HeaderWrapper';
import { Sidebar } from '../../components/Sidebar';
import { MainSection } from '../../components/MainSection';
import { Footer } from '../../components/Footer';
import pageStyles from '@/styles/sidebar_plus_main.module.css';

interface EffektiviseringPageProps {
  searchParams: {
    orgnr?: string;
  };
}

export default function EffektiviseringPage({ searchParams }: EffektiviseringPageProps) {
  const orgnr = searchParams.orgnr;

  return (
    <div className={pageStyles.page}>
      <HeaderWrapper />
      <div className={pageStyles.content}>
        <Sidebar orgnr={orgnr} />
        <MainSection>
          <h1>Effektiviserings-side</h1>
        </MainSection>
      </div>
      <Footer />
    </div>
  );
}

