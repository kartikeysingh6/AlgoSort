
import React from 'react';
import { VisualizerState } from '../types';

interface SortingVisualizerProps {
  state: VisualizerState;
}

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ state }) => {
  const { array, comparing, swapping, sorted, pivot } = state;
  const maxVal = Math.max(...array, 1);

  return (
    <div className="flex items-end justify-center w-full max-w-6xl h-2/3 gap-[1px] md:gap-[2px]">
      {array.map((value, idx) => {
        let bgColor = 'bg-indigo-500'; // Default
        let opacity = 'opacity-80';

        if (comparing.includes(idx)) {
          bgColor = 'bg-rose-500';
          opacity = 'opacity-100 scale-y-105';
        } else if (swapping.includes(idx)) {
          bgColor = 'bg-amber-400';
          opacity = 'opacity-100 scale-y-105';
        } else if (sorted.includes(idx)) {
          bgColor = 'bg-emerald-500';
          opacity = 'opacity-100';
        } else if (pivot === idx) {
          bgColor = 'bg-purple-500';
          opacity = 'opacity-100';
        }

        const height = `${(value / 1000) * 100}%`;

        return (
          <div 
            key={idx}
            style={{ height }}
            className={`flex-1 min-w-[1px] transition-all duration-75 ease-out rounded-t-sm ${bgColor} ${opacity} shadow-sm shadow-black/20`}
          />
        );
      })}
    </div>
  );
};

export default SortingVisualizer;
