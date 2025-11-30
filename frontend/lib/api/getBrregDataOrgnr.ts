export async function getBrregDataOrgnr(orgnr: string): Promise<{
    orgnr: number;
    navn: string;
    naring1_kode: string;
    naring1_beskrivelse: string;
    ansatte: number;
    kommune: string;
    siste_regnsk: number;
    naring1_kode_s2: string;
  }[]> {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    console.log(`getBrregDataOrgnr: Fetching from ${apiUrl}/api/brreg_data/${orgnr}`);
    
    try {
      const response = await fetch(`${apiUrl}/api/brreg_data/${orgnr}`, {
        cache: 'no-store',
      });
      console.log(`getBrregDataOrgnr: Response status: ${response.status}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          return [];
        }
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error fetching regnskap:', error);
      throw error;
    }
  }
  
  