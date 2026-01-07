import { calculateLastXYearsGrowthRate } from '../../data/buildDatasets';

export const calculatePreset = (
  presetKey: string,
  regnskap: Array<{ year: number; [key: string]: number | string }>
): Record<string, number> | null => {
  const yearsMap: Record<string, number> = {
    last5: 5,
    last3: 3,
    last1: 1,
  };
  
  const years = yearsMap[presetKey];
  if (!years) return null;
  
  const growth = calculateLastXYearsGrowthRate({
    regnskap,
    years,
  });
  
  // Convert to the format expected by scenario state
  return {
    omsetning: growth.omsetning ?? 0,
    varekostnad: growth.varekostnad ?? 0,
    lonnskostnader: growth.lonnskostnader ?? 0,
    andre_driftskostnader: growth.andre_driftskostnader ?? 0,
  };
};