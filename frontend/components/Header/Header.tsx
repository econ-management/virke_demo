'use client';

import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Header.module.css';

export const Header = () => {
  const searchParams = useSearchParams();
  const orgnr = searchParams?.get('orgnr') || null;
  const queryString = orgnr ? `?orgnr=${orgnr}` : '';

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
          <Link href={`/kpi${queryString}`} className={styles.navLink}>
            Nøkkeltall
          </Link>
          <Link href={`/prognoser${queryString}`} className={styles.navLink}>
            Prognoser
          </Link>
          
            TBD
          
        </nav>
      </div>
    </header>
  );
};

