import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/">
          <Image
            src="/branding/logos/Virke_hovedlogo_positiv_RGB.svg"
            alt="Virke logo"
            width={120}
            height={40}
            className={styles.logo}
          />
        </Link>
        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Landingsside
          </Link>
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
      </div>
    </header>
  );
};

