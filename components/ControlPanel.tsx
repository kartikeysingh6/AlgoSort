
import React from 'react';
import { Algorithm } from '../types';

interface ControlPanelProps {
  algorithm: Algorithm;
  setAlgorithm: (algo: Algorithm) => void;
  count: number;
  setCount: (count: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  isSorting: boolean;
  onStart: () => void;
  onStop: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  algorithm,
  setAlgorithm,
  count,
  setCount,
  speed,
  setSpeed,
  isSorting,
  onStart,
  onStop
}) => {
  return (
    <div className="flex flex-wrap items-center gap-4 justify-center md:justify-end">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Algorithm</label>
        <select 
          disabled={isSorting}
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
          className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 transition-all cursor-pointer"
        >
          {Object.values(Algorithm).map(algo => (
            <option key={algo} value={algo}>{algo}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Array Size ({count})</label>
        <div className="flex items-center gap-3">
          <input 
            type="range"
            min="10"
            max="100"
            step="1"
            disabled={isSorting}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="accent-indigo-500 h-1.5 rounded-lg appearance-none bg-slate-800 cursor-pointer disabled:opacity-50 w-24 md:w-32"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Speed</label>
        <select 
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className="bg-slate-800 border border-slate-700 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
        >
          <option value="1">1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="1.75">1.75x</option>
          <option value="2">2x</option>
        </select>
      </div>

      <div className="flex items-center gap-2 pt-4 md:pt-0">
        {!isSorting ? (
          <button 
            onClick={onStart}
            className="bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white px-6 py-2 rounded-md font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
            </svg>
            Start
          </button>
        ) : (
          <button 
            onClick={onStop}
            className="bg-rose-600 hover:bg-rose-500 active:scale-95 text-white px-6 py-2 rounded-md font-semibold text-sm transition-all shadow-lg shadow-rose-600/20 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
            Stop
          </button>
        )}
      </div>
    </div>
  );
};

export default ControlPanel;
