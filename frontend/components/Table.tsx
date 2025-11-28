import styles from './Table.module.css';

type FormatType = 'numeric' | 'percentage';

interface TableProps {
  columns: string[];
  values: number[][];
  formats?: FormatType[];
}

export const Table = ({ columns, values, formats }: TableProps) => {
  const calculateAverage = (row: number[]): number => {
    if (row.length === 0) return 0;
    const sum = row.reduce((acc, val) => acc + val, 0);
    return sum / row.length;
  };

  const formatValue = (value: number, columnIndex: number): string => {
    const format = formats?.[columnIndex] || 'numeric';

    if (format === 'percentage') {
      return `${(value * 100).toFixed(1)}%`;
    }

    if (format === 'numeric') {
      if (value >= 1000000000) {
        return `${(value / 1000000000).toFixed(1)} mrd. kr`;
      } else if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)} mill. kr`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(1)} tusen kr`;
      }
      const isInteger = Number.isInteger(value);
      return isInteger ? value.toString() : value.toFixed(2);
    }

    const isInteger = Number.isInteger(value);
    return isInteger ? value.toString() : value.toFixed(2);
  };

  const formatAverage = (average: number, row: number[]): string => {
    if (row.length === 0) return '0';
    const format = formats?.[0] || 'numeric';
    
    if (format === 'percentage') {
      return `${(average * 100).toFixed(1)}%`;
    }
    
    if (format === 'numeric') {
      if (average >= 1000000000) {
        return `${(average / 1000000000).toFixed(1)} mrd. kr`;
      } else if (average >= 1000000) {
        return `${(average / 1000000).toFixed(1)} mill. kr`;
      } else if (average >= 1000) {
        return `${(average / 1000).toFixed(1)} tusen kr`;
      }
      return average.toFixed(2);
    }
    
    return average.toFixed(2);
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} className={styles.header}>
              {column}
            </th>
          ))}
          <th className={styles.header}>Gj.snitt</th>
        </tr>
      </thead>
      <tbody>
        {values.map((row, rowIndex) => {
          const average = calculateAverage(row);
          return (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={styles.cell}>
                  {formatValue(cell, cellIndex)}
                </td>
              ))}
              <td className={styles.cell}>{formatAverage(average, row)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

