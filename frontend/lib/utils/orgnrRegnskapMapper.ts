import { orgnrRegnskapToMapper } from '../config/mapOrgnrRegnskap';

export function orgnrRegnskapMapper(regnskap: Array<{
  year: number;
  [key: string]: number | string;
}>): Array<{
  year: number;
  [key: string]: number | string;
}> {
  if (!regnskap || regnskap.length === 0) {
    return regnskap;
  }

  // Get all variable names from mapper
  const variableNames = Object.values(orgnrRegnskapToMapper).map(m => m.variable_name);

  // Map each regnskap item to only include variables from mapper
  return regnskap.map(item => {
    const mapped: { year: number; [key: string]: number | string } = {
      year: item.year,
    };

    // Only include properties that match mapper variable names
    variableNames.forEach(varName => {
      if (item[varName] !== undefined) {
        mapped[varName] = item[varName];
      }
    });

    return mapped;
  });
}

