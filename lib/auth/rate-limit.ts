const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

function prune(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  prune(now);
  const bucket = buckets.get(key);

  if (!bucket) return false;
  if (bucket.resetAt <= now) {
    buckets.delete(key);
    return false;
  }

  return bucket.count >= MAX_ATTEMPTS;
}

export function recordFailure(key: string): void {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return;
  }

  bucket.count += 1;
}

export function clearFailures(key: string): void {
  buckets.delete(key);
}

export const rateLimitWindowMinutes = WINDOW_MS / 60000;
