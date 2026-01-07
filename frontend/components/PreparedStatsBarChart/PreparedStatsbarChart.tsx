'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
  LabelList,
} from 'recharts';

interface PreparedStatsBarChartProps {
  data: { name: string; value: number }[];
  markerValue: number;
  formatValue: (v: number) => string;
}

export function PreparedStatsBarChart({
  data,
  markerValue,
  formatValue,
}: PreparedStatsBarChartProps) {
  const maxValue = Math.max(
    markerValue,
    ...data.map(d => d.value)
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 20, right: 80, left: 20, bottom: 20 }}>
        <XAxis dataKey="name" />
        <YAxis domain={[0, maxValue]} tickFormatter={formatValue} />
        <Tooltip formatter={(v: number) => formatValue(v)} />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          <LabelList
            dataKey="value"
            position="top"
            formatter={(value) =>
                typeof value === 'number'
                  ? formatValue(value)
                  : ''
              }
          />
        </Bar>
        <ReferenceLine y={markerValue} strokeWidth={2} />
      </BarChart>
    </ResponsiveContainer>
  );
}
