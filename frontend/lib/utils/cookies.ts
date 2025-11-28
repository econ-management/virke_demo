export const clearSelectedOrgnr = (): void => {
  document.cookie = 'selectedOrgnr=; path=/; max-age=0';
};

export const setSelectedOrgnr = (orgnr: number): void => {
  document.cookie = `selectedOrgnr=${orgnr}; path=/; max-age=3600`;
};

