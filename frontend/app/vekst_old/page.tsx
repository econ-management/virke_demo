import { HeaderWrapper } from '../../components/HeaderWrapper';
import { Sidebar } from '../../components/Sidebar';
import { TwoColumnSection } from '../../components/TwoColumnSection';
import { Footer } from '../../components/Footer';
import { VekstSelector } from '../../components/VekstSelector';
import { ScenarioInputs } from '../../components/ScenarioInputs';
import { KpiPageClientWrapper } from '../../lib/components/KpiPageClientWrapper';
import { vekstOptions } from '../../lib/config/vekstOptions';
import { getKpiResult } from '../../logic/api/getKpiResult';
import { getKpiResult2 } from '../../logic/api/getKpiResult2';
import { kpiOptionsList } from '../../lib/config/kpiOptions';
import { mapRegnskapToMapper } from '../../lib/utils/mapRegnskapToMapper';
import pageStyles from '@/styles/sidebar_plus_main.module.css';
import twoColumnStyles from '../../components/TwoColumnSection/TwoColumnSection.module.css';

export const dynamic = "force-dynamic";

interface VekstPageProps {
  searchParams: {
    orgnr?: string;
  };
}

export default async function VekstPage({ searchParams }: VekstPageProps) {
  const orgnr = searchParams.orgnr;

  const options = vekstOptions.map(option => option.label);

  if (!orgnr) {
    return (
      <div className={pageStyles.page}>
        <HeaderWrapper />
        <div className={pageStyles.content}>
          <Sidebar orgnr={orgnr} />
          <TwoColumnSection>
            <div className={twoColumnStyles.fullWidthBox}>
              <h1>Se hvordan ulike scenarioer påvirker virksomheten din</h1>
              <VekstSelector
                label="Velg scenario"
                options={options}
              />
              <ScenarioInputs />
            </div>
          </TwoColumnSection>
        </div>
        <Footer />
      </div>
    );
  }

  const [kpiBase, kpiCompare] = await Promise.all([
    getKpiResult(orgnr),
    getKpiResult2(orgnr, "Driftsmargin"),
  ]);

  const regnskap = kpiBase?.regnskap || [];
  const brreg = kpiBase?.brreg || [];

  const mappedRegnskap = mapRegnskapToMapper(regnskap);
  const nace = brreg?.[0]?.naring1_kode || null;

  const initialCompData = kpiCompare?.comp_by_nace_var || {};
  const initialNaceDevData = kpiCompare?.nace_dev_var || {};

  return (
    <div className={pageStyles.page}>
      <HeaderWrapper />
      <div className={pageStyles.content}>
        <Sidebar orgnr={orgnr} brreg={brreg} regnskap={mappedRegnskap} />
        <TwoColumnSection>
          <div className={twoColumnStyles.fullWidthBox}>
            <h1>Se hvordan ulike scenarioer påvirker virksomheten din</h1>
            <VekstSelector
              label="Velg scenario"
              options={options}
            />
            <ScenarioInputs />
          </div>
          <KpiPageClientWrapper
            orgnr={orgnr}
            regnskap={mappedRegnskap}
            nace={nace}
            kpiOptions={kpiOptionsList}
            initialCompData={initialCompData}
            initialNaceDevData={initialNaceDevData}
          />
        </TwoColumnSection>
      </div>
      <Footer />
    </div>
  );
}

