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

interface StatsBarChartProps {
  min: number;
  median: number;
  mean: number;
  max: number;
  markerValue: number;
  format: 'percentage' | 'numeric';
}

const formatLargeNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)} mrd. kr`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)} mill. kr`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)} tus. kr`;
  }
  return num.toFixed(0);
};

export const StatsBarChart = ({ min, median, mean, max, markerValue, format }: StatsBarChartProps) => {
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
  const data = [
    { name: 'Min', value: min },
    { name: 'Median', value: median },
    { name: 'Gjennomsnitt', value: mean },
    { name: 'Max', value: max },
  ];

  const formatYAxis = (value: number): string => {
    if (format === 'percentage') {
      return `${Math.round(value * 100)}`;
    }
    return Math.round(value).toString();
  };

  const formatTooltip = (value: number): string => {
    if (format === 'percentage') {
      return `${(value * 100).toFixed(1)}%`;
    }
    return formatLargeNumber(value);
  };

  const formatLabel = (value: number): string => {
    if (format === 'percentage') {
      return `${(value * 100).toFixed(1)}%`;
    }
    return formatLargeNumber(value);
  };

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
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
            label={{ value: 'Din verdi', position: 'right', fill: colors.orange, fontSize: 12 }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

