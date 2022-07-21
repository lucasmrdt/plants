declare module "deep-memoize-once" {
  declare function deepMemoizedOnce<T>(
    fn: (...args: any[]) => T
  ): (...args: any[]) => T;
  export = deepMemoizedOnce;
}
