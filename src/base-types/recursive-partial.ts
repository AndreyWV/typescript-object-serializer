export type RecursivePartial<T> = {
  [K in keyof T]?: RecursivePartial<T[K]>;
}
