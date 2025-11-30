export const componentDataSources: Record<string, { dataSources: string[] }> = {
  'HeaderWrapper': {
    dataSources: [],
  },
  'Sidebar': {
    dataSources: ['orgnr', 'brreg', 'regnskap'],
  },
  'Footer': {
    dataSources: [],
  },
  'TwoColumnSection': {
    dataSources: [],
  },
  'KpiPageClientWrapper': {
    dataSources: ['kpiOptions', 'regnskap', 'compData'],
  },
  'KpiPageContent': {
    dataSources: ['kpiOptions', 'regnskap', 'compData'],
  },
  'KpiSelector': {
    dataSources: ['kpiOptions'],
  },
  'StatsBarChart': {
    dataSources: ['compData', 'regnskap'],
  },
  'KpiDensityPlot': {
    dataSources: ['compData', 'regnskap'],
  },
  'KpiLineChart': {
    dataSources: ['regnskap'],
  },
};

