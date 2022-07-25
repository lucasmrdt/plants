export function createArray<T>(value: T, length: number): Array<T> {
  return Array.from({ length }, () => value);
}
