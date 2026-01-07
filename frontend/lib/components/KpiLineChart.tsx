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
import { formatter } from '../utils/formatter';
import { getVariableName } from '../config/kpiOptionMapper';
import { metricFormatter } from '../config/metricFormatter';

interface KpiLineChartProps {
  regnskap: Array<{
    year: number;
    [key: string]: number | string;
  }>;
  metric: string | null;
  naceDevData?: {
    [key: string]: {
      [year: number]: {
        min: number;
        max: number;
        median: number;
        mean: number;
      };
    };
  } | null;
}

export const KpiLineChart = ({ regnskap, metric, naceDevData }: KpiLineChartProps) => {
  if (!metric) {
    return null;
  }
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

  if (!regnskap || regnskap.length === 0) {
    return <p>Ingen regnskapsdata tilgjengelig.</p>;
  }

  const variableName = getVariableName(metric);
  const format = metricFormatter[metric] || 'numeric';

  const getMetricValue = (item: any): number => {
    if (!variableName) return 0;
    return item[variableName] || 0;
  };

  const data = regnskap.map((item) => {
    const yearData: any = {
      year: item.year.toString(),
      value: getMetricValue(item),
    };

    if (naceDevData && naceDevData[metric] && naceDevData[metric][item.year]) {
      const stats = naceDevData[metric][item.year];
      yearData.median = stats.median;
      yearData.mean = stats.mean;
    }

    return yearData;
  }).reverse();

  const formatYAxis = (value: number): string => {
    if (format === 'percentage') {
      return `${Math.round(value * 100)}`;
    }
    const formatted = formatter(value, format);
    return formatted.string;
  };

  const formatTooltip = (value: number): string => {
    const formatted = formatter(value, format);
    return formatted.string;
  };

  return (
    <>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
        data={data}
        margin={{ top: 20, right: 150, left: 20, bottom: 20 }}
      >
        <XAxis
          dataKey="year"
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
          cursor={{ stroke: colors.baseRosa, strokeWidth: 1 }}
        />
        <ReferenceLine
          y={0}
          stroke={colors.black}
          strokeWidth={1}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke={colors.rosa}
          strokeWidth={2}
          dot={{ fill: colors.rosa, r: 4 }}
          animationDuration={300}
        >
          <LabelList
            dataKey="value"
            position="right"
            content={(props: any) => {
              const { x, y, payload, index } = props;
              if (x !== undefined && y !== undefined && index === data.length - 1) {
                return (
                  <text
                    x={x + 5}
                    y={y}
                    fill={colors.rosa}
                    fontSize={12}
                    textAnchor="start"
                  >
                    Ditt selskap
                  </text>
                );
              }
              return null;
            }}
          />
        </Line>
        {naceDevData && naceDevData[metric] && (
          <>
            <Line
              type="monotone"
              dataKey="median"
              stroke={colors.orange}
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            >
              <LabelList
                dataKey="median"
                position="right"
                content={(props: any) => {
                  const { x, y, payload, index } = props;
                  if (x !== undefined && y !== undefined && index === data.length - 1) {
                    return (
                      <text
                        x={x + 5}
                        y={y}
                        fill={colors.orange}
                        fontSize={12}
                        textAnchor="start"
                      >
                        Median
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Line>
            <Line
              type="monotone"
              dataKey="mean"
              stroke={colors.baseRosa}
              strokeWidth={2}
              dot={false}
              animationDuration={300}
            >
              <LabelList
                dataKey="mean"
                position="right"
                content={(props: any) => {
                  const { x, y, payload, index } = props;
                  if (x !== undefined && y !== undefined && index === data.length - 1) {
                    return (
                      <text
                        x={x + 5}
                        y={y}
                        fill={colors.baseRosa}
                        fontSize={12}
                        textAnchor="start"
                      >
                        Gjennomsnitt
                      </text>
                    );
                  }
                  return null;
                }}
              />
            </Line>
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
    </>
  );
};

