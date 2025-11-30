export async function preloadKpiData2(orgnr: string): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
  await fetch(`${apiUrl}/api/kpi-preload2/${orgnr}`, {
    cache: 'no-store',
  });
}

