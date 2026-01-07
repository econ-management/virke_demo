'use client';

import { useEffect, useState } from 'react';
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
import styles from './StatsBarChart.module.css';
import { formatter, FormatterType } from '../../lib/utils/formatter';
import { getVariableName } from '../../lib/config/kpiOptionMapper';
import { metricFormatter } from '../../lib/config/metricFormatter';
import { Dist } from '../../logic/api/getCompByNaceVar';

interface StatsBarChartAlternativeProps {
  compData: {
    [key: string]: Dist;
  } | null;
  regnskap: Array<{
    year: number;
    [key: string]: number | string;
  }>;
  selectedMetric: string | null;
  showText?: boolean;
}

export const StatsBarChartAlternative = ({ compData, regnskap, selectedMetric, showText = true }: StatsBarChartAlternativeProps) => {
  const [colors, setColors] = useState({
    rosa: '#c9007f',
    orange: '#f57f00',
    black: '#000000',
    white: '#ffffff',
    baseRosa: '#f9cfe3',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = getComputedStyle(document.documentElement);
      setColors({
        rosa: root.getPropertyValue('--color-signature-rosa').trim() || '#c9007f',
        orange: root.getPropertyValue('--color-signature-orange').trim() || '#f57f00',
        black: root.getPropertyValue('--color-text-black').trim() || '#000000',
        white: root.getPropertyValue('--color-white').trim() || '#ffffff',
        baseRosa: root.getPropertyValue('--color-base-rosa').trim() || '#f9cfe3',
      });
    }
  }, []);

  if (!selectedMetric || !compData) return null;

  const distData = compData[selectedMetric];
  if (!distData?.stats) {
    return null;
  }

  const variableName = getVariableName(selectedMetric);
  if (!variableName) return null;

  const latestRegnskap = regnskap?.find((item: any) => item.year === 2024);
  const markerValue = latestRegnskap ? (latestRegnskap as any)[variableName] : undefined;

  if (markerValue === undefined || markerValue === null) {
    return null;
  }

  const { min, median, mean, max } = distData.stats;
  const format = (metricFormatter[selectedMetric] || 'numeric') as FormatterType;

  const formatDataValue = (value: number) => {
    return formatter(value, format);
  };

  const formattedMin = formatDataValue(min);
  const formattedMedian = formatDataValue(median);
  const formattedMean = formatDataValue(mean);
  const formattedMax = formatDataValue(max);

  const data = [
    { name: 'Nederste 5%', value: min, formattedValue: formattedMin },
    { name: 'Median', value: median, formattedValue: formattedMedian },
    { name: 'Gjennomsnitt', value: mean, formattedValue: formattedMean },
    { name: 'Øverste 5%', value: max, formattedValue: formattedMax },
  ];

  const formatYAxis = (value: number): string => {
    const formatted = formatter(value, format);
    return formatted.value.toString();
  };

  const formatTooltip = (value: number): string => {
    const dataItem = data.find(item => item.value === value);
    if (dataItem) {
      return dataItem.formattedValue.string;
    }
    const formatted = formatter(value, format);
    return formatted.string;
  };

  const formatLabel = (value: number): string => {
    const dataItem = data.find(item => item.value === value);
    if (dataItem) {
      return dataItem.formattedValue.string;
    }
    const formatted = formatter(value, format);
    return formatted.string;
  };

  const yAxisMax = Math.max(max, markerValue);

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 100, left: 20, bottom: 20 }}
          barCategoryGap="20%"
          barSize={60}
        >
          <XAxis
            dataKey="name"
            stroke={colors.black}
            tick={{ fill: colors.black, fontSize: 14 }}
            axisLine={{ stroke: colors.black, strokeWidth: 1 }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            stroke={colors.black}
            tick={{ fill: colors.black, fontSize: 14 }}
            axisLine={{ stroke: colors.black, strokeWidth: 1 }}
            domain={[0, yAxisMax]}
          />
          <Tooltip
            formatter={(value: number) => formatTooltip(value)}
            contentStyle={{
              backgroundColor: colors.white,
              border: `1px solid ${colors.black}`,
              borderRadius: '4px',
              fontSize: '14px',
              color: colors.black,
            }}
            cursor={{ fill: colors.baseRosa, opacity: 0.2 }}
          />
          <Bar
            dataKey="value"
            fill={colors.rosa}
            radius={[4, 4, 0, 0]}
            animationDuration={300}
          >
            <LabelList dataKey="value" formatter={(value: any) => formatLabel(Number(value))} position="top" fill={colors.black} fontSize={12} />
          </Bar>
          <ReferenceLine
            y={0}
            stroke={colors.black}
            strokeWidth={1}
            strokeDasharray="none"
          />
          <ReferenceLine
            y={markerValue}
            stroke={colors.orange}
            strokeWidth={2}
            label={{
              value: 'Ditt selskap',
              position: 'right',
              fill: colors.orange,
              fontSize: 12,
              fontWeight: 'bold',
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
