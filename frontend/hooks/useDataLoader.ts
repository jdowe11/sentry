"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export interface DataLoaderResult<T> {
  data: T | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error: Error | null;
  reloadData: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

export function useDataLoader<T>(
  fetchFn: () => Promise<T>,
  dependencies: unknown[] = []
): DataLoaderResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Sync and compare dependencies during render phase to safely trigger load updates
  const [prevDeps, setPrevDeps] = useState<unknown[]>(dependencies);
  const [triggerKey, setTriggerKey] = useState(0);

  const depsChanged = dependencies.length !== prevDeps.length || 
                      dependencies.some((dep, i) => dep !== prevDeps[i]);

  if (depsChanged) {
    setPrevDeps(dependencies);
    setTriggerKey((prev) => prev + 1);
    setIsLoading(true);
    setError(null);
  }

  // Keep latest fetchFn in a ref to avoid stale closure updates
  const fetchFnRef = useRef(fetchFn);
  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const reloadData = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const result = await fetchFnRef.current();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    fetchFnRef.current()
      .then((result) => {
        if (isMounted) {
          setData(result);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [triggerKey]);

  return { data, isLoading, isRefreshing, error, reloadData, setData };
}
