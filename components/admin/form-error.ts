export function getFieldError(
  errors: Record<string, string>,
  path: string,
): string | undefined {
  if (errors[path]) return errors[path];

  const prefix = `${path}.`;

  for (const [key, message] of Object.entries(errors)) {
    if (key.startsWith(prefix)) return message;
  }

  return undefined;
}
