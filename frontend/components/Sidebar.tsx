import Link from 'next/link';
import styles from './Sidebar.module.css';

export const Sidebar = () => {
  return (
    <aside className={styles.sidebar}>
      <nav className={styles.nav}>
        <Link href="/kpi" className={styles.navLink}>
          KPI
        </Link>
        <Link href="/vekst" className={styles.navLink}>
          Vekst
        </Link>
        <Link href="/effektivisering" className={styles.navLink}>
          Effektivisering
        </Link>
      </nav>
    </aside>
  );
};

