export function getPropertyDescriptor(obj: any, key: string | number | symbol): PropertyDescriptor | undefined {
  let descriptor;
  do {
    descriptor = Object.getOwnPropertyDescriptor(obj, key);
  } while (!descriptor && (obj = Object.getPrototypeOf(obj)));
  return descriptor;
}
