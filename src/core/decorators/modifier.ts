import { Constructor } from '../../utils/constructor';
import { ModifiersClassStore } from '../store/modifier-store';
import { Modifier } from '../types/modifier';
import { DecoratorBase } from '../../utils/base-decorator';

/**
 * @function property Declares serialize/deserialize rules for current property
 * @param ModifierConstructor { Constructor<Modifier> }
 *   Modifier for additional property processing
 * @example
 * class SomeClass extends SerializableObject {
 *
 *   @property()
 *   @modifier(OnlyDeserializeModifier)
 *   public id: string;
 *
 * }
 * 
 * class OnlyDeserializeModifier extends Modifier {
 * 
 *   public override afterSerialize(data: unknown): unknown {
 *      return undefined;
 *   }
 * 
 * }
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function modifier(
  ModifierConstructor: Constructor<Modifier>,
)/* : PropertyDecorator | ParameterDecorator */ {
  const decorator = new ModifierDecorator(ModifierConstructor);
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

    const propertiesStore = new ModifiersClassStore(targetConstructor).getStoreMapOrDeclareFromParent();

    propertiesStore.set(
      propertyName,
      this.ModifierConstructor,
    );
  }

}
