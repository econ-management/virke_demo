export async function getRegnskapOrgnr(orgnr: string): Promise<Array<{
  orgnr: number;
  year: number;
  [key: string]: number | string;
}>> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  console.log(`getRegnskapOrgnr: Fetching from ${apiUrl}/api/regnskap/${orgnr}`);
  
  try {
    const response = await fetch(`${apiUrl}/api/regnskap/${orgnr}`, {
      cache: 'no-store',
    });
    console.log(`getRegnskapOrgnr: Response status: ${response.status}`);
    
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

