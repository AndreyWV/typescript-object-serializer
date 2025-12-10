/**
 * @class Modifier
 * @description Class to modify data on serialization and deserialization
 * @example
 * class StringToNumberModifier extends Modifier {
 *   public override onDeserialize(data: string): number {
 *     return Number(data);
 *   }
 *   public override onSerialize(data: number): string {
 *     return data.toString();
 *   }
 * }
 * Methods override is optional. By default data is not modified.
 */
export class Modifier {

  public onDeserialize(data: unknown): unknown {
    return data;
  }

  public onSerialize(data: unknown): unknown {
    return data;
  }

}
