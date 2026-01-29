
export enum Algorithm {
  BUBBLE = 'Bubble Sort',
  SELECTION = 'Selection Sort',
  INSERTION = 'Insertion Sort',
  MERGE = 'Merge Sort',
  QUICK = 'Quick Sort'
}

export type StepType = 'compare' | 'swap' | 'overwrite' | 'pivot' | 'sorted';

export interface SortStep {
  type: StepType;
  indices: number[];
  value?: number;
}

export interface SortResponse {
  steps: SortStep[];
  sortedArray: number[];
}

export interface VisualizerState {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivot: number | null;
}
