import React from 'react';

export const NumberInput: React.FC<{
  name?: string;
  min?: number;
  max?: number;
  value?: number;
  onChange?: (n: number) => unknown;
  range?: boolean;
}> = ({name, min, max, value, range, onChange}) => {
  function change(e: React.ChangeEvent<HTMLInputElement>) {
    if (!onChange) {
      return;
    }
    let n = Number(e.target.value || 0);
    if (typeof min === 'number') {
      n = Math.max(n, min);
    }
    if (typeof max === 'number') {
      n = Math.min(n, max);
    }
    onChange(n);
  }
  return (
    <input
      name={name}
      type={range ? 'range' : 'number'}
      min={min}
      max={max}
      value={value}
      onChange={change}
    />
  );
};
