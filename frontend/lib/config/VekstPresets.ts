// lib/config/vekstPresets.ts

export const vekstPresets: Record<
  string,
  Record<string, number>
> = {
  lav: {
    omsetning: 1,
    varekostnad: 0.5,
    lonnskostnader: 0.5,
    andre_driftskostnader: 0.5,
  },
  middels: {
    omsetning: 3,
    varekostnad: 1.5,
    lonnskostnader: 1.5,
    andre_driftskostnader: 1.5,
  },
  høy: {
    omsetning: 6,
    varekostnad: 3,
    lonnskostnader: 3,
    andre_driftskostnader: 3,
  },
};
