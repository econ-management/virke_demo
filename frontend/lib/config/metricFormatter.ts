import { FormatterType } from '../utils/formatter';

export const metricFormatter: Record<string, FormatterType> = {
  'Driftsmargin': 'percentage',
  'Omsetning': 'monetary',
  'Lønnskostnader': 'percentage',
  'Varekostnader': 'percentage',
};

