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
} from 'recharts';

import { formatter } from '@/lib/utils/formatter';
import { getVariableName } from '@/lib/config/kpiOptionMapper';
import { metricFormatter } from '@/lib/config/metricFormatter';

interface NaceLineChartProps {
  regnskap: Array<{
    year: number;
    [key: string]: number | string;
  }>;
  metric: string | null;
  naceDevData?: {
    [metric: string]: {
      [year: number]: {
        min: number;
        max: number;
        median: number;
        mean: number;
      };
    };
  } | null;
}

export function NaceLineChart({
  regnskap,
  metric,
  naceDevData,
}: NaceLineChartProps) {
  if (!metric) return null;

  const [colors, setColors] = useState({
    rosa: '#c9007f',
    orange: '#f57f00',
    black: '#000000',
    white: '#ffffff',
    baseRosa: '#f9cfe3',
  });

  useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    setColors({
      rosa: root.getPropertyValue('--color-signature-rosa').trim() || '#c9007f',
      orange: root.getPropertyValue('--color-signature-orange').trim() || '#f57f00',
      black: root.getPropertyValue('--color-text-black').trim() || '#000000',
      white: root.getPropertyValue('--color-white').trim() || '#ffffff',
      baseRosa: root.getPropertyValue('--color-base-rosa').trim() || '#f9cfe3',
    });
  }, []);

  if (!regnskap.length) {
    return <p>Ingen regnskapsdata tilgjengelig.</p>;
  }

  const variableName = getVariableName(metric);
  const format = metricFormatter[metric] ?? 'numeric';

  const getMetricValue = (item: any): number =>
    variableName ? Number(item[variableName] ?? 0) : 0;

  const data = regnskap
    .map(item => {
      const yearData: any = {
        year: item.year.toString(),
        value: getMetricValue(item),
      };

      const stats = naceDevData?.[metric]?.[item.year];
      if (stats) {
        yearData.median = stats.median;
        yearData.mean = stats.mean;
      }

      return yearData;
    })
    .reverse();

  const formatYAxis = (value: number) =>
    format === 'percentage'
      ? `${Math.round(value * 100)}`
      : formatter(value, format).string;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 150, left: 20, bottom: 20 }}
      >
        <XAxis
          dataKey="year"
          stroke={colors.black}
          tick={{ fill: colors.black, fontSize: 14 }}
        />
        <YAxis
          stroke={colors.black}
          tick={{ fill: colors.black, fontSize: 14 }}
          tickFormatter={formatYAxis}
        />
        <Tooltip
          formatter={(value: number) => formatter(value, format).string}
          contentStyle={{
            backgroundColor: colors.white,
            border: `1px solid ${colors.black}`,
            borderRadius: 4,
            fontSize: 14,
          }}
          cursor={{ stroke: colors.baseRosa, strokeWidth: 1 }}
        />
        <ReferenceLine y={0} stroke={colors.black} />

        {/* Company line */}
        <Line
          type="monotone"
          dataKey="value"
          stroke={colors.rosa}
          strokeWidth={2}
          dot={{ fill: colors.rosa, r: 4 }}
        >
          <LabelList
            content={({ x, y, index }) =>
              index === data.length - 1 &&
              typeof x === 'number' &&
              typeof y === 'number' ? (
                <text
                  x={x + 5}
                  y={y}
                  fill={colors.rosa}
                  fontSize={12}
                  textAnchor="start"
                >
                  Ditt selskap
                </text>
              ) : null
            }
          />
        </Line>

        {/* NACE median */}
        {naceDevData?.[metric] && (
          <>
            <Line
              type="monotone"
              dataKey="median"
              stroke={colors.orange}
              strokeWidth={2}
              dot={false}
            >
              <LabelList
                content={({ x, y, index }) =>
                  index === data.length - 1 &&
                  typeof x === 'number' &&
                  typeof y === 'number' ? (
                    <text
                      x={x + 5}
                      y={y}
                      fill={colors.orange}
                      fontSize={12}
                      textAnchor="start"
                    >
                      Median
                    </text>
                  ) : null
                }
              />
            </Line>

            {/* NACE mean */}
            <Line
              type="monotone"
              dataKey="mean"
              stroke={colors.baseRosa}
              strokeWidth={2}
              dot={false}
            >
              <LabelList
                content={({ x, y, index }) =>
                  index === data.length - 1 &&
                  typeof x === 'number' &&
                  typeof y === 'number' ? (
                    <text
                      x={x + 5}
                      y={y}
                      fill={colors.baseRosa}
                      fontSize={12}
                      textAnchor="start"
                    >
                      Gjennomsnitt
                    </text>
                  ) : null
                }
              />
            </Line>
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
