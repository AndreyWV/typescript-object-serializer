import { DecoratorBase } from '../../utils/base-decorator';
import { Constructor } from '../../utils/constructor';
import { ModifiersClassStore } from '../store/modifier-store';
import { Modifier } from '../types/modifier';

/**
 * @function property Declares serialize/deserialize rules for current property
 * @param modifierConstructor { Constructor<Modifier> }
 *   Modifier for additional property processing
 * @example
 * class SomeClass extends SerializableObject {
 *
 *   @property()
 *   @modifier(NotSerializeModifier)
 *   public id: string;
 *
 * }
 *
 * class NotSerializeModifier extends Modifier {
 *
 *   public override onSerialize(data: unknown): unknown {
 *      return undefined;
 *   }
 *
 * }
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function modifier(
  modifierConstructor: Constructor<Modifier>,
)/* : PropertyDecorator | ParameterDecorator */ {

  const decorator = new ModifierDecorator(modifierConstructor);
  return decorator.decorate.bind(decorator);

}

class ModifierDecorator extends DecoratorBase {

  constructor(
    private readonly ModifierConstructor: Constructor<Modifier>,
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
    } = ModifierDecorator.getTargetConstructorAndPropertyKey(target, propertyKey, indexOrDescriptor);

    const propertiesStore = new ModifiersClassStore(targetConstructor)
      .getStoreMapOrDeclareFromParent();

    propertiesStore.set(
      propertyName,
      this.ModifierConstructor,
    );

  }

}
