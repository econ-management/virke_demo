import styles from './CompanyInfo.module.css';

interface CompanyInfoProps {
  orgnr?: string;
  firmanavn?: string;
  naringskode?: string;
  naringskodeBeskrivelse?: string;
  ansatte?: number;
  omsetningAar?: number;
  omsetning?: number;
  driftsmarginAar?: number;
  driftsmargin?: number;
}

export const CompanyInfo = ({
  orgnr,
  firmanavn,
  naringskode,
  naringskodeBeskrivelse,
  ansatte,
  omsetningAar,
  omsetning,
  driftsmarginAar,
  driftsmargin,
}: CompanyInfoProps) => {
  return (
    <div className={styles.container}>
      <div className={styles.field}>
        <span className={styles.label}>Orgnr:</span>
        <span className={styles.value}>{orgnr || '(value)'}</span>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Firmanavn:</span>
        <span className={styles.value}>{firmanavn || '(value)'}</span>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Næringskode:</span>
        <span className={styles.value}>{naringskode || 'value'}</span>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Næringskode beskrivelse:</span>
        <span className={styles.value}>{naringskodeBeskrivelse || 'value'}</span>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Ansatte:</span>
        <span className={styles.value}>{ansatte !== undefined ? ansatte : 'value'}</span>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Omsetning i {omsetningAar || '(value)'}:</span>
        <span className={styles.value}>
          {omsetning !== undefined 
            ? `${(omsetning / 1000000).toFixed(1)} mrd. kr`
            : 'value'
          }
        </span>
      </div>
      <div className={styles.field}>
        <span className={styles.label}>Driftsmargin i {driftsmarginAar || '(value)'}:</span>
        <span className={styles.value}>
          {driftsmargin !== undefined 
            ? `${(driftsmargin * 100).toFixed(1)}%`
            : 'value'
          }
        </span>
      </div>
    </div>
  );
};

