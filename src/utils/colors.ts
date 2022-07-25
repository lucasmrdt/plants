import chroma from "chroma-js";

export function generateColors(from: string, to: string, nb: number) {
  return nb > 0 ? chroma.scale([from, to]).mode("rgb").colors(nb) : [];
}
