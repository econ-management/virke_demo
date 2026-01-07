'use client';

import React, { createContext, useContext, useMemo, useState } from 'react';
import { ScenarioInputsVars } from '@/lib/config/ScenarioInputs';

export type ScenarioState = Record<string, number | null>;

type ScenarioStore = {
  scenario: ScenarioState;
  setScenario: React.Dispatch<React.SetStateAction<ScenarioState>>;
  update: (key: string, value: number | null) => void;
  apply: (patch: Partial<ScenarioState>) => void;
  reset: () => void;
  activePreset: string | null;
  setActivePreset: React.Dispatch<React.SetStateAction<string | null>>;
};

const ScenarioContext = createContext<ScenarioStore | null>(null);

function buildInitialScenario(): ScenarioState {
  return Object.fromEntries(
    Object.values(ScenarioInputsVars).map(v => [v.variable_name, null])
  );
}

export function ScenarioProvider({ children }: { children: React.ReactNode }) {
  const [scenario, setScenario] = useState<ScenarioState>(buildInitialScenario);
  const [activePreset, setActivePreset] = useState<string | null>(null);

  const store = useMemo<ScenarioStore>(() => {
    return {
      scenario,
      setScenario,
      update: (key, value) => {
        setScenario(prev => ({ ...prev, [key]: value }));
        setActivePreset(null);
      },
      apply: (patch) => setScenario(prev => ({ ...prev, ...patch } as ScenarioState)),
      reset: () => {
        setScenario(buildInitialScenario());
        setActivePreset(null);
      },
      activePreset,
      setActivePreset,
    };
  }, [scenario, activePreset]);

  return (
    <ScenarioContext.Provider value={store}>
      {children}
    </ScenarioContext.Provider>
  );
}

export function useScenario() {
  const ctx = useContext(ScenarioContext);
  if (!ctx) throw new Error('useScenario must be used within ScenarioProvider');
  return ctx;
}
