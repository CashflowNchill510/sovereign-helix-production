# Repo map

| Repo | Job | Deploy? |
|---|---|---|
| sovereign-helix-production | Public Worker + landing + pricing + studio | YES |
| The-Solveriegn-Helix | Workshop / dump / history | NO |
| nexus-bay | Early HTML experiment | NO — studio copied here |
| codespaces-blank | Empty codespace | NO |

## Production tree

```
worker.js                 edge API + health
wrangler.jsonc            worker name sovereign-helix
package.json              wrangler scripts
public/index.html         home
public/pricing.html       Stripe engine checkout
public/studio.html        idea studio
.github/workflows/deploy.yml
docs/DEPLOYMENT.md
docs/DOMAIN-CHECKLIST.md
docs/NFT-VERSIONING.md    phase 2 — do not block domain
```

## Vault files that stay vaulted

Duplicates, `mimoclaw_workspace*.tar.gz`, `File_078.md`, personal PDFs, 100-loop notes, unused crypto polyfills, Cloudflare template zip.

Promote a file here only when it has one job on the public domain.
