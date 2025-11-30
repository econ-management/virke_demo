export interface KpiOption {
  label: string;
  metrics: string[];
}

export const kpiOptions: Record<string, KpiOption> = {
  Lønnsomhet: {
    label: 'Lønnsomhet',
    metrics: ['Driftsmargin']
  },
  Aktivitet: {
    label: 'Aktivitet',
    metrics: ['Omsetning']
  },
  Kostnader: {
    label: 'Kostnader',
    metrics: ['Lønnskostnader', 'Varekostnader']
  },
};

export const kpiOptionsList = Object.values(kpiOptions);
