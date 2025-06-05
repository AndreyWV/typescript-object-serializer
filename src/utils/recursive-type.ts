export type RecursivePartial<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [P in keyof T as (T[P] extends Function ? never : P)]?:
    T[P] extends (infer U)[]
      ? RecursivePartial<U>[]
      : T[P] extends object | undefined
        ? RecursivePartial<T[P]>
        : T[P];
};

export type RecursiveObject<T> = {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  [P in keyof T as (T[P] extends Function ? never : P)]:
    T[P] extends (infer U)[]
      ? RecursiveObject<U>[]
      : T[P] extends object | undefined
        ? RecursiveObject<T[P]>
        : T[P];
};
