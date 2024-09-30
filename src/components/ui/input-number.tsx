import React, { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from './button';
import { Input } from './input';

export interface InputNumberProps {
  value: number;
  onChange: (value: number) => void;
  allowFloat?: boolean;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  isLoading?: boolean;
}

export function InputNumber({
  value: defaultValue,
  onChange,
  min,
  max,
  step = 1,
  allowFloat = true,
  disabled = false,
  isLoading = false,
}: InputNumberProps) {
  const [value, setValue] = useState(defaultValue);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleStepChange = (change: number) => {
    setValue((prevValue) => {
      const newValue = prevValue + change;

      const clampedValue = max
        ? Math.min(min ? Math.max(newValue, min) : newValue, max)
        : newValue;

      onChange(clampedValue);
      return clampedValue;
    });
  };

  const handleMouseDown = (change: number) => {
    if (disabled) return;

    handleStepChange(change);

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        handleStepChange(change);
      }, 100);
    }, 300);
  };

  const handleMouseUp = () => {
    clearTimeout(timeoutRef.current!);
    clearInterval(intervalRef.current!);
  };

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (inputValue === '') return; // Evita enviar valores vazios

      const newValue = allowFloat
        ? parseFloat(inputValue)
        : parseInt(inputValue, 10);

      if (!isNaN(newValue)) {
        const clampedValue = max
          ? Math.min(min ? Math.max(newValue, min) : newValue, max)
          : newValue;
        onChange(clampedValue);
      }
    },
    [min, max, onChange, allowFloat],
  );

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutRef.current!);
      clearInterval(intervalRef.current!);
    };
  }, []);

  return (
    <div className="flex items-center space-x-2">
      <Button
        type="button"
        size="icon"
        variant="outline"
        className="w-12"
        onMouseDown={() => handleMouseDown(-step)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        disabled={isLoading || disabled}
        aria-label="Decrease value"
      >
        -
      </Button>

      <Input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        isLoading={isLoading}
      />

      <Button
        type="button"
        size="icon"
        variant="outline"
        className="w-12"
        onMouseDown={() => handleMouseDown(step)}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        disabled={isLoading || disabled}
        aria-label="Increase value"
      >
        +
      </Button>
    </div>
  );
}
