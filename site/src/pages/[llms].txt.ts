import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { isSeoAeoOn } from '../lib/flag.ts';
import { buildLlmsTxt } from '../lib/llms.ts';

// Flag off: no path, so no llms.txt is built.
export const getStaticPaths = (() => (isSeoAeoOn() ? [{ params: { llms: 'llms' } }] : [])) satisfies GetStaticPaths;

export const GET: APIRoute = async () => {
  const [profile] = (await getCollection('profile')).map((e) => e.data);
  const roles = (await getCollection('work')).map((e) => e.data);
  const projects = (await getCollection('projects')).map((e) => e.data);
  const skills = (await getCollection('skills')).map((e) => e.data);
  const body = buildLlmsTxt(profile, roles, projects, skills);
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
