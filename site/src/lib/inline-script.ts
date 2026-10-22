// Fail closed: only an exactly-typed JSON-LD data block skips the CSP hash check.
export const needsCspHash = (attrs: string): boolean =>
  !/\ssrc=/.test(attrs) && attrs !== ' type="application/ld+json"';
