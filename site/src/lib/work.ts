export type Role = { start: string; end?: string };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// YYYY-MM -> "Mon YYYY"; no Date/Intl, which shift by time zone.
export const monthLabel = (ym: string): string => {
  const [y, m] = ym.split('-');
  return `${MONTHS[Number(m) - 1]} ${y}`;
};

// Ongoing roles first, then newest end, ties by newest start. YYYY-MM compares as a string.
export const sortRoles = <T extends Role>(roles: readonly T[]): T[] =>
  [...roles].sort((a, b) => {
    if (!a.end !== !b.end) return a.end ? 1 : -1;
    return (b.end ?? '').localeCompare(a.end ?? '') || b.start.localeCompare(a.start);
  });

// The role with no end; if several, the newest start.
export const currentRole = <T extends Role>(roles: readonly T[]): T | undefined =>
  sortRoles(roles).find((r) => !r.end);
