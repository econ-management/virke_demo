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
} from 'recharts';
import styles from './Histogram.module.css';

interface HistogramBin {
  bin_start: number;
  bin_end: number;
  count: number;
}

interface HistogramProps {
  data: HistogramBin[];
  title?: string;
  xAxisFormat?: 'numeric' | 'percentage';
  markerValue?: number;
}

const calculateNiceInterval = (min: number, max: number): number => {
  const range = max - min;
  if (range === 0) return 1;
  
  const roughInterval = range / 5;
  const magnitude = Math.pow(10, Math.floor(Math.log10(roughInterval)));
  const normalized = roughInterval / magnitude;
  
  let niceInterval;
  if (normalized <= 1) {
    niceInterval = 1;
  } else if (normalized <= 2) {
    niceInterval = 2;
  } else if (normalized <= 5) {
    niceInterval = 5;
  } else {
    niceInterval = 10;
  }
  
  return niceInterval * magnitude;
};

const generateYTicks = (min: number, max: number): number[] => {
  const interval = calculateNiceInterval(min, max);
  const start = Math.floor(min / interval) * interval;
  const end = Math.ceil(max / interval) * interval;
  const ticks: number[] = [];
  
  for (let tick = start; tick <= end; tick += interval) {
    ticks.push(Math.round(tick));
  }
  
  return ticks;
};

export const Histogram = ({ data, title, xAxisFormat = 'numeric', markerValue }: HistogramProps) => {
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
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const chartData = data.map((bin) => ({
    binMid: (bin.bin_start + bin.bin_end) / 2,
    bin_start: bin.bin_start,
    bin_end: bin.bin_end,
    count: bin.count || 0,
  }));

  const formatXLabel = (value: number): string => {
    if (xAxisFormat === 'percentage') {
      const percentage = value * 100;
      return `${Math.round(percentage)}%`;
    }
    return Math.round(value).toString();
  };

  const formatTooltip = (value: number, name: string, props: any): string => {
    if (name === 'count') {
      return `${value} bedrifter`;
    }
    return formatXLabel(value);
  };

  const counts = chartData.map((d) => d.count);
  const yMin = 0;
  const yMax = Math.max(...counts);
  const yTicks = generateYTicks(yMin, yMax);

  return (
    <div className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
          barCategoryGap={2}
        >
          <XAxis
            dataKey="binMid"
            tickFormatter={formatXLabel}
            stroke={colors.black}
            tick={{ fill: colors.black, fontSize: 14 }}
            axisLine={{ stroke: colors.black, strokeWidth: 1 }}
          />
          <YAxis
            ticks={yTicks}
            stroke={colors.black}
            tick={{ fill: colors.black, fontSize: 14 }}
            axisLine={{ stroke: colors.black, strokeWidth: 1 }}
            domain={[0, 'dataMax']}
          />
          <Tooltip
            formatter={formatTooltip}
            labelFormatter={(value) => {
              const bin = chartData.find((d) => d.binMid === value);
              if (bin) {
                return `${formatXLabel(bin.bin_start)} - ${formatXLabel(bin.bin_end)}`;
              }
              return formatXLabel(value);
            }}
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
            dataKey="count"
            fill={colors.rosa}
            radius={[4, 4, 0, 0]}
            animationDuration={300}
          />
          {markerValue !== undefined && markerValue !== null && (
            <ReferenceLine
              x={markerValue}
              stroke={colors.orange}
              strokeWidth={2}
              label={{ value: 'Din verdi', position: 'top', fill: colors.orange, fontSize: 12 }}
            />
          )}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

