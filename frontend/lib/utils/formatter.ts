type FormatterType = 'percentage' | 'monetary' | 'numeric';

interface FormatterResult {
  value: number;
  denomination: string;
  string: string;
}

const addThousandSeparator = (str: string): string => {
  return str.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export const formatter = (value: number, type: FormatterType): FormatterResult => {
  if (type === 'percentage') {
    const percentage = value * 100;
    let formattedValue: number;
    let formattedString: string;
    
    if (percentage > 5 || percentage < -5) {
      formattedValue = Math.round(percentage);
      formattedString = `${formattedValue}%`;
    } else {
      formattedValue = Number(percentage.toFixed(1));
      formattedString = `${formattedValue}%`;
    }
    
    return {
      value: formattedValue,
      denomination: '%',
      string: addThousandSeparator(formattedString),
    };
  }

  if (type === 'monetary') {
    const absValue = Math.abs(value);
    
    if (absValue < 1_000_000) {
      const formattedString = value.toString();
      return {
        value: value,
        denomination: '',
        string: addThousandSeparator(formattedString),
      };
    }
    
    if (absValue >= 1_000_000 && absValue < 10_000_000) {
      const formattedValue = Number((value / 1_000_000).toFixed(1));
      const formattedString = `${formattedValue} mill. kr`;
      return {
        value: formattedValue,
        denomination: 'mill. kr',
        string: addThousandSeparator(formattedString),
      };
    }
    
    if (absValue >= 10_000_000 && absValue < 1_000_000_000) {
      const formattedValue = Math.round(value / 1_000_000);
      const formattedString = `${formattedValue} mill.kr`;
      return {
        value: formattedValue,
        denomination: 'mill.kr',
        string: addThousandSeparator(formattedString),
      };
    }
    
    if (absValue >= 1_000_000_000 && absValue < 100_000_000_000) {
      const formattedValue = Number((value / 1_000_000_000).toFixed(1));
      const formattedString = `${formattedValue} mrd. kr`;
      return {
        value: formattedValue,
        denomination: 'mrd. kr',
        string: addThousandSeparator(formattedString),
      };
    }
    
    const formattedValue = Math.round(value / 1_000_000_000);
    const formattedString = `${formattedValue} mrd. kr`;
    return {
      value: formattedValue,
      denomination: 'mrd. kr',
      string: addThousandSeparator(formattedString),
    };
  }

  if (type === 'numeric') {
    const formattedString = value.toString();
    return {
      value: value,
      denomination: '',
      string: addThousandSeparator(formattedString),
    };
  }

  return {
    value: value,
    denomination: '',
    string: '',
  };
};

