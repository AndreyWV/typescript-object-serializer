import { RecursivePartial } from './base-types/recursive-partial';
import { clone } from './methods/clone';
import { create } from './methods/create';
import { deserialize } from './methods/deserialize';
import { serialize } from './methods/serialize';

type RecursiveWithoutBase<T> = {
  [K in keyof T]: T[K] extends SerializableObject ?
  SerializableObjectWithoutBase<T[K]> :
  T[K] extends Array<SerializableObject> ?
  Array<SerializableObjectWithoutBase<T[K][number]>> :
  T[K];
};

export type SerializableObjectWithoutBase<T extends Partial<SerializableObject>> =
  RecursiveWithoutBase<Pick<T, Exclude<keyof T, keyof SerializableObject>>>;

type SerializableObjectData<T extends typeof SerializableObject, I extends InstanceType<T> = InstanceType<T>> =
  RecursivePartial<SerializableObjectWithoutBase<I>>;

export class NonArrayDataError extends Error {
  constructor() {
    super('Array data should be passed to deserializeArray method');
  }
}

/**
 * SerializableObject - basic class for serializable descendants
 */
export class SerializableObject {

  /**
   * @method create Create SerializableObject instance
   * @param data Plain object structured as current class
   * @returns Instance of current class
   */
  public static create<T extends typeof SerializableObject>(
    this: T,
    data: SerializableObjectData<T> = {},
  ): InstanceType<T> {
    return create(this as any, data as any);
  }

  /**
   * @method deserialize Deserialize object to class
   * @param data { any } Object of serialized data
   * @returns Instance of current Serializable class
   */
  public static deserialize<T extends typeof SerializableObject>(
    this: T,
    data: any,
  ): InstanceType<T> {
    return deserialize(this, data) as InstanceType<T>;
  }

  /**
   * @method deserialize Deserialize array of objects
   * @param data { Array } Array of serialized data
   * @returns Array of current Serializable class items
   */
  public static deserializeArray<T extends typeof SerializableObject>(
    this: T,
    data: any[],
  ): InstanceType<T>[] {
    if (!Array.isArray(data)) {
      throw new NonArrayDataError();
    }
    return data.map(data => deserialize(this, data)) as InstanceType<T>[];
  }

  /**
   * @method serialize Serialize current instance
   * @returns { any } Object of serialized data
   */
  public serialize(): any {

    return serialize(this);

  }

  /**
   * @method clone Create same object as current (including deep serializable instances)
   * @returns New instance of current instance class
   */
  public clone(): this {
    return clone(this);
  }
}
