export interface Item {
  timestamp: number;
  value: number;
}

export type Data = Item[];

export type Status = "loading" | "error" | "success" | "default";
