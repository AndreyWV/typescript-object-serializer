export function getConstructorPropertyName(c: any, index: number): string | undefined {
  const regex = /constructor\((.*)\)/;
  const match = regex.exec(String(c));
  const names = match?.[1];
  if (!names) {
    return;
  }
  return names.split(', ')[index];
}
