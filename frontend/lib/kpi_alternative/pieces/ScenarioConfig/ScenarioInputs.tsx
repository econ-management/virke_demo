'use client';

import { useState } from 'react';
import styles from './ScenarioInputs.module.css';
import { ScenarioInputsVars } from '@/lib/config/ScenarioInputs';

export type ScenarioState = Record<string, number | null>;

interface ScenarioInputsProps {
  scenario: ScenarioState;
  onChange: (key: string, value: number | null) => void;
}

const MIN = -100;
const MAX = 100;
const STEP = 0.1;

export function ScenarioInputs({
  scenario,
  onChange,
}: ScenarioInputsProps) {
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState<string>('');

  const handleStartEdit = (key: string, currentValue: number) => {
    setEditingKey(key);
    setInputValue(currentValue.toFixed(1));
  };

  const handleCommit = (key: string) => {
    const normalizedValue = inputValue.replace(',', '.');
    const numValue = Number(normalizedValue);
    if (isNaN(numValue) || inputValue.trim() === '') {
      onChange(key, 0);
    } else {
      onChange(key, numValue);
    }
    setEditingKey(null);
  };

  const handleAdjust = (key: string, currentValue: number, adjustment: number) => {
    const newValue = currentValue + adjustment;
    const clampedValue = Math.max(MIN, Math.min(MAX, newValue));
    onChange(key, clampedValue);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.grid}>
        {Object.entries(ScenarioInputsVars)
          .filter(([, cfg]) => cfg.show)
          .map(([, cfg]) => {
            const key = cfg.variable_name;
            const value = scenario[key] ?? 0;
            const isEditing = editingKey === key;

            return (
              <div key={key} className={styles.cell}>
                <label className={styles.label}>
                  {cfg.label}
                </label>

                <div
                  className={styles.sliderWrapper}
                  style={
                    {
                      '--value': value,
                      '--min': MIN,
                      '--max': MAX,
                    } as React.CSSProperties
                  }
                >
                  {isEditing ? (
                    <input
                      type="text"
                      className={styles.valueBubble}
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      onBlur={() => handleCommit(key)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          handleCommit(key);
                        }
                      }}
                      style={{
                        border: 'none',
                        outline: 'none',
                        background: 'transparent',
                        padding: 0,
                        margin: 0,
                        width: 'auto',
                        font: 'inherit',
                        color: value > 0 ? 'green' : value < 0 ? 'red' : undefined,
                      }}
                      autoFocus
                    />
                  ) : (
                    <span
                      className={styles.valueBubble}
                      onClick={() => handleStartEdit(key, value)}
                      style={{
                        color: value > 0 ? 'green' : value < 0 ? 'red' : undefined,
                      }}
                    >
                      {value > 0 ? '+' : ''}{value.toFixed(1)}%
                    </span>
                  )}

                  <input
                    type="range"
                    min={MIN}
                    max={MAX}
                    step={STEP}
                    value={value}
                    onChange={e =>
                      onChange(key, Number(e.target.value))
                    }
                    className={styles.slider}
                  />
                  <div className={styles.buttonControls}>
                    <button
                      type="button"
                      className={styles.controlButton}
                      onClick={() => handleAdjust(key, value, -1.0)}
                    >
                      &lt;&lt;
                    </button>
                    <button
                      type="button"
                      className={styles.controlButton}
                      onClick={() => handleAdjust(key, value, -0.1)}
                    >
                      &lt;
                    </button>
                    <button
                      type="button"
                      className={styles.controlButton}
                      onClick={() => handleAdjust(key, value, 0.1)}
                    >
                      &gt;
                    </button>
                    <button
                      type="button"
                      className={styles.controlButton}
                      onClick={() => handleAdjust(key, value, 1.0)}
                    >
                      &gt;&gt;
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
