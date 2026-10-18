import { defineCollection } from 'astro:content';
import { file, type LoaderContext } from 'astro/loaders';
import { z } from 'astro/zod';

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Expected YYYY-MM');
const httpsUrl = z.url({ protocol: /^https$/ });

const profile = defineCollection({
	loader: file('src/content/profile.yaml'),
	schema: z.object({
		name: z.string().min(1),
		tagline: z.string().min(1),
		location: z.string().min(1),
		about: z.array(z.string().min(1)).min(1).max(3),
		email: z.email(),
		socials: z.array(z.object({ label: z.string().min(1), url: httpsUrl })),
	}),
});

const work = defineCollection({
	loader: file('src/content/work.yaml'),
	schema: z
		.object({
			company: z.string().min(1),
			title: z.string().min(1),
			start: yearMonth,
			// Missing end means the role is current ("Present").
			end: yearMonth.optional(),
			location: z.string().min(1),
			mode: z.enum(['Remote', 'On-site', 'Hybrid']),
			highlights: z.array(z.string().min(1)).min(1).max(4),
			tags: z.array(z.string().min(1)),
		})
		// YYYY-MM strings compare correctly as plain strings.
		.refine((role) => role.end === undefined || role.end >= role.start, {
			message: 'end must not be before start',
			path: ['end'],
		}),
});

const projectsFile = file('src/content/projects.yaml');

const projects = defineCollection({
	// A schema validates one entry at a time, so unique `order` is checked after the file loads.
	loader: {
		name: 'projects-loader',
		load: async (context: LoaderContext) => {
			await projectsFile.load(context);
			const seen = new Map<number, string>();
			for (const { id, data } of context.store.values()) {
				const order = data.order as number;
				const other = seen.get(order);
				if (other !== undefined) {
					throw new Error(`projects: "${id}" and "${other}" share order ${order}`);
				}
				seen.set(order, id);
			}
		},
	},
	schema: z.object({
		order: z.number().int(),
		name: z.string().min(1),
		description: z.string().min(1).max(140),
		repo: z.url({ hostname: /^github\.com$/, protocol: /^https$/ }),
		demo: z.url().optional(),
		tags: z.array(z.string().min(1)).min(1).max(5),
	}),
});

const skills = defineCollection({
	loader: file('src/content/skills.yaml'),
	schema: z.object({
		order: z.number().int(),
		title: z.string().min(1),
		items: z.array(z.string().min(1)).min(1),
	}),
});

export const collections = { profile, work, projects, skills };
