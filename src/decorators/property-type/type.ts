import { SerializableObject } from '../../serializable-object';
import { SERIALIZABLE_TYPES_KEY } from '../../metadata-keys';

/**
 * @function property Declares type for current property
 * @param defineType Type constructor or condition for detecting type
 * @example
 * // Type
 * class SomeClass extends SerializableObject {
 *
 *   @property()
 *   @propertyType(SomePropertyType)
 *   public id: string;
 *
 * }
 *
 * // Condition
 * class SomeClass extends SerializableObject {
 *
 *   @property()
 *   @propertyType((value: any) => value.prop !== undefined ? FirstType : SecondType)
 *   public property: FirstType | SecondType;
 *
 * }
 */
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
