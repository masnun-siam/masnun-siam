# Feature flags

Each flag is a GitHub Actions repository variable, default off. Only a confirmed release turns one on.

| Flag | PRD | Epic | Default | Status |
|---|---|---|---|---|
| `FEATURE_PORTFOLIO_SITE` | [docs/prds/portfolio-site.md](docs/prds/portfolio-site.md) | #3 | off | released v0.1.0 |
| `FEATURE_SEO_AEO` | [docs/prds/seo-aeo.md](docs/prds/seo-aeo.md) | #41 | off | released v0.2.0 |
| `FEATURE_CONTENT_REFRESH` | [docs/prds/content-refresh.md](docs/prds/content-refresh.md) | #62 | off | released v0.2.0 |

`FEATURE_PORTFOLIO_SITE` gates only the production deploy job in `.github/workflows/deploy-site.yml`. Pull-request previews are not gated.

`FEATURE_SEO_AEO` gates the sitemap, `llms.txt`, the `robots.txt` Sitemap line and the JSON-LD block, all read at build time. A pull-request run builds and tests both states and previews the flag-on build; a push to `main` or a manual `workflow_dispatch` on `main` builds in the state of the repository variable (unset means off).

`FEATURE_CONTENT_REFRESH` switches the content copy (`site/src/content/` vs `site/src/content/refresh/`) at build time. CI treats it like `FEATURE_SEO_AEO`: pull requests test the repository-variable state, then the all-unreleased-flags-on state (previewed); `main` builds once in the variable state.
