import { createContext } from 'react';

interface LoadingContextData {
  loading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
}

export const LoadingContext =
  createContext<LoadingContextData | undefined>(undefined);
