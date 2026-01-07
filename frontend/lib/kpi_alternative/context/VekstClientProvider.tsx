'use client';

import { useState, ReactNode } from 'react';
import { VekstDataContext } from './VekstDataContext';
import type { ScenarioState } from '../pieces/ScenarioConfig/ScenarioInputs';

interface Props {
  children: ReactNode;
}

export function VekstClientProvider({ children }: Props) {
  const [scenario, setScenario] = useState<ScenarioState | undefined>(undefined);

  return (
    <VekstDataContext.Provider
      value={{
        state: { scenario },
        setScenario,
      }}
    >
      {children}
    </VekstDataContext.Provider>
  );
}
