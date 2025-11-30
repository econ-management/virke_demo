import styles from './Table.module.css';
import { formatter } from '../lib/utils/formatter';

type FormatType = 'numeric' | 'percentage' | 'monetary';

interface TableProps {
  columns: string[];
  values: number[][];
  formats?: FormatType[];
}

export const Table = ({ columns, values, formats }: TableProps) => {
  const formatValue = (value: number, columnIndex: number): string => {
    const format = formats?.[columnIndex] || 'numeric';
    const result = formatter(value, format);
    return result.value.toString();
  };

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th className={styles.header}></th>
          {columns.map((column, index) => (
            <th key={index} className={styles.header}>
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {values.map((row, rowIndex) => {
          const lastValue = row.length > 0 ? row[row.length - 1] : 0;
          const lastFormat = formats && formats.length > 0 ? formats[formats.length - 1] : 'numeric';
          const lastResult = formatter(lastValue, lastFormat);
          
          return (
            <tr key={rowIndex}>
              <td className={styles.cell}>{lastResult.denomination}</td>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={styles.cell}>
                  {formatValue(cell, cellIndex)}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

