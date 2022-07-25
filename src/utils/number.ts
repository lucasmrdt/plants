export function toFixed(value: number, precision: number, removeZeros = true) {
  const res = value.toFixed(precision);
  return removeZeros ? res.replace(/\.?0+$/, "") : res;
}
