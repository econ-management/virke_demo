export interface HistogramBin {
  bin_start: number;
  bin_end: number;
  count: number;
}

export interface Stats {
  min: number;
  max: number;
  mean: number;
  median: number;
  std: number;
}

export interface Dist {
  hist: HistogramBin[];
  stats: Stats;
}

export async function getCompByNace(
  nace: string
): Promise<{
  driftsmargin: Dist;
  omsetning: Dist;
}> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  try {
    const response = await fetch(`${apiUrl}/api/comp_by_nace/${nace}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching comp by nace data:", err);
    throw err;
  }
}

