import { monthLabel, sortRoles, type Role } from './work.ts';

export type LlmsProfile = {
  name: string;
  tagline: string;
  location: string;
  about: readonly string[];
  email: string;
  socials: readonly { label: string; url: string }[];
};
export type LlmsRole = Role & { title: string; company: string; location: string; mode: string };
export type LlmsProject = { order: number; name: string; repo: string; description: string };
export type LlmsSkillGroup = { order: number; title: string; items: readonly string[] };

const section = (heading: string, lines: readonly string[]) =>
  lines.length > 0 ? [`## ${heading}`, lines.join('\n')] : [];

// llmstxt.org format, built from the same content as the page. An empty list drops its section.
export const buildLlmsTxt = (
  profile: LlmsProfile,
  roles: readonly LlmsRole[],
  projects: readonly LlmsProject[],
  skills: readonly LlmsSkillGroup[],
): string => {
  const work = sortRoles(roles).map(
    (r) =>
      `- ${r.title}, ${r.company} (${monthLabel(r.start)} – ${r.end ? monthLabel(r.end) : 'Present'}), ${r.location} · ${r.mode}`,
  );
  const projectLines = [...projects]
    .sort((a, b) => a.order - b.order)
    .map((p) => `- [${p.name}](${p.repo}): ${p.description}`);
  const skillLines = [...skills]
    .sort((a, b) => a.order - b.order)
    .map((s) => `- ${s.title}: ${s.items.join(', ')}`);
  const contact = [`- Email: ${profile.email}`, ...profile.socials.map((s) => `- [${s.label}](${s.url})`)];

  return (
    [
      `# ${profile.name}`,
      `> ${profile.tagline} — ${profile.location}`,
      ...profile.about,
      ...section('Work', work),
      ...section('Projects', projectLines),
      ...section('Skills', skillLines),
      ...section('Contact', contact),
    ].join('\n\n') + '\n'
  );
};
