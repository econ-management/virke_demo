import { getBrregDataOrgnr } from '../api/getBrregDataOrgnr';
import { getRegnskapOrgnr } from '../api/getRegnskapOrgnr';
import { CompanyInfo } from '../../components/CompanyInfo';

interface SidebarCompanyInfoProps {
  orgnr: string;
}

export async function SidebarCompanyInfo({ orgnr }: SidebarCompanyInfoProps) {
  if (!orgnr) {
    return <CompanyInfo />;
  }

  try {
    const [brregData, regnskapData] = await Promise.all([
      getBrregDataOrgnr(orgnr),
      getRegnskapOrgnr(orgnr),
    ]);

    const brreg = brregData && brregData.length > 0 ? brregData[0] : null;
    
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
        orgnr={formatOrgnr(brreg?.orgnr || parseInt(orgnr))}
        firmanavn={brreg?.navn}
        naringskode={brreg?.naring1_kode}
        naringskodeBeskrivelse={brreg?.naring1_beskrivelse}
        ansatte={brreg?.ansatte}
        omsetningAar={latestRegnskap?.year}
        omsetning={latestRegnskap?.omsetning}
        driftsmarginAar={latestRegnskap?.year}
        driftsmargin={latestRegnskap?.driftsmargin}
      />
    );
  } catch (error) {
    console.error('Error fetching sidebar data:', error);
    return <CompanyInfo />;
  }
}

