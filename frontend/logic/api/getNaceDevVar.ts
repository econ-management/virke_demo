'use client';
import { kpiOptionMapper } from '../../lib/config/kpiOptionMapper';

export interface Stats {
  min: number;
  max: number;
  mean: number;
  median: number;
  std: number;
}

export interface Dist {
  density: {
    density: Array<{x: number; density: number}>;
  };
  stats: Stats;
}

export async function getNaceDevVar(
  nace: string,
  variableString: string
): Promise<{
  [key: string]: Dist;
}> {
  const mapping = kpiOptionMapper[variableString];
  
  if (!mapping) {
    throw new Error(`No mapping found for: ${variableString}`);
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  // Build request body
  const requestBody = {
    variable_names: mapping.variable_names_comp,
    calculations: [mapping.calculations_comp],
  };

  try {
    const response = await fetch(`${apiUrl}/api/nace_dev_var/${nace}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error fetching nace dev var data:", err);
    throw err;
  }
}
  
  