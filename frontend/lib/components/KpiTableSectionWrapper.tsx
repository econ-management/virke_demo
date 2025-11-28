'use client';

import { Suspense } from 'react';
import { TableSectionSkeleton } from '../../components/TableSectionSkeleton';
import { KpiTableSection } from './KpiTableSection';

interface KpiTableSectionWrapperProps {
  orgnr: string;
  metric?: string;
}

export const KpiTableSectionWrapper = ({ orgnr, metric }: KpiTableSectionWrapperProps) => {
  if (!metric) {
    return null;
  }

  return (
    <Suspense fallback={<TableSectionSkeleton />}>
      <KpiTableSection orgnr={orgnr} metric={metric} />
    </Suspense>
  );
};

