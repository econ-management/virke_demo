import styles from './HistogramSectionSkeleton.module.css';

export const HistogramSectionSkeleton = () => {
  return (
    <div className={styles.container}>
      <div className={styles.titleSkeleton}></div>
      <div className={styles.chartSkeleton}></div>
    </div>
  );
};

