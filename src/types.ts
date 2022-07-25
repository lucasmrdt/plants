export interface Item {
  timestamp: number;
  value: number;
}

export type Data = Item[];

export type TimeRange = { start: number; end?: number };

export type Loadable<Value> =
  | {
      state: "loading";
    }
  | {
      state: "hasError";
      error: unknown;
    }
  | {
      state: "hasData";
      data: Awaited<Value>;
    };

export type Status = Loadable<any>["state"];
