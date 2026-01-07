export async function preloadKpiDataFull(orgnr: string): Promise<void> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // fail fast after 8 sec

  try {
    const response = await fetch(`${apiUrl}/api/kpi-preload-full/${orgnr}`, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Preload-full failed: ${response.status}`);
    }

    // We ignore returned JSON because preload-full only returns status messages
    await response.json();

  } catch (err: any) {
    if (err.name === "AbortError") {
      console.error("Preload-full timed out");
      return;
    }
    console.error("Error calling preload-full:", err);
  } finally {
    clearTimeout(timeout);
  }
}
