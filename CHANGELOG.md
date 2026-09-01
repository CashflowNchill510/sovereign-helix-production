# Sovereign Helix Production Changelog

**Geohash:** `#AAC.11.11.1992`  
**Domain:** thesovereignhelix.com  
**Repository:** CashflowNchill510/sovereign-helix-production

## v0.1.0 — Organized production cut

**Date:** 2026-09-01  
**Status:** Code ready to deploy. Domain DNS still required.

### In this repo now

- `worker.js` — APIs + `/health`
- `public/index.html` — home
- `public/pricing.html` — Engine-as-a-Service checkout
- `public/studio.html` — idea studio
- `wrangler.jsonc` — worker name `sovereign-helix`
- GitHub Action deploy workflow
- Deployment + domain checklist

### Honest status

v1.0.0 was declared before the files existed. That label is retired until:

1. Worker deploys to `*.workers.dev`
2. `thesovereignhelix.com` resolves
3. Custom domain is attached
4. `/health` returns ok on the apex

NFT versioning remains phase 2. See `docs/NFT-VERSIONING.md`.
