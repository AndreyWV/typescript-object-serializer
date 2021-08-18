import 'reflect-metadata';
import { SerializableObject } from '../../serializable-object';
import { SERIALIZABLE_TYPES_KEY } from '../../metadata-keys';

export function propertyType<T extends typeof SerializableObject>(
  defineType: T | ((data: any) => T | undefined),
): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {

    if (!Reflect.hasMetadata(SERIALIZABLE_TYPES_KEY, target)) {
      Reflect.defineMetadata(
        SERIALIZABLE_TYPES_KEY,
        new Map<string | symbol, any>(),
        target,
      );
    }

    const typesStore: Map<string | symbol, any> =
      Reflect.getMetadata(SERIALIZABLE_TYPES_KEY, target);

    typesStore.set(propertyKey, defineType);

  }
}
