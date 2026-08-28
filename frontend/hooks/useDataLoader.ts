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
  dependencies: any[] = []
): DataLoaderResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);

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
    setIsLoading(true);
    setError(null);

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
  }, dependencies);

  return { data, isLoading, isRefreshing, error, reloadData, setData };
}
