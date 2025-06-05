import { clone } from './core/methods/clone';
import {
  create,
  createPartial,
} from './core/methods/create';
import { deserialize } from './core/methods/deserialize';
import { serialize } from './core/methods/serialize';
import {
  RecursiveObject,
  RecursivePartial,
} from './utils/recursive-type';

export class NonArrayDataError extends Error {
  constructor() {
    super('[Serializer] Array data should be passed to deserializeArray method');
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
    data: RecursiveObject<T>,
  ): InstanceType<T> {
    return create(this as never, data as never);
  }

  /**
   * @method create Create SerializableObject instance
   * !IMPORTANT This method get <RecursivePartial> values and set it as is
   *   Prefer to use create() method with strict type checking
   * @param data Plain object structured as current class
   * @returns Instance of current class
   */
  public static createPartial<T extends typeof SerializableObject>(
    this: T,
    data: RecursivePartial<T> = {},
  ): InstanceType<T> {
    return createPartial(this as never, data as never);
  }

  /**
   * @method deserialize Deserialize object to class
   * @param data { any } Object of serialized data
   * @returns Instance of current Serializable class
   */
  public static deserialize<T extends typeof SerializableObject>(
    this: T,
    data: unknown,
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
    data: unknown[],
  ): InstanceType<T>[] {
    if (!Array.isArray(data)) {
      throw new NonArrayDataError();
    }
    return data
      .map(
        dataItem => deserialize(this, dataItem),
      ) as InstanceType<T>[];
  }

  /**
   * @method serialize Serialize current instance
   * @returns { any } Object of serialized data
   */
  public serialize(): unknown {
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
