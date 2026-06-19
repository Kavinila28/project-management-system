type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const limitWindowMs = 60 * 1000;
const maxRequests = 8;
const entries = new Map<string, RateLimitEntry>();

function getClientKey(reqIp: string | null, route: string) {
  return `${route}:${reqIp ?? "unknown"}`;
}

export function allowRequest(reqIp: string | null, route: string) {
  const key = getClientKey(reqIp, route);
  const now = Date.now();
  const entry = entries.get(key);

  if (!entry || entry.resetAt <= now) {
    entries.set(key, { count: 1, resetAt: now + limitWindowMs });
    return true;
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count += 1;
  entries.set(key, entry);
  return true;
}

export function getClientIp(reqHeaders: Headers) {
  return (
    reqHeaders.get("x-real-ip") ||
    reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}
