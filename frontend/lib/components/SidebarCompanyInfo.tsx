import { getBrregDataOrgnr } from '../api/getBrregDataOrgnr';
import { getRegnskapOrgnr } from '../api/getRegnskapOrgnr';
import { CompanyInfo } from '../../components/CompanyInfo';

interface SidebarCompanyInfoProps {
  orgnr: string;
  brreg?: any[];
  regnskap?: any[];
}

export async function SidebarCompanyInfo({ orgnr, brreg, regnskap }: SidebarCompanyInfoProps) {
  if (!orgnr) {
    return <CompanyInfo />;
  }

  let brregData = brreg;
  let regnskapData = regnskap;

  if (!brregData || !regnskapData) {
    try {
      const [fetchedBrreg, fetchedRegnskap] = await Promise.all([
        getBrregDataOrgnr(orgnr),
        getRegnskapOrgnr(orgnr),
      ]);
      brregData = fetchedBrreg;
      regnskapData = fetchedRegnskap;
    } catch (error) {
      console.error('Error fetching sidebar data:', error);
      return <CompanyInfo />;
    }
  }

  const brregItem = brregData && brregData.length > 0 ? brregData[0] : null;
    
  const latestRegnskap = regnskapData && regnskapData.length > 0
    ? regnskapData.reduce((latest, current) => 
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

