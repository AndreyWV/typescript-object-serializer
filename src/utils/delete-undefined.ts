export function deleteUndefinedRecursive<T extends object>(sourceObject: T): T {

  if (typeof sourceObject !== 'object' || Array.isArray(sourceObject) || sourceObject === null) {
    return sourceObject;
  }

  const resultObject: T = {} as any;

  (Object.keys(sourceObject) as Array<keyof T>).forEach(key => {

    if (!sourceObject[key]) {
      if (sourceObject[key] === undefined) {
        return;
      }
    }

    resultObject[key] = deleteUndefinedRecursive(sourceObject[key] as any);
  });

  return resultObject;
}
