import { Constructor } from '../../utils/constructor';
import { TypesClassStore } from '../class-stores/types-store';
import { DecoratorBase } from './base-decorator';

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
 *   @propertyType(ConditionalType, (value: unknown) => boolean)
 *   @propertyType(DefaultType)
 *   public property: ConditionalType | DefaultType;
 *
 * }
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function propertyType<T = Constructor<unknown>>(
  defineType: T,
  typeCondition?: (value: unknown) => boolean,
)/* : PropertyDecorator | ParameterDecorator */ {
  const propertyTypeDecorator = new PropertyTypeDecorator(defineType, typeCondition);
  return propertyTypeDecorator.decorate.bind(propertyTypeDecorator);
}


class PropertyTypeDecorator<T = Constructor<never>> extends DecoratorBase {

  constructor(
    private readonly defineType: T,
    private readonly typeCondition?: (value: unknown) => boolean,
  ) {
    super();
  }

  public decorate(
    target: object,
    propertyKey: string | symbol | undefined,
    indexOrDescriptor?: number | PropertyDescriptor,
  ): void {

    const {
      targetConstructor,
      propertyKey: propertyName,
    } = PropertyTypeDecorator.getTargetAndPropertyKey(target, propertyKey, indexOrDescriptor);

    const propertiesStore = new TypesClassStore(targetConstructor)
      .getStoreMapOrDeclareFromParent();

    let propertyTypeMap = propertiesStore.get(propertyName);

    if (!propertyTypeMap) {
      propertiesStore.set(
        propertyName,
        new Map(),
      );
      propertyTypeMap = propertiesStore.get(propertyName)!;
    }

    propertyTypeMap.set(
      this.defineType as Constructor<never>,
      this.typeCondition
      ?? ((): boolean => true),
    );

    propertiesStore.set(
      propertyName,
      propertyTypeMap,
    );
  }

}
