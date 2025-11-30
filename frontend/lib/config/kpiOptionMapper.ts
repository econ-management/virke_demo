export interface KpiOptionMapping {
  variable_name: string;
  label: string;
  comp_by_nace_var: string;
  nace_dev_var: string;
  variable_names_comp: string[];
  calculations_comp: (number | string)[];
  min_value: number | null;
}

export const kpiOptionMapper: Record<string, KpiOptionMapping> = {
  "Driftsmargin": {
    variable_name: "driftsmargin",
    label: "Driftsmargin",
    comp_by_nace_var: "comp_nace_driftsmargin_var",
    nace_dev_var: "nace_dev_driftsmargin_var",
    variable_names_comp: ["ebit", "driftsinntekter_sum"],
    calculations_comp: [0, "divide", 1],
    min_value: null
  },
  "Omsetning": {
    variable_name: "omsetning",
    label: "Omsetning",
    comp_by_nace_var: "comp_nace_omsetning_var",
    nace_dev_var: "nace_dev_omsetning_var",
    variable_names_comp: ["driftsinntekter_sum"],
    calculations_comp: [0, "clean", "clean"],
    min_value: 0
  },
  "Lønnskostnader": {
    variable_name: "lonn_oms",
    label: "Lønnskostnader",
    comp_by_nace_var: "comp_nace_lonn_oms_var",
    nace_dev_var: "nace_dev_lonn_oms_var",
    variable_names_comp: ["lonn_trygd_pensjon", "driftsinntekter_sum"],
    calculations_comp: [0, "divide", 1],
    min_value: 0
  },
  "Varekostnader": {
    variable_name: "vare_oms",
    label: "Varekostnader",
    comp_by_nace_var: "comp_nace_vare_oms_var",
    nace_dev_var: "nace_dev_vare_oms_var",
    variable_names_comp: ["varekostnad", "driftsinntekter_sum"],
    calculations_comp: [0, "divide", 1],
    min_value: 0
  }
};

export function getVariableName(metric: string): string | undefined {
  return kpiOptionMapper[metric]?.variable_name;
}
