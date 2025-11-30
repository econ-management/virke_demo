import styles from './TableSectionSkeleton.module.css';

export const TableSectionSkeleton = () => {
  return (
    <div className={styles.container}>
      <div className={styles.skeleton}></div>
    </div>
  );
};

