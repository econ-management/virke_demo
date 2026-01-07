'use client';

import { useKpiPagePieces } from '../../lib/components/KpiPageClientWrapper_alternative';

export const KpiPagePieces = () => {
  const pieces = useKpiPagePieces();
  return null;
};

export const KpiSelectorPiece = () => {
  const pieces = useKpiPagePieces();
  return <>{pieces.kpiSelector}</>;
};

export const TitlePiece = () => {
  const pieces = useKpiPagePieces();
  return <>{pieces.title}</>;
};

export const StatBarTextPiece = () => {
  const pieces = useKpiPagePieces();
  return <>{pieces.statBarText}</>;
};

export const StatBarChartPiece = () => {
  const pieces = useKpiPagePieces();
  return <>{pieces.statBarChart}</>;
};

export const DensityPlotTitlePiece = () => {
  const pieces = useKpiPagePieces();
  return <>{pieces.densityPlotTitle}</>;
};

export const DensityPlotPiece = () => {
  const pieces = useKpiPagePieces();
  return <>{pieces.densityPlot}</>;
};

export const LineChartTitlePiece = () => {
  const pieces = useKpiPagePieces();
  return <>{pieces.lineChartTitle}</>;
};

export const LineChartPiece = () => {
  const pieces = useKpiPagePieces();
  return <>{pieces.lineChart}</>;
};

export const CompetitorSearchPiece = () => {
  const pieces = useKpiPagePieces();
  return <>{pieces.competitorSearch}</>;
};

export const CompanyLineChartPiece = () => {
  const pieces = useKpiPagePieces();
  return <>{pieces.companyLineChart}</>;
};
