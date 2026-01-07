import { createContext } from 'react';
import type { ScenarioState } from '../pieces/ScenarioConfig/ScenarioInputs';

export type VekstClientState = {
  scenario?: ScenarioState;
};

export type VekstDataContextValue = {
  state: VekstClientState;
  setScenario: (scenario: ScenarioState | undefined) => void;
};

export const VekstDataContext =
  createContext<VekstDataContextValue | null>(null);
