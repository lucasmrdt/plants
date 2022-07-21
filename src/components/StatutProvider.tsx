import { useEffect, useRef } from "react";
import { AsyncState } from "react-async-hook";

interface Props<T> {
  asyncStates: AsyncState<T | T[]>[];
  // TODO: avoid any
  children: (...data: any) => React.ReactNode;
  backgroundLoading?: boolean;
}

export function StatusProvider<T>({
  asyncStates,
  children,
  backgroundLoading = false,
}: Props<T>) {
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (!hasLoaded.current && asyncStates.every((s) => s.result)) {
      hasLoaded.current = true;
    }
  }, [asyncStates]);

  return (
    <>
      {asyncStates.some((s) => s.error) ? (
        <p>Error :'(</p>
      ) : asyncStates.some((s) => s.loading) &&
        (!hasLoaded.current || !backgroundLoading) ? (
        <p>loading...</p>
      ) : (
        asyncStates.every((s) => s.result) &&
        children(...asyncStates.map((s) => s.result as T))
      )}
    </>
  );
}
