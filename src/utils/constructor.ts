// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T, A1 = any, A2 = any, A3 = any>
  = new (arg1?: A1, arg2?: A2, arg3?: A3, ...args: unknown[]) => T;
