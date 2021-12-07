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

    if (!target.constructor[SERIALIZABLE_TYPES_KEY]) {
      target.constructor[SERIALIZABLE_TYPES_KEY] = new Map<string | symbol, any>();
    }

    const typesStore: Map<string | symbol, any> = target.constructor[SERIALIZABLE_TYPES_KEY];

    typesStore.set(propertyKey, defineType);

  }
}
