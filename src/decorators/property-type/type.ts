import { Constructor } from '../../base-types/constructor';
import { SERIALIZABLE_TYPES_KEY } from '../../metadata-keys';
import { SerializableObject } from '../../serializable-object';
import { getConstructorPropertyName } from '../../utils/get-constructor-property-name';
import { getSerializablePropertiesTypes } from '../../utils/get-serializable-properties';

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
export function propertyType<T extends typeof SerializableObject, U = Constructor<any>>(
  defineType: T | ((data: any) => T | undefined) | U | ((data: any) => U | undefined),
)/* : PropertyDecorator | ParameterDecorator */ {
  return (target: any, propertyKey: string | symbol, index?: number) => {

    let ctor;

    if (propertyKey === undefined && target['prototype'] && index !== undefined) {
      const extractedPropertyKey = getConstructorPropertyName(target['prototype'].constructor, index as number);
      if (!extractedPropertyKey) {
        return;
      }
      propertyKey = extractedPropertyKey;
      ctor = target['prototype'].constructor;
    }

    if (!ctor) {
      ctor = target.constructor;
    }

    const typesKey = `${SERIALIZABLE_TYPES_KEY}_${ctor.name}`;

    if (!ctor[typesKey]) {
      const parentTypes = getSerializablePropertiesTypes(ctor.__proto__);
      ctor[typesKey] = new Map<string | symbol, any>(parentTypes);
    }

    const typesStore: Map<string | symbol, any> = ctor[typesKey];

    typesStore.set(propertyKey, defineType);

  }
}
