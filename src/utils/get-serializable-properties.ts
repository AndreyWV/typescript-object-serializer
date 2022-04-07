import { Constructor } from '../base-types/constructor';
import { Extractor } from '../decorators/property/base-extractor';
import {
  SERIALIZABLE_PROPERTIES_KEY,
  SERIALIZABLE_TYPES_KEY,
} from '../metadata-keys';

export function getSerializableProperties<T>(ctor: Constructor<T>): Map<keyof T, Extractor> | undefined {

  if (!ctor) {
    return;
  }

  let currentCtor = ctor;

  /* Search props depth */
  let i = 5;

  while (i !== 0) {
    const propertyKey = `${SERIALIZABLE_PROPERTIES_KEY}_${currentCtor.name}`;
    const props: Map<keyof T, Extractor> = (ctor as any)[propertyKey];
    if (props) {
      return props;
    }
    currentCtor = (currentCtor as any).__proto__;
    if (!currentCtor) {
      break;
    }
    i--;
  }
}

export function getSerializablePropertiesTypes<T>(ctor: Constructor<T>): Map<keyof T, any> | undefined {

  if (!ctor) {
    return;
  }

  let currentCtor = ctor;

  /* Search props depth */
  let i = 5;

  while (i !== 0) {
    const propertyKey = `${SERIALIZABLE_TYPES_KEY}_${currentCtor.name}`;
    const types: Map<keyof T, Extractor> = (ctor as any)[propertyKey];
    if (types) {
      return types;
    }
    currentCtor = (currentCtor as any).__proto__;
    if (!currentCtor) {
      break;
    }
    i--;
  }
}
