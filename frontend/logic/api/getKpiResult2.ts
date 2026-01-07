// lib/api/getKpiResult2.ts

export async function getKpiResult2(
  orgnr: string,
  metric: string
): Promise<{
  comp_by_nace_var: Record<string, any>;
  nace_dev_var: Record<string, any>;
}> {

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const params = new URLSearchParams({ metric });

  const response = await fetch(
    `${apiUrl}/api/kpi-result2/${orgnr}?${params.toString()}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error(`API error (kpi-result2): ${response.status}`);
  }

  return response.json();
}
