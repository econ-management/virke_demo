'use client';

import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  ReferenceLine,
  LabelList,
  CartesianGrid,
} from 'recharts';
import { formatter } from '../utils/formatter';

interface LineSeries {
  label: string;
  data: Array<{ x: number; y: number }>;
}

interface GeneralLineChartProps {
  series: LineSeries[];
  height?: number;
  showGrid?: boolean;
  showZeroLine?: boolean;
  format?: 'percentage' | 'monetary' | 'numeric';
  showLabel?: 'label' | 'last';
  title?: string;
}

export function GeneralLineChart({
  series,
  height = 300,
  showGrid = false,
  showZeroLine = true,
  format = 'numeric',
  showLabel = 'label',
  title,
}: GeneralLineChartProps) {
  const [colors, setColors] = useState({
    rosa: '#c9007f',
    orange: '#f57f00',
    black: '#000000',
    white: '#ffffff',
    baseRosa: '#f9cfe3',
    gray: '#cccccc',
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
        gray: '#cccccc',
      });
    }
  }, []);

  if (!series || series.length === 0) {
    return <p>Ingen data tilgjengelig.</p>;
  }

  // Automatic color palette
  const colorPalette = [
    colors.rosa,
    colors.orange,
    colors.baseRosa,
    '#4CAF50',
    '#2196F3',
    '#9C27B0',
    '#00BCD4',
    '#FFC107',
  ];

  // Combine all x values and create unified data structure
  const allXValues = new Set<number>();
  series.forEach(s => {
    s.data.forEach(point => allXValues.add(point.x));
  });
  const sortedXValues = Array.from(allXValues).sort((a, b) => a - b);

  // Create data array with all series values at each x point
  const chartData = sortedXValues.map(x => {
    const point: any = { x: x.toString() };
    series.forEach((s, index) => {
      const dataPoint = s.data.find(d => d.x === x);
      point[`y${index}`] = dataPoint?.y ?? null;
    });
    return point;
  });

  // Determine denomination for Y-axis label
  const getDenomination = (): string => {
    if (format === 'percentage') {
      return '';
    }
    if (format === 'monetary') {
      // Find max absolute value across all series to determine denomination
      let maxAbsValue = 0;
      series.forEach(s => {
        s.data.forEach(point => {
          const absValue = Math.abs(point.y);
          if (absValue > maxAbsValue) {
            maxAbsValue = absValue;
          }
        });
      });
      const formatted = formatter(maxAbsValue, 'monetary');
      return formatted.denomination;
    }
    return '';
  };

  const denomination = getDenomination();

  const formatYAxis = (value: number): string => {
    if (format === 'percentage') {
      const formatted = formatter(value, format);
      return formatted.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + '%';
    }
    const formatted = formatter(value, format);
    return formatted.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  const formatTooltip = (value: number): string => {
    const formatted = formatter(value, format);
    return formatted.string;
  };

  return (
    <div>
      {title && <h3 style={{ marginBottom: '10px', textAlign: 'center' }}>{title}</h3>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 20, right: 150, left: denomination ? 50 : 20, bottom: 20 }}>
        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke={colors.gray} opacity={0.3} />}
        <XAxis
          dataKey="x"
          stroke={colors.black}
          tick={{ fill: colors.black, fontSize: 14 }}
          axisLine={{ stroke: colors.black, strokeWidth: 1 }}
        />
        <YAxis
          tickFormatter={formatYAxis}
          stroke={colors.black}
          tick={{ fill: colors.black, fontSize: 14 }}
          axisLine={{ stroke: colors.black, strokeWidth: 1 }}
          label={denomination ? {
            value: denomination,
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle', fill: colors.black }
          } : undefined}
        />
        <Tooltip
          formatter={(value: number, name: string) => {
            if (value === null) return null;
            const index = parseInt(name.replace('y', ''), 10);
            const label = series[index]?.label || name;
            return [formatTooltip(value), label];
          }}
          labelFormatter={(label) => `År: ${label}`}
          contentStyle={{
            backgroundColor: colors.white,
            border: `1px solid ${colors.black}`,
            borderRadius: '4px',
            fontSize: '14px',
            color: colors.black,
          }}
          cursor={{ stroke: colors.baseRosa, strokeWidth: 1 }}
        />
        {showZeroLine && (
          <ReferenceLine y={0} stroke={colors.black} strokeWidth={1} />
        )}
        {series.map((s, index) => {
          const seriesColor = colorPalette[index % colorPalette.length];
          return (
            <Line
              key={s.label}
              type="monotone"
              dataKey={`y${index}`}
              stroke={seriesColor}
              strokeWidth={2}
              dot={{ fill: seriesColor, r: 4 }}
              animationDuration={300}
              connectNulls={false}
            >
              <LabelList
  dataKey={`y${index}`}
  position="right"
  content={(props: any) => {
    const { x, y, index: pointIndex, value } = props;
    if (
      x !== undefined &&
      y !== undefined &&
      pointIndex === chartData.length - 1 &&
      value !== null &&
      value !== undefined
    ) {
      const displayText = showLabel === 'last' ? formatTooltip(value) : s.label;
      return (
        <text
          x={x + 5}
          y={y}
          fill={seriesColor}
          fontSize={12}
          textAnchor="start"
        >
          {displayText}
        </text>
      );
    }
    return null;
  }}
/>
            </Line>
          );
        })}
      </LineChart>
    </ResponsiveContainer>
    </div>
  );
}