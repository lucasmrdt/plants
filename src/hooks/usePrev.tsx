import { useEffect, useRef } from "react";

export function usePrev<T>(value: T, shouldUpdate = true): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    if (shouldUpdate) {
      ref.current = value;
    }
    // only update when value is updated
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return ref.current;
}
