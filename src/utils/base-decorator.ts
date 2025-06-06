import { Constructor } from './constructor';
import { ConstructorPropertyDeclaration } from './constructor-property-declaration';

export abstract class DecoratorBase {

  protected static getTargetAndPropertyKey(
    target: object,
    propertyKey: string | symbol | undefined,
    indexOrDescriptor?: number | PropertyDescriptor,
  ): {
    targetConstructor: Constructor<never>,
    propertyKey: string | symbol,
  } {
    let targetConstructor: Constructor<never> | undefined;

    /*
     * Extract property name from constructor parameter index if property decorated in constructor
     * constructor(
     *   @propertyType(Type1)
     *   private propertyType1: Type1,
     * )
     */
    if (ConstructorPropertyDeclaration.isPropertyDeclaredAtConstructor(target, propertyKey, indexOrDescriptor)) {
      const targetPrototypeConstructor = (target as any)['prototype'].constructor as Constructor<never>;
      const extractedPropertyKey = ConstructorPropertyDeclaration.getConstructorPropertyNameByIndex(
        targetPrototypeConstructor,
        indexOrDescriptor as number,
      );
      if (!extractedPropertyKey) {
        throw new Error(
          `[Serializer] Error define property name at constructor: "${targetPrototypeConstructor.toString()}"`
          + ` - ${indexOrDescriptor}`,
        );
      }
      propertyKey = extractedPropertyKey;
      targetConstructor = targetPrototypeConstructor;
    }

    if (!targetConstructor) {
      targetConstructor = target.constructor as Constructor<never>;
    }

    return {
      targetConstructor,
      propertyKey: propertyKey as string | symbol,
    };
  }

}
