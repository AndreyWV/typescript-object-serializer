/**
 * @class Modifier
 * @description Class to modify data before and after serialization
 */
export class Modifier {

  public beforeDeserialize(data: unknown): unknown {
    return data;
  }

  public afterSerialize(data: unknown): unknown {
    return data;
  }

}
