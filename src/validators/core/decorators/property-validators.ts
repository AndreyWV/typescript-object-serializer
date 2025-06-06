import { DecoratorBase } from '../../../utils/base-decorator';
import { Constructor } from '../../../utils/constructor';
import { ValidatorsClassStore } from '../store/validators-store';
import { Validator } from '../types/validator';

/**
 * @function propertyValidators Declares validators for current property on deserialization
 * @param validators { Constructor<Validator>[] } List of validators on current property
 * @example
 * class SomeClass extends SerializableObject {
 *
 *   @property()
 *   @propertyValidators([RequiredValidator, StringLengthValidator.with(1, 10)])
 *   public id: string;
 *
 * }
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function propertyValidators(
  validators: Constructor<Validator>[],
)/* : PropertyDecorator | ParameterDecorator */ {
  const decorator = new ValidatorsDecorator(validators);
  return decorator.decorate.bind(decorator);
}

class ValidatorsDecorator extends DecoratorBase {

  constructor(
    private readonly validators: Constructor<Validator>[],
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
    } = ValidatorsDecorator.getTargetAndPropertyKey(target, propertyKey, indexOrDescriptor);

    const validatorsStore = new ValidatorsClassStore(targetConstructor)
      .getStoreMapOrDeclareFromParent();

    const propertyKeyParentValidators = validatorsStore.get(propertyName);

    const allValidators = ([] as Constructor<Validator>[])
      .concat(
        propertyKeyParentValidators ?? [],
        this.validators,
      );

    validatorsStore.set(propertyName, allValidators);
  }

}
