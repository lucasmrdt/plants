import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";

export interface AsyncState<T> {
  loading: boolean;
  error: boolean;
  refreshing: boolean;
  data: T;
  fetch: () => void;
}

export const useAsync = function useAsync<T, U extends any[]>(
  fetch: (...params: U) => Promise<T>,
  params: U
) {
  const previousParams = useRef<U[] | null>(null);
  const [data, setData] = useState(null as T | null);
  const [status, setStatus] = useState<
    "loading" | "error" | "success" | "default" | "refreshing"
  >("default");

  const fetchData = useCallback(async () => {
    if (status === "default") {
      setStatus("loading");
    } else {
      setStatus("refreshing");
    }
    try {
      const data = await fetch(...params);
      setData(data);
      setStatus("success");
    } catch {
      setStatus("error");
      setData(null);
    }
  }, [fetch, params, status]);

  useEffect(() => {
    if (!_.isEqual(previousParams.current, params)) {
      previousParams.current = params;
      fetchData();
    }
  }, [fetchData, params]);

  return {
    loading: status === "loading",
    error: status === "error",
    refreshing: status === "refreshing",
    data,
    fetch: fetchData,
  };
};
