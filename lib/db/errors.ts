export function isUniqueViolation(error: unknown): boolean {
  let current: unknown = error;

  for (let depth = 0; depth < 5 && current; depth += 1) {
    if (typeof current !== "object") return false;

    if ("code" in current && current.code === "23505") return true;

    current = "cause" in current ? current.cause : null;
  }

  return false;
}
