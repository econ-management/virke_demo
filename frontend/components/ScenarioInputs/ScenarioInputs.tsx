'use client';

import { orgnrRegnskapToMapper } from '../../lib/config/mapOrgnrRegnskap';
import styles from './ScenarioInputs.module.css';

export const ScenarioInputs = () => {
  const variables = Object.values(orgnrRegnskapToMapper);

  return (
    <div className={styles.container}>
      {variables.map((variable) => (
        <div key={variable.variable_name} className={styles.inputRow}>
          <label className={styles.label}>{variable.variable_name}</label>
          <input
            type="number"
            className={styles.input}
            name={variable.variable_name}
          />
        </div>
      ))}
    </div>
  );
};
