export function getConstructorPropertyName(c: any, index: number): string | undefined {
  const regex = /constructor\((.*?)\)/;
  const ctorString = String(c);
  const match = regex.exec(ctorString);
  const names = match?.[1];
  if (!names) {
    return;
  }
  const ctorName = names.split(',')[index];
  if (ctorName) {
    const ownPropertyRegExp = new RegExp(`this\\.\([a-zA-Z\d]*?\)\\s?=\\s?${ctorName.trim()}`);
    const ownPropertyMatch = ownPropertyRegExp.exec(ctorString);
    return ownPropertyMatch?.[1];
  }
}
