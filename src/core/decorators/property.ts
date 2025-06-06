import { StraightExtractor } from '../../common/extractors/straight-extractor';
import { Constructor } from '../../utils/constructor';
import { ExtractorsClassStore } from '../store/extractor-store';
import { Extractor } from '../types/extractor';
import { DecoratorBase } from '../../utils/base-decorator';

/**
 * @function property Declares serialize/deserialize rules for current property
 * @param ExtractorConstructor { Extractor }
 *   Extractor that extracts data from serialized data and applies data to serialized data
 * @example
 * class SomeClass extends SerializableObject {
 *
 *   @property()
 *   public id: string;
 *
 * }
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function property(
  ExtractorConstructor: Constructor<Extractor> = StraightExtractor,
)/* : PropertyDecorator | ParameterDecorator */ {
  const decorator = new ExtractorDecorator(ExtractorConstructor);
  return decorator.decorate.bind(decorator);
}

class ExtractorDecorator extends DecoratorBase {

  constructor(
    private readonly ExtractorConstructor: Constructor<Extractor>,
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
    } = ExtractorDecorator.getTargetAndPropertyKey(target, propertyKey, indexOrDescriptor);

    const propertiesStore = new ExtractorsClassStore(targetConstructor)
      .getStoreMapOrDeclareFromParent();

    propertiesStore.set(
      propertyName,
      this.ExtractorConstructor,
    );
  }

}
