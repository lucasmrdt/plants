import { AsyncState } from "../hooks";

interface Props<T> {
  asyncStates: AsyncState<T>[];
  children: (
    data: Exclude<T, null>[],
    asyncStates: AsyncState<T>[]
  ) => React.ReactElement;
  backgroundLoading?: boolean;
}

export function StatusProvider<T>({
  asyncStates,
  children,
  backgroundLoading = false,
}: Props<T>) {
  return (
    <>
      {asyncStates.some((s) => s.error) ? (
        <p>Error :'(</p>
      ) : asyncStates.some((s) => s.loading) ||
        (!backgroundLoading && asyncStates.some((s) => s.refreshing)) ? (
        <p>loading...</p>
      ) : (
        asyncStates.every((s) => s.data) &&
        children(
          asyncStates.map((s) => s.data) as Exclude<T, null>[],
          asyncStates
        )
      )}
    </>
  );
}
