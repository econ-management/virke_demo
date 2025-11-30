import { ReactNode } from 'react';
import styles from './TwoColumnSection.module.css';

interface TwoColumnSectionProps {
  children: ReactNode;
}

export const TwoColumnSection = ({ children }: TwoColumnSectionProps) => {
  return <section className={styles.twoColumn}>{children}</section>;
};

