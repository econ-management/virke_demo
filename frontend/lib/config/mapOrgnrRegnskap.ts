export interface OrgnrRegnskapToMapperMapping {
    variable_name: string;
  }
  
  export const orgnrRegnskapToMapper: Record<string, OrgnrRegnskapToMapperMapping> = {
    "driftsmargin": {
      variable_name: "driftsmargin",
    },
    "omsetning": {
      variable_name: "omsetning",
    },
    "lonn_oms": {
      variable_name: "lonn_oms",
    },
    "vare_oms": {
      variable_name: "vare_oms",
    },
    "beholdningsendringer": {
      variable_name: "beholdningsendringer",
    },
    "avskrivninger": {
      variable_name: "avskrivninger",
    },
    "nedskrivninger": {
      variable_name: "nedskrivninger",
    },
    "andre_driftskostnader": {
      variable_name: "andre_driftskostnader",
    },
    "lonnskostnader": {
      variable_name: "lonnskostnader",
    },
    "varekostnad" : {
      variable_name: "varekostnad",
    }

  };
  
  export function getRegnskapVariableName(metric: string): string | undefined {
    return orgnrRegnskapToMapper[metric]?.variable_name;
  }
  