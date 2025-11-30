import { ReactNode } from 'react';
import styles from './MainSection.module.css';

interface MainSectionProps {
  children: ReactNode;
}

export const MainSection = ({ children }: MainSectionProps) => {
  return <main className={styles.main}>{children}</main>;
};

