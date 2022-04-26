import { Constructor } from './base-types/constructor';
import { Extractor } from './decorators/property/base-extractor';

const SERIALIZABLE_PROPERTIES_KEY = 'typescript-object-serializer_props';

export function getPropertiesKeys<T = any>(ctor: Constructor<T>): Map<keyof T, Extractor> | undefined {
  return getOrCreateTypesMap(ctor).get(ctor);
}

export function definePropertiesKeys<T>(ctor: Constructor<T>, parentProperties?: Map<keyof T, Extractor>): void {
  const typesMap = getOrCreateTypesMap(ctor);
  if (!typesMap.get(ctor)) {
    typesMap.set(ctor, new Map(parentProperties));
  }
}

function getOrCreateTypesMap<T>(ctor: Constructor<T>): Map<any, Map<keyof T, Extractor>> {
  if (!(ctor as any)[SERIALIZABLE_PROPERTIES_KEY]) {
    (ctor as any)[SERIALIZABLE_PROPERTIES_KEY] = new Map();
  }
  return (ctor as any)[SERIALIZABLE_PROPERTIES_KEY];
}
