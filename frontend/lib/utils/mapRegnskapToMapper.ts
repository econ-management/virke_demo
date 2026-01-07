import { regnskapVariables } from '../config/kpiOptionMapper';

export function mapRegnskapToMapper(regnskap: Array<{
  year: number;
  [key: string]: number | string;
}>): Array<{
  year: number;
  [key: string]: number | string;
}> {
  if (!regnskap || regnskap.length === 0) {
    return regnskap;
  }

  // Get all variable names from regnskapVariables (keys are variable names)
  const variableNames = Object.keys(regnskapVariables);

  // Map each regnskap item to only include variables from regnskapVariables
  return regnskap.map(item => {
    const mapped: { year: number; [key: string]: number | string } = {
      year: item.year,
    };

    // Only include properties that match regnskapVariables keys
    variableNames.forEach(varName => {
      if (item[varName] !== undefined) {
        mapped[varName] = item[varName];
      }
    });

    return mapped;
  });
}