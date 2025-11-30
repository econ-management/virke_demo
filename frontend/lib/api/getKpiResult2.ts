export async function getKpiResult2(orgnr: string): Promise<{
  comp_by_nace_var: any;
  nace_dev_var: any;
}> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  const response = await fetch(`${apiUrl}/api/kpi-result2/${orgnr}`, {
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

