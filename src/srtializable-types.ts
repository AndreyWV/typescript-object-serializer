import { Constructor } from './base-types/constructor';

const SERIALIZABLE_TYPES_KEY = 'typescript-object-serializer_types';

export function getPropertiesTypes<T = any>(ctor: Constructor<T>): Map<keyof T, any> | undefined {
  return getOrCreateTypesMap(ctor).get(ctor);
}

export function definePropertiesTypes<T>(ctor: Constructor<T>, parentProperties?: Map<keyof T, any>): void {
  const typesMap = getOrCreateTypesMap(ctor);
  if (!typesMap.get(ctor)) {
    typesMap.set(ctor, new Map(parentProperties));
  }
}

function getOrCreateTypesMap<T>(ctor: Constructor<T>): Map<any, Map<keyof T, any>> {
  if (!(ctor as any)[SERIALIZABLE_TYPES_KEY]) {
    (ctor as any)[SERIALIZABLE_TYPES_KEY] = new Map();
  }
  return (ctor as any)[SERIALIZABLE_TYPES_KEY];
}
