
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Algorithm, SortStep, VisualizerState } from './types';
import ControlPanel from './components/ControlPanel';
import SortingVisualizer from './components/SortingVisualizer';

const MIN_VALUE = 10;
const MAX_VALUE = 1000;

const App: React.FC = () => {
  const [array, setArray] = useState<number[]>([]);
  const [count, setCount] = useState<number>(50);
  const [algorithm, setAlgorithm] = useState<Algorithm>(Algorithm.BUBBLE);
  const [speed, setSpeed] = useState<number>(1);
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [visualState, setVisualState] = useState<VisualizerState>({
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    pivot: null
  });

  const animationRef = useRef<number | null>(null);
  const stopRequested = useRef<boolean>(false);

  const generateRandomArray = useCallback((size: number) => {
    const newArray = Array.from({ length: size }, () => 
      Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE
    );
    setArray(newArray);
    setVisualState({
      array: newArray,
      comparing: [],
      swapping: [],
      sorted: [],
      pivot: null
    });
  }, []);

  useEffect(() => {
    generateRandomArray(count);
  }, [count, generateRandomArray]);

  const getSortSteps = async (algo: Algorithm, inputArr: number[]): Promise<SortStep[]> => {
    const steps: SortStep[] = [];
    const arr = [...inputArr];

    if (algo === Algorithm.BUBBLE) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
          steps.push({ type: 'compare', indices: [j, j + 1] });
          if (arr[j] > arr[j + 1]) {
            [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            steps.push({ type: 'swap', indices: [j, j + 1] });
          }
        }
        steps.push({ type: 'sorted', indices: [arr.length - 1 - i] });
      }
    } else if (algo === Algorithm.SELECTION) {
      for (let i = 0; i < arr.length; i++) {
        let minIdx = i;
        for (let j = i + 1; j < arr.length; j++) {
          steps.push({ type: 'compare', indices: [minIdx, j] });
          if (arr[j] < arr[minIdx]) {
            minIdx = j;
          }
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
        steps.push({ type: 'swap', indices: [i, minIdx] });
        steps.push({ type: 'sorted', indices: [i] });
      }
    } else if (algo === Algorithm.INSERTION) {
      for (let i = 1; i < arr.length; i++) {
        let key = arr[i];
        let j = i - 1;
        steps.push({ type: 'compare', indices: [i, j] });
        while (j >= 0 && arr[j] > key) {
          steps.push({ type: 'compare', indices: [j, j + 1] });
          arr[j + 1] = arr[j];
          steps.push({ type: 'overwrite', indices: [j + 1], value: arr[j] });
          j--;
        }
        arr[j + 1] = key;
        steps.push({ type: 'overwrite', indices: [j + 1], value: key });
      }
      for(let i=0; i<arr.length; i++) steps.push({type: 'sorted', indices: [i]});
    } else if (algo === Algorithm.MERGE) {
      const mergeSort = (l: number, r: number) => {
        if (l >= r) return;
        const mid = Math.floor((l + r) / 2);
        mergeSort(l, mid);
        mergeSort(mid + 1, r);
        merge(l, mid, r);
      };
      const merge = (l: number, mid: number, r: number) => {
        let i = l, j = mid + 1;
        const tempArr = [];
        while (i <= mid && j <= r) {
          steps.push({ type: 'compare', indices: [i, j] });
          if (arr[i] <= arr[j]) {
            tempArr.push(arr[i++]);
          } else {
            tempArr.push(arr[j++]);
          }
        }
        while (i <= mid) tempArr.push(arr[i++]);
        while (j <= r) tempArr.push(arr[j++]);
        for (let k = 0; k < tempArr.length; k++) {
          arr[l + k] = tempArr[k];
          steps.push({ type: 'overwrite', indices: [l + k], value: tempArr[k] });
          if(l === 0 && r === arr.length - 1) steps.push({type: 'sorted', indices: [l+k]});
        }
      };
      mergeSort(0, arr.length - 1);
      for(let i=0; i<arr.length; i++) steps.push({type: 'sorted', indices: [i]});
    } else if (algo === Algorithm.QUICK) {
      const quickSort = (l: number, r: number) => {
        if (l >= r) {
          if(l === r) steps.push({type: 'sorted', indices: [l]});
          return;
        }
        const p = partition(l, r);
        steps.push({type: 'sorted', indices: [p]});
        quickSort(l, p - 1);
        quickSort(p + 1, r);
      };
      const partition = (l: number, r: number) => {
        const pivotVal = arr[r];
        steps.push({ type: 'pivot', indices: [r] });
        let i = l - 1;
        for (let j = l; j < r; j++) {
          steps.push({ type: 'compare', indices: [j, r] });
          if (arr[j] < pivotVal) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
            steps.push({ type: 'swap', indices: [i, j] });
          }
        }
        [arr[i + 1], arr[r]] = [arr[r], arr[i + 1]];
        steps.push({ type: 'swap', indices: [i + 1, r] });
        return i + 1;
      };
      quickSort(0, arr.length - 1);
      for(let i=0; i<arr.length; i++) steps.push({type: 'sorted', indices: [i]});
    }

    return steps;
  };

  const startSorting = async () => {
    if (isSorting) return;
    setIsSorting(true);
    stopRequested.current = false;

    const steps = await getSortSteps(algorithm, [...array]);
    
    let stepIdx = 0;
    const animate = () => {
      if (stopRequested.current || stepIdx >= steps.length) {
        setIsSorting(false);
        if (stopRequested.current) {
          generateRandomArray(count);
        }
        return;
      }

      const step = steps[stepIdx];
      setVisualState(prev => {
        const nextArr = [...prev.array];
        let nextComparing: number[] = [];
        let nextSwapping: number[] = [];
        let nextSorted = [...prev.sorted];
        let nextPivot = prev.pivot;

        if (step.type === 'compare') {
          nextComparing = step.indices;
        } else if (step.type === 'swap') {
          nextSwapping = step.indices;
          const [i, j] = step.indices;
          [nextArr[i], nextArr[j]] = [nextArr[j], nextArr[i]];
        } else if (step.type === 'overwrite') {
          nextSwapping = step.indices;
          nextArr[step.indices[0]] = step.value!;
        } else if (step.type === 'pivot') {
          nextPivot = step.indices[0];
        } else if (step.type === 'sorted') {
          nextSorted = [...nextSorted, ...step.indices];
        }

        return {
          array: nextArr,
          comparing: nextComparing,
          swapping: nextSwapping,
          sorted: nextSorted,
          pivot: nextPivot
        };
      });

      stepIdx++;
      
      //Calculate delay based on speed multiplier. 
      //Base delay is inversely proportional to count, and divided by speed multiplier.
      const baseDelay = Math.max(5, Math.floor(250 / (count / 10)));
      const finalDelay = baseDelay / speed;
      
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, finalDelay);
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const stopSorting = () => {
    stopRequested.current = true;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsSorting(false);
    generateRandomArray(count);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100">
      <header className="p-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                AlgoSort Visualizer
              </h1>
              <p className="text-xs text-slate-500">App that helps you visualize</p>
            </div>
          </div>
          
          <ControlPanel 
            algorithm={algorithm}
            setAlgorithm={setAlgorithm}
            count={count}
            setCount={setCount}
            speed={speed}
            setSpeed={setSpeed}
            isSorting={isSorting}
            onStart={startSorting}
            onStop={stopSorting}
          />
        </div>
      </header>

      <main className="flex-1 relative flex flex-col items-center justify-center p-4">
        <div className="absolute top-8 left-8 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
                <span className="text-slate-400">Default</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 bg-rose-500 rounded-full"></span>
                <span className="text-slate-400">Comparing</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 bg-amber-400 rounded-full"></span>
                <span className="text-slate-400">Swapping</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
                <span className="w-3 h-3 bg-emerald-500 rounded-full"></span>
                <span className="text-slate-400">Sorted</span>
            </div>
        </div>
        
        <SortingVisualizer state={visualState} />
      </main>
    </div>
  );
};

export default App;
