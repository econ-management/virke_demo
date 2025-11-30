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

interface CompanyLineChartProps {
  regnskap: Array<{
    year: number;
    [key: string]: number | string;
  }>;
  metric: string;
  sammenligne_selskaper?: {
    [index: number]: Array<{
      orgnr: number;
      year: number;
      [key: string]: number | string;
    }>;
  };
  selectedCompanies?: Array<{ orgnr: number; navn: string }>;
}

export const CompanyLineChart = ({ regnskap, metric, sammenligne_selskaper, selectedCompanies }: CompanyLineChartProps) => {
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
    return null;
  }

  const variableName = getVariableName(metric);
  const format = metricFormatter[metric] || 'numeric';

  const getMetricValue = (item: any): number => {
    if (!variableName) return 0;
    return item[variableName] || 0;
  };

  const allYears = new Set<number>();
  regnskap.forEach((item) => allYears.add(item.year));
  if (sammenligne_selskaper) {
    Object.values(sammenligne_selskaper).forEach((regnskapData) => {
      regnskapData.forEach((item) => allYears.add(item.year));
    });
  }
  const sortedYears = Array.from(allYears).sort();

  const data = sortedYears.map((year) => {
    const dataPoint: any = {
      year: year.toString(),
      value: 0,
    };

    const mainItem = regnskap.find((item) => item.year === year);
    if (mainItem) {
      dataPoint.value = getMetricValue(mainItem);
    }

    if (sammenligne_selskaper) {
      Object.keys(sammenligne_selskaper).forEach((indexStr) => {
        const index = parseInt(indexStr, 10);
        const competitorRegnskap = sammenligne_selskaper[index];
        const competitorItem = competitorRegnskap.find((item) => item.year === year);
        if (competitorItem) {
          dataPoint[`competitor${index}`] = getMetricValue(competitorItem);
        }
      });
    }

    return dataPoint;
  });

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
    <div style={{ width: '100%', marginTop: '40px' }}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          margin={{ top: 20, right: 200, left: 20, bottom: 20 }}
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
                const { x, y, payload, index: dataIndex } = props;
                if (x !== undefined && y !== undefined && dataIndex === data.length - 1) {
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
          {sammenligne_selskaper &&
            Object.keys(sammenligne_selskaper).map((indexStr) => {
              const index = parseInt(indexStr, 10);
              const competitorColors = [
                colors.orange,
                colors.baseRosa,
                '#3d357d',
                '#00544f',
                '#ffefc3',
              ];
              const competitorColor = competitorColors[index % competitorColors.length];
              const competitorName = selectedCompanies && selectedCompanies[index] ? selectedCompanies[index].navn : '';
              return (
                <Line
                  key={`competitor${index}`}
                  type="monotone"
                  dataKey={`competitor${index}`}
                  stroke={competitorColor}
                  strokeWidth={2}
                  dot={{ fill: competitorColor, r: 4 }}
                  animationDuration={300}
                >
                  <LabelList
                    dataKey={`competitor${index}`}
                    position="right"
                    content={(props: any) => {
                      const { x, y, payload, index: dataIndex } = props;
                      if (x !== undefined && y !== undefined && dataIndex === data.length - 1 && competitorName) {
                        return (
                          <text
                            x={x + 5}
                            y={y}
                            fill={competitorColor}
                            fontSize={12}
                            textAnchor="start"
                          >
                            {competitorName}
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
};

