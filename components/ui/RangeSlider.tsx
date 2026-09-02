'use client';

import React from 'react';
import { cn } from '../../lib/utils';

interface RangeSliderProps {
  label?: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  formatValue?: (val: number) => string;
  className?: string;
}

export function RangeSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  formatValue = (v) => `${v}`,
  className,
}: RangeSliderProps) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center text-xs font-semibold text-slate-700">
        <span>{label}</span>
        <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
          {formatValue(value)}
        </span>
      </div>
      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
        />
      </div>
      <div className="flex justify-between text-[10px] text-slate-400 font-medium">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
}
