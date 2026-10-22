import { currentRole, type Role } from './work.ts';

const ORIGIN = 'https://masnunsiam.com';
const SITE_ID = `${ORIGIN}/#website`;
const PAGE_ID = `${ORIGIN}/#profilepage`;
const PERSON_ID = `${ORIGIN}/#person`;

export type Profile = {
  name: string;
  tagline: string;
  location: string;
  socials: readonly { url: string }[];
};
export type WorkRole = Role & { company: string; title: string };
export type SkillGroup = { items: readonly string[] };

// Location split at its last comma: "Dhaka, Bangladesh" -> locality + country. No comma, no address.
const address = (location: string) => {
  const i = location.lastIndexOf(',');
  if (i < 0) return undefined;
  return {
    '@type': 'PostalAddress',
    addressLocality: location.slice(0, i).trim(),
    addressCountry: location.slice(i + 1).trim(),
  };
};

export const buildGraph = (
  profile: Profile,
  roles: readonly WorkRole[],
  skills: readonly SkillGroup[],
  page: { url: string; title: string },
) => {
  const role = currentRole(roles);
  const knowsAbout = [...new Set(skills.flatMap((s) => s.items))];
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': SITE_ID, url: `${ORIGIN}/`, name: profile.name, inLanguage: 'en' },
      {
        '@type': 'ProfilePage',
        '@id': PAGE_ID,
        url: page.url,
        name: page.title,
        isPartOf: { '@id': SITE_ID },
        mainEntity: { '@id': PERSON_ID },
      },
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: profile.name,
        url: `${ORIGIN}/`,
        description: profile.tagline,
        ...(role && { jobTitle: role.title, worksFor: { '@type': 'Organization', name: role.company } }),
        ...(address(profile.location) && { address: address(profile.location) }),
        ...(knowsAbout.length > 0 && { knowsAbout }),
        sameAs: profile.socials.map((s) => s.url),
      },
    ],
  };
};

// Escapes <, > and & so no value can close the script element; still valid JSON.
export const serialize = (graph: unknown): string =>
  JSON.stringify(graph).replace(/[<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);
