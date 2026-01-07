'use client';

import { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import clsx from 'clsx';
import pageStyles from '@/styles/sidebar_plus_main.module.css';
import { TwoColumnSection } from '@/components/TwoColumnSection';
import twoColumnStyles from '../../components/TwoColumnSection/TwoColumnSection.module.css';
import { ScenarioConfigurator } from './pieces/ScenarioConfig/ScenarioConfigurator';
import { ScenarioProvider, useScenario } from './pieces/ScenarioConfig/scenario.store';
import { calculateOmsetningGrowth, regnskapArray, calculateDriftsmargin, calculateProjections, calculateLastXYearsGrowthRate } from './data/buildDatasets';
import { GeneralLineChart } from '../components/GeneralLineChart';
import { calculatePreset } from './pieces/ScenarioConfig/VekstPresetsCalculator';

export function VekstPageLayout(props: {
  orgnr: string;
  brreg: any[];
  regnskap: any[];
}) {
  return (
    <ScenarioProvider>
      <VekstPageInner {...props} />
    </ScenarioProvider>
  );
}

function VekstPageInner(props: {
  orgnr: string;
  brreg: any[];
  regnskap: any[];
}) {
  const { scenario, apply, setActivePreset } = useScenario();

  useEffect(() => {
    if (props.regnskap && props.regnskap.length > 0) {
      const hasValues = Object.values(scenario).some(val => val !== null);
      if (!hasValues) {
        const preset = calculatePreset('last5', props.regnskap);
        if (preset) {
          apply(preset);
          setActivePreset('last5');
        }
      }
    }
  }, [props.regnskap, apply, scenario, setActivePreset]);
  const projections = calculateProjections({
    regnskap: props.regnskap,
    scenario,
  });

  return (
    <div className={clsx('content', pageStyles.content)}>
      <Sidebar orgnr={props.orgnr} brreg={props.brreg} regnskap={props.regnskap} />

      <TwoColumnSection stackUntilDesktop={true}>
        <div className={twoColumnStyles.fullWidthBox}>
          <h1>Se hvordan ulike scenarioer påvirker virksomheten din</h1>
          <ScenarioConfigurator regnskap={props.regnskap} />
        </div>

        <div>
          <GeneralLineChart
            series={[{ label: 'Omsetning', data: projections.filter(item => typeof item.omsetning === 'number').map(item => ({ x: item.year, y: item.omsetning as number })) }]}
            format="monetary"
            showLabel="last"
            title="Omsetning"
          />
          <GeneralLineChart
            series={[{ label: 'Lønnskostnader', data: projections.filter(item => typeof item.lonnskostnader === 'number').map(item => ({ x: item.year, y: item.lonnskostnader as number })) }, 
              { label: 'Varekostnader', data: projections.filter(item => typeof item.varekostnad === 'number').map(item => ({ x: item.year, y: item.varekostnad as number })) },
              { label: 'Andre driftskostnader', data: projections.filter(item => typeof item.andre_driftskostnader === 'number').map(item => ({ x: item.year, y: item.andre_driftskostnader as number })) }
            ]}
            format="monetary"
            showLabel="label"
            title="Andre Kostnader"
          />

        </div>
        <div >
          <GeneralLineChart
            series={[{ label: 'Driftsmargin', data: projections.filter(item => typeof item.driftsmargin_calculated === 'number').map(item => ({ x: item.year, y: item.driftsmargin_calculated as number })) }]}
            format="percentage"
            showLabel="last"
            title="Driftsmargin"
          />
          <GeneralLineChart
            series={[{ label: 'Driftsresultat', data: projections.filter(item => typeof item.driftsresultat_calculated === 'number').map(item => ({ x: item.year, y: item.driftsresultat_calculated as number })) }]}
            format="monetary"
            showLabel="last"
            title="Driftsresultat"
          />
        </div>
      </TwoColumnSection>
    </div>
  );
}
