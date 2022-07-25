import { useEffect, useRef } from "react";

export function useLastValue<T>(value: T): T | undefined {
  const ref = useRef<T>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return value ?? ref.current;
}
