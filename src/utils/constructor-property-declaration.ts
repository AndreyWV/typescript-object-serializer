import { Constructor } from './constructor';

/**
 * Class to check and extract constructor property name by index
 * In case if serializer rules declared in constructor function
 */
export class ConstructorPropertyDeclaration {

  public static isPropertyDeclaredAtConstructor(
    target: object,
    propertyKey: string | symbol | undefined,
    indexOrDescriptor?: number | PropertyDescriptor,
  ): boolean {
    return propertyKey === undefined
      && (target as any)['prototype']
      && typeof indexOrDescriptor === 'number';
  }

  public static getConstructorPropertyNameByIndex(constructor: Constructor<never>, index: number): string | undefined {
    const regex = /constructor\((.*?)\)/;
    const constructorString = String(constructor);
    const match = regex.exec(constructorString);
    const names = match?.[1];
    if (!names) {
      return;
    }
    const ctorName = names.split(',')[index];
    if (ctorName) {
      const ownPropertyRegExp = new RegExp(`this\\.([a-zA-Z\\d]*?)\\s?=\\s?${ctorName.trim()}`);
      const ownPropertyMatch = ownPropertyRegExp.exec(constructorString);
      return ownPropertyMatch?.[1];
    }
  }

}
