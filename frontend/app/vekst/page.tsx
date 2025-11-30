import { HeaderWrapper } from '../../components/HeaderWrapper';
import { Sidebar } from '../../components/Sidebar';
import { MainSection } from '../../components/MainSection';
import { Footer } from '../../components/Footer';
import pageStyles from '../page.module.css';

interface VekstPageProps {
  searchParams: {
    orgnr?: string;
  };
}

export default function VekstPage({ searchParams }: VekstPageProps) {
  const orgnr = searchParams.orgnr;

  return (
    <div className={pageStyles.page}>
      <HeaderWrapper />
      <div className={pageStyles.content}>
        <Sidebar orgnr={orgnr} />
        <MainSection>
          <h1>Vekst-side</h1>
        </MainSection>
      </div>
      <Footer />
    </div>
  );
}

