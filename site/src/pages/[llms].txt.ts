import { getCollection } from 'astro:content';
import type { APIRoute, GetStaticPaths } from 'astro';
import { isSeoAeoOn } from '../lib/flag.ts';
import { buildLlmsTxt } from '../lib/llms.ts';

// Flag off: no path, so no llms.txt is built.
export const getStaticPaths = (() => (isSeoAeoOn() ? [{ params: { llms: 'llms' } }] : [])) satisfies GetStaticPaths;

export const GET: APIRoute = async () => {
  const data = async (name: 'work' | 'projects' | 'skills') => (await getCollection(name)).map((e) => e.data);
  const [profile] = (await getCollection('profile')).map((e) => e.data);
  const body = buildLlmsTxt(profile, await data('work'), await data('projects'), await data('skills'));
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
