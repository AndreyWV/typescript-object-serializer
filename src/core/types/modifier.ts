/**
 * @class Modifier
 * @description Class to modify data on serialization and deserialization
 * @example
 * class StringToNumberModifier extends Modifier {
 *   public onDeserialize(data: string): number {
 *     return Number(data);
 *   }
 *   public onSerialize(data: number): string {
 *     return data.toString();
 *   }
 * }
 * It is possible to defile only one of methods, second method by default will be used
 */
export class Modifier {

  public onDeserialize(data: unknown): unknown {
    return data;
  }

  public onSerialize(data: unknown): unknown {
    return data;
  }

}
