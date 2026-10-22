export const isSeoAeoOn = (env: NodeJS.ProcessEnv = process.env): boolean =>
  env.FEATURE_SEO_AEO === 'true';
