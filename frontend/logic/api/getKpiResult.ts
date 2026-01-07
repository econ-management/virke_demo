export async function getKpiResult(orgnr: string): Promise<{
  regnskap: any[];
  brreg: any[];
}> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const response = await fetch(`${apiUrl}/api/kpi-result/${orgnr}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

