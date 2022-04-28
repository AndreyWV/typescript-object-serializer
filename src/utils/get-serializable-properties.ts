import { Constructor } from '../base-types/constructor';
import { Extractor } from '../decorators/property/base-extractor';
import { getPropertiesKeys } from '../serializable-properties';
import { getPropertiesTypes } from '../srtializable-types';

const rootObjectPrototype = ({} as any).prototype;

export function getSerializableProperties<T>(ctor: Constructor<T>): Map<keyof T, Extractor> | undefined {

  if (!ctor) {
    return;
  }

  let currentCtor = ctor;

  /* Search props depth */
  let i = 5;

  while (i !== 0) {
    if (currentCtor?.prototype === rootObjectPrototype) {
      return;
    }
    const props = getPropertiesKeys(currentCtor);
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
    if (currentCtor?.prototype === rootObjectPrototype) {
      return;
    }
    const types = getPropertiesTypes(currentCtor);
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
