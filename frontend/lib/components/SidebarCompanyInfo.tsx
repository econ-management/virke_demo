import { CompanyInfo } from '../../components/CompanyInfo';

interface SidebarCompanyInfoProps {
  orgnr: string;
  brreg?: any[];
  regnskap?: any[];
}

export function SidebarCompanyInfo({
  orgnr,
  brreg,
  regnskap,
}: SidebarCompanyInfoProps) {
  if (!orgnr) return <CompanyInfo />;

  // No fetching allowed: if data isn't provided, show empty state
  if (!brreg || !regnskap) return <CompanyInfo />;

  const brregItem = brreg.length > 0 ? brreg[0] : null;

  const latestRegnskap =
    regnskap.length > 0
      ? regnskap.reduce((latest, current) =>
          current.year > latest.year ? current : latest
        )
      : null;

  const formatOrgnr = (orgnrNum: number | undefined): string => {
    if (!orgnrNum) return '(value)';
    return orgnrNum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };

  return (
    <CompanyInfo
      orgnr={formatOrgnr(brregItem?.orgnr || parseInt(orgnr))}
      firmanavn={brregItem?.navn}
      naringskode={brregItem?.naring1_kode}
      naringskodeBeskrivelse={brregItem?.naring1_beskrivelse}
      ansatte={brregItem?.ansatte}
      omsetningAar={latestRegnskap?.year}
      omsetning={latestRegnskap?.omsetning}
      driftsmarginAar={latestRegnskap?.year}
      driftsmargin={latestRegnskap?.driftsmargin}
    />
  );
}
