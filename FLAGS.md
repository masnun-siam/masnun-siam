# Feature flags

Each flag is a GitHub Actions repository variable, default off. Only a confirmed release turns one on.

| Flag | PRD | Epic | Default | Status |
|---|---|---|---|---|
| `FEATURE_PORTFOLIO_SITE` | [docs/prds/portfolio-site.md](docs/prds/portfolio-site.md) | #3 | off | released v0.1.0 |
| `FEATURE_SEO_AEO` | [docs/prds/seo-aeo.md](docs/prds/seo-aeo.md) | TBD | off | off |

`FEATURE_PORTFOLIO_SITE` gates only the production deploy job in `.github/workflows/deploy-site.yml`. Pull-request previews are not gated.
