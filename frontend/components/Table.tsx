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
    const isInteger = Number.isInteger(value);

    if (format === 'percentage') {
      return `${(value * 100).toFixed(1)}%`;
    }

    return isInteger ? value.toString() : value.toFixed(2);
  };

  const formatAverage = (average: number, row: number[]): string => {
    if (row.length === 0) return '0';
    const format = formats?.[0] || 'numeric';
    
    if (format === 'percentage') {
      return `${(average * 100).toFixed(1)}%`;
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

