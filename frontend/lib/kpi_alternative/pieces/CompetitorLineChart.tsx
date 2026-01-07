'use client';

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
import { metricFormatter } from '@/lib/config/metricFormatter';

interface Props {
  data: Array<Record<string, number | string>>;
  metric: string;
  selectedCompanies: Array<{ navn: string }>;
}

export function CompetitorLineChart({
  data,
  metric,
  selectedCompanies,
}: Props) {
  if (!data.length) return null;

  const format = metricFormatter[metric] ?? 'numeric';

  const competitorColors = [
    '#f57f00',
    '#f9cfe3',
    '#3d357d',
    '#00544f',
    '#ffefc3',
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 20, right: 160, left: 20, bottom: 20 }}
      >
        <XAxis dataKey="year" />
        <YAxis
          tickFormatter={(v: number) =>
            formatter(v, format).string
          }
        />
        <Tooltip
          formatter={(v: number) =>
            formatter(v, format).string
          }
        />
        <ReferenceLine y={0} />

        {/* MAIN COMPANY */}
        <Line
          type="monotone"
          dataKey="value"
          stroke="#c9007f"
          strokeWidth={2}
          dot={{ r: 4 }}
        >
          <LabelList
            content={({ x, y, index }) =>
              index === data.length - 1 &&
              typeof x === 'number' &&
              typeof y === 'number' ? (
                <text
                  x={x + 5}
                  y={y}
                  fill="#c9007f"
                  fontSize={12}
                  textAnchor="start"
                >
                  Ditt selskap
                </text>
              ) : null
            }
          />
        </Line>

        {/* COMPETITORS */}
        {Object.keys(data[0])
          .filter(k => k.startsWith('competitor'))
          .map((key, i) => {
            const color =
              competitorColors[i % competitorColors.length];
            const name = selectedCompanies[i]?.navn;

            return (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                dot={{ r: 4 }}
              >
                <LabelList
                  content={({ x, y, index }) =>
                    index === data.length - 1 &&
                    typeof x === 'number' &&
                    typeof y === 'number' &&
                    name ? (
                      <text
                        x={x + 5}
                        y={y}
                        fill={color}
                        fontSize={12}
                        textAnchor="start"
                      >
                        {name}
                      </text>
                    ) : null
                  }
                />
              </Line>
            );
          })}
      </LineChart>
    </ResponsiveContainer>
  );
}
