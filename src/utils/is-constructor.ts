export function isConstructor(isConstructorSomething: any): boolean {
  if (typeof isConstructorSomething !== 'function') {
    return false;
  }
  try {
    isConstructorSomething();
    return false;
  } catch {
    return true;
  }
}
