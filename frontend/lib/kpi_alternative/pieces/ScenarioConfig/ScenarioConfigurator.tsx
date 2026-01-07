'use client';

import { ScenarioInputs } from './ScenarioInputs';
import { VekstPresets } from './VekstPresets';
import { calculatePreset } from './VekstPresetsCalculator';
import { useScenario } from './scenario.store';

interface ScenarioConfiguratorProps {
  regnskap: Array<{ year: number; [key: string]: number | string }>;
}

export function ScenarioConfigurator({ regnskap }: ScenarioConfiguratorProps) {
  const { scenario, update, apply, setActivePreset, activePreset } = useScenario();

  const applyPreset = (presetKey: string) => {
    const preset = calculatePreset(presetKey, regnskap);
    if (!preset) return;
    apply(preset);
    setActivePreset(presetKey);
  };

  return (
    <div>
      <VekstPresets onSelect={applyPreset} activePreset={activePreset} />
      <ScenarioInputs scenario={scenario} onChange={update} />
    </div>
  );
}