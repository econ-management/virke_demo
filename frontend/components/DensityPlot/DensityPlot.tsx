'use client';

import { useEffect, useState } from 'react';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from 'recharts';
import styles from './DensityPlot.module.css';
import { formatter, FormatterType } from '../../lib/utils/formatter';

interface DensityPlotProps {
  data: Array<{x: number; density: number}>;
  title?: string;
  xAxisFormat?: FormatterType;
  markerValue?: number;
  showTitle?: boolean;
}

export const DensityPlot = ({ data, title, xAxisFormat = 'numeric', markerValue, showTitle = true }: DensityPlotProps) => {
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

  const formatXLabel = (value: number): string => {
    const formatted = formatter(value, xAxisFormat || 'numeric');
    return formatted.string;
  };

  const formatTooltip = (value: number): string => {
    const formatted = formatter(value, xAxisFormat || 'numeric');
    return formatted.string;
  };

  if (markerValue != null) {
    console.log('DensityPlot markerValue:', markerValue, 'Data range:', data.length > 0 ? { min: Math.min(...data.map(d => d.x)), max: Math.max(...data.map(d => d.x)) } : 'no data');
  }

  return (
    <div className={styles.container}>
      {showTitle && title && <h3 className={styles.title}>{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
        >
          <XAxis
            dataKey="x"
            tickFormatter={formatXLabel}
            stroke={colors.black}
            tick={{ fill: colors.black, fontSize: 14 }}
            axisLine={{ stroke: colors.black, strokeWidth: 1 }}
          />
          <YAxis
            dataKey="density"
            stroke={colors.black}
            tick={false}
            axisLine={{ stroke: colors.black, strokeWidth: 1 }}
            domain={[0, 'dataMax']}
            label={{ value: 'Andel av selskaper', angle: -90, position: 'insideLeft', fill: colors.black, fontSize: 14 }}
          />
          <Tooltip
            formatter={(value: number) => formatTooltip(value)}
            labelFormatter={(value: number) => formatXLabel(value)}
            contentStyle={{
              backgroundColor: colors.white,
              border: `1px solid ${colors.black}`,
              borderRadius: '4px',
              fontSize: '14px',
              color: colors.black,
            }}
            cursor={{ stroke: colors.baseRosa, strokeWidth: 1 }}
          />
          {markerValue != null && (
            <ReferenceLine
              x={markerValue}
              stroke={colors.orange}
              strokeWidth={2}
              label={{
                value: 'Ditt selskap',
                position: 'left',
                fill: colors.orange,
                fontSize: 12,
                fontWeight: 'bold',
              }}
            />
          )}
          <Area
            type="monotone"
            dataKey="density"
            fill={colors.rosa}
            stroke={colors.rosa}
            strokeWidth={2}
            animationDuration={300}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

