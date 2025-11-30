import styles from './DensityPlotSectionSkeleton.module.css';

export const DensityPlotSectionSkeleton = () => {
  return (
    <div className={styles.container}>
      <div className={styles.titleSkeleton}></div>
      <div className={styles.chartSkeleton}></div>
    </div>
  );
};

