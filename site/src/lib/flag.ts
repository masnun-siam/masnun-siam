export const isSeoAeoOn = (env: NodeJS.ProcessEnv = process.env): boolean =>
  env.FEATURE_SEO_AEO === 'true';

export const isContentRefreshOn = (env: NodeJS.ProcessEnv = process.env): boolean =>
  env.FEATURE_CONTENT_REFRESH === 'true';
