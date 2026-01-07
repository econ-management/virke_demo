import { ReactNode } from 'react';
import styles from './TwoColumnSection.module.css';

interface TwoColumnSectionProps {
  children: ReactNode;
  stackUntilDesktop?: boolean;
}

export const TwoColumnSection = ({ children, stackUntilDesktop }: TwoColumnSectionProps) => {
  const className = stackUntilDesktop 
    ? `${styles.twoColumn} ${styles.twoColumnStackUntilDesktop}` 
    : styles.twoColumn;
  return <section className={className}>{children}</section>;
};

