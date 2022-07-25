export function tryParseFloat(str: string) {
  const result = parseFloat(str);
  return isNaN(result) ? str : result;
}

export function parseCSV<T extends any[] = [number, number]>(
  csv: string,
  separator = " "
): T[] {
  return csv
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => line.split(separator))
    .map((line) => line.map(parseFloat) as T);
}
