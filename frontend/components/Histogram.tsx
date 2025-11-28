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

export const Histogram = ({ data, title, xAxisFormat = 'numeric', markerValue }: HistogramProps) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return null;
  }

  const counts = data.map((bin) => bin.count || 0);
  const maxCount = counts.length > 0 ? Math.max(...counts) : 0;

  const minValue = data[0]?.bin_start || 0;
  const maxValue = data[data.length - 1]?.bin_end || 0;

  const formatXLabel = (value: number): string => {
    if (xAxisFormat === 'percentage') {
      const percentage = value * 100;
      return `${Math.round(percentage)}%`;
    }
    return Math.round(value).toString();
  };

  const labelCount = 8;
  const scaleLabels: Array<{ value: number; position: number }> = [];
  for (let i = 0; i <= labelCount; i++) {
    const ratio = i / labelCount;
    const scaledValue = minValue + (maxValue - minValue) * ratio;
    const position = (i / labelCount) * 100;
    scaleLabels.push({ value: scaledValue, position });
  }

  const getMarkerPosition = (): number | null => {
    if (markerValue === undefined || markerValue === null) return null;
    if (markerValue < minValue || markerValue > maxValue) return null;
    const ratio = (markerValue - minValue) / (maxValue - minValue);
    return ratio * 100;
  };

  const markerPosition = getMarkerPosition();

  return (
    <div className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.histogramWrapper}>
        <div className={styles.histogram}>
          {markerPosition !== null && (
            <div
              className={styles.marker}
              style={{ left: `${markerPosition}%` }}
            />
          )}
          {data.map((bin, index) => {
            const height = maxCount > 0 ? (bin.count / maxCount) * 100 : 0;
            const binLabel = `${formatXLabel(bin.bin_start)} - ${formatXLabel(bin.bin_end)}`;

            return (
              <div key={index} className={styles.barContainer}>
                <div
                  className={styles.bar}
                  style={{ height: `${height}%` }}
                  title={`${binLabel}: ${bin.count} bedrifter`}
                >
                  {bin.count > 0 && (
                    <span className={styles.count}>{bin.count}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className={styles.xAxis}>
          {scaleLabels.map((label, index) => (
            <span
              key={index}
              className={styles.xLabel}
              style={{ left: `${label.position}%` }}
            >
              {formatXLabel(label.value)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

