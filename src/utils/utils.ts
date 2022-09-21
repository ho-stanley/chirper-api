export function isLimitValid(limit: number | undefined) {
  if (!limit) return false;
  return !Number.isNaN(limit) && limit > 0;
}
