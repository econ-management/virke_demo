import type { ScenarioState } from '../pieces/ScenarioConfig/ScenarioInputs';

export function calculateOmsetningGrowth(inputs: {
  regnskap: Array<{ year: number; [key: string]: number | string }>;
  scenario?: ScenarioState;
}): number | null {
  const regnskap = inputs.regnskap ?? [];
  if (regnskap.length < 2) return null;

  const sorted = [...regnskap].sort((a, b) => a.year - b.year);
  const first = sorted[0]?.omsetning;
  const last = sorted[sorted.length - 1]?.omsetning;

  if (typeof first !== 'number' || typeof last !== 'number' || first === 0) return null;
  return ((last - first) / first) * 100;
}


export function regnskapArray(inputs: {
  regnskap: Array<{ year: number; [key: string]: number | string }>;
}): Array<{ year: number; [key: string]: number | string }> {
  return inputs.regnskap ?? [];
}

export function calculateDriftsmargin(inputs: {
  regnskap: Array<{ year: number; [key: string]: number | string }>;
}): Array<{ year: number; [key: string]: number | string }> {
  const regnskap = inputs.regnskap ?? [];
  
  return regnskap.map(item => {
    const omsetning = typeof item.omsetning === 'number' ? item.omsetning : 0;
    const avskrivninger = typeof item.avskrivninger === 'number' ? item.avskrivninger : 0;
    const nedskrivninger = typeof item.nedskrivninger === 'number' ? item.nedskrivninger : 0;
    const andre_driftskostnader = typeof item.andre_driftskostnader === 'number' ? item.andre_driftskostnader : 0;
    const lonnskostnader = typeof item.lonnskostnader === 'number' ? item.lonnskostnader : 0;
    const varekostnad = typeof item.varekostnad === 'number' ? item.varekostnad : 0;
    const driftsmargin = typeof item.driftsmargin === 'number' ? item.driftsmargin : 0;

    const driftsmarginCalculated = omsetning !== 0
      ? (omsetning - avskrivninger - nedskrivninger - andre_driftskostnader - lonnskostnader - varekostnad) / omsetning
      : 0;

    return {
      year: item.year,
      driftsmargin: item.driftsmargin,
      driftsmargin_calculated: driftsmarginCalculated,
    };
  });
}


export function calculateProjections(inputs: {
  regnskap: Array<{ year: number; [key: string]: number | string }>;
  scenario?: ScenarioState;
}): Array<{ 
  year: number; 
  driftsresultat_calculated: number;
  driftsmargin_calculated: number;
  omsetning: number;
  lonnskostnader: number;
  andre_driftskostnader: number;
  varekostnad: number;
}> {
  const regnskap = inputs.regnskap ?? [];
  if (regnskap.length === 0) return [];

  // Sort by year ascending
  const sorted = [...regnskap].sort((a, b) => a.year - b.year);
  const latestYear = sorted[sorted.length - 1];
  const latestYearNum = latestYear.year;

  // Get latest year values (for projection base and constants)
  const latestOmsetning = typeof latestYear.omsetning === 'number' ? latestYear.omsetning : 0;
  const latestAndreDriftskostnader = typeof latestYear.andre_driftskostnader === 'number' ? latestYear.andre_driftskostnader : 0;
  const latestLonnskostnader = typeof latestYear.lonnskostnader === 'number' ? latestYear.lonnskostnader : 0;
  const latestVarekostnad = typeof latestYear.varekostnad === 'number' ? latestYear.varekostnad : 0;
  const latestAvskrivninger = typeof latestYear.avskrivninger === 'number' ? latestYear.avskrivninger : 0;
  const latestNedskrivninger = typeof latestYear.nedskrivninger === 'number' ? latestYear.nedskrivninger : 0;

  // Get growth rates from scenario (default to 0 if not provided)
  const omsetningGrowth = inputs.scenario?.omsetning ?? 0;
  const andreDriftskostnaderGrowth = inputs.scenario?.andre_driftskostnader ?? 0;
  const lonnskostnaderGrowth = inputs.scenario?.lonnskostnader ?? 0;
  const varekostnadGrowth = inputs.scenario?.varekostnad ?? 0;

  const results: Array<{
    year: number;
    driftsresultat_calculated: number;
    driftsmargin_calculated: number;
    omsetning: number;
    lonnskostnader: number;
    andre_driftskostnader: number;
    varekostnad: number;
  }> = [];

  // Process historical years
  sorted.forEach(item => {
    const omsetning = typeof item.omsetning === 'number' ? item.omsetning : 0;
    const andre_driftskostnader = typeof item.andre_driftskostnader === 'number' ? item.andre_driftskostnader : 0;
    const lonnskostnader = typeof item.lonnskostnader === 'number' ? item.lonnskostnader : 0;
    const varekostnad = typeof item.varekostnad === 'number' ? item.varekostnad : 0;
    const avskrivninger = typeof item.avskrivninger === 'number' ? item.avskrivninger : 0;
    const nedskrivninger = typeof item.nedskrivninger === 'number' ? item.nedskrivninger : 0;

    const driftsresultatCalculated = omsetning !== 0
    ? omsetning - avskrivninger - nedskrivninger - andre_driftskostnader - lonnskostnader - varekostnad
    : 0;

    const driftsmarginCalculated = omsetning !== 0
      ? (omsetning - avskrivninger - nedskrivninger - andre_driftskostnader - lonnskostnader - varekostnad) / omsetning
      : 0;

    results.push({
      year: item.year,
      driftsresultat_calculated: driftsresultatCalculated,
      driftsmargin_calculated: driftsmarginCalculated,
      omsetning,
      lonnskostnader,
      andre_driftskostnader,
      varekostnad,
    });
  });

  // Project future years (e.g., 3 years forward)
  const projectedYears = 5;
  for (let yearOffset = 1; yearOffset <= projectedYears; yearOffset++) {
    const year = latestYearNum + yearOffset;
    
    // Apply compound growth: value * (1 + growth_rate) ^ years
    const omsetning = latestOmsetning * Math.pow(1 + omsetningGrowth/100, yearOffset);
    const andre_driftskostnader = latestAndreDriftskostnader * Math.pow(1 + andreDriftskostnaderGrowth/100, yearOffset);
    const lonnskostnader = latestLonnskostnader * Math.pow(1 + lonnskostnaderGrowth/100, yearOffset);
    const varekostnad = latestVarekostnad * Math.pow(1 + varekostnadGrowth/100, yearOffset);
    
    // Keep avskrivninger and nedskrivninger constant at latest year values
    const avskrivninger = latestAvskrivninger;
    const nedskrivninger = latestNedskrivninger;

    const driftsresultatCalculated = omsetning !== 0
    ? omsetning - avskrivninger - nedskrivninger - andre_driftskostnader - lonnskostnader - varekostnad
    : 0;


    const driftsmarginCalculated = omsetning !== 0
      ? (omsetning - avskrivninger - nedskrivninger - andre_driftskostnader - lonnskostnader - varekostnad) / omsetning
      : 0;

    results.push({
      year,
      driftsresultat_calculated: driftsresultatCalculated,
      driftsmargin_calculated: driftsmarginCalculated,
      omsetning,
      lonnskostnader,
      andre_driftskostnader,
      varekostnad,
    });
  }

  return results;
}


export function calculateLastXYearsGrowthRate(inputs: {
  regnskap: Array<{ year: number; [key: string]: number | string }>;
  years: number;
}): {
  omsetning: number | null;
  varekostnad: number | null;
  lonnskostnader: number | null;
  andre_driftskostnader: number | null;
  omsetningFirstValue: number | null;
  omsetningLastValue: number | null;
} {
  const regnskap = inputs.regnskap ?? [];
  const years = inputs.years;

  if (regnskap.length < 2 || years < 1) {
    return {
      omsetning: null,
      varekostnad: null,
      lonnskostnader: null,
      andre_driftskostnader: null,
      omsetningFirstValue: null,
      omsetningLastValue: null,
    };
  }

  // Sort by year descending (latest first)
  const sorted = [...regnskap].sort((a, b) => b.year - a.year);
  const lastXYears = sorted.slice(0, years+1).reverse(); // Reverse to get oldest to newest

  if (lastXYears.length < 2) {
    return {
      omsetning: null,
      varekostnad: null,
      lonnskostnader: null,
      andre_driftskostnader: null,
      omsetningFirstValue: null,
      omsetningLastValue: null,
    };
  }

  const first = lastXYears[0];
  const last = lastXYears[lastXYears.length-1];
  const numberOfYears = last.year - first.year;

  if (numberOfYears === 0) {
    return {
      omsetning: null,
      varekostnad: null,
      lonnskostnader: null,
      andre_driftskostnader: null,
      omsetningFirstValue: null,
      omsetningLastValue: null,
    };
  }

  const firstOmsetning = typeof first.omsetning === 'number' ? first.omsetning : null;
  const lastOmsetning = typeof last.omsetning === 'number' ? last.omsetning : null;

  const calculateGrowthRate = (
    firstValue: number | string | undefined,
    lastValue: number | string | undefined
  ): number | null => {
    if (
      typeof firstValue !== 'number' ||
      typeof lastValue !== 'number' ||
      firstValue === 0
    ) {
      return null;
    }

    // Average annual growth rate: ((last - first) / first) / years * 100
    return ((lastValue/ firstValue)**(1/numberOfYears)-1)*100;
  };

  return {
    omsetning: calculateGrowthRate(first.omsetning, last.omsetning),
    varekostnad: calculateGrowthRate(first.varekostnad, last.varekostnad),
    lonnskostnader: calculateGrowthRate(first.lonnskostnader, last.lonnskostnader),
    andre_driftskostnader: calculateGrowthRate(
      first.andre_driftskostnader,
      last.andre_driftskostnader
    ),
    omsetningFirstValue: firstOmsetning,
    omsetningLastValue: lastOmsetning,
  };
}