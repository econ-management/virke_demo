export interface ScenarioInputs{
    variable_name: string;
    show: boolean;
    label: string;
  }
  
  export const ScenarioInputsVars: Record<string, ScenarioInputs> = {
    "Driftsmargin": {
      variable_name: "driftsmargin",
      show: false,
      label: "Driftsmargin"
    },
    "Omsetning": {
      variable_name: "omsetning",
      show: true,
      label: "Omsetning"
    },
    "Lønnskostnadsandel": {
      variable_name: "lonn_oms",
      show: false,
      label: "Lønnskostnadsandel"
    },
    "Varekostnadsandel": {
      variable_name: "vare_oms",
      show: false,
      label: "Varekostnadsandel"
    },
    "Beholdningsendringer": {
      variable_name: "beholdningsendringer",
      show: false,
      label: "Beholdningsendringer"
    },
    "Avskrivninger": {
      variable_name: "avskrivninger",
      show: false,
      label: "Avskrivninger"
    },
    "Nedskrivninger": {
      variable_name: "nedskrivninger",
      show: false,
      label: "Nedskrivninger"
    },
    "Andre driftskostnader": {
      variable_name: "andre_driftskostnader",
      show: true,
      label: "Andre driftskostnader"
    },
    "Lønnskostnader": {
      variable_name: "lonnskostnader",
      show: true,
      label: "Lønnskostnader"
    },
    "Varekostnader" : {
      variable_name: "varekostnad",
      show: true,
      label: "Varekostnader"
    }

  };
  
  export function GetScenarioInputVariableName(metric: string): string | undefined {
    return ScenarioInputsVars[metric]?.variable_name;
  }
  
  export function GetScenarioInputShowStatus(metric: string): boolean | undefined {
    return ScenarioInputsVars[metric]?.show;
  }