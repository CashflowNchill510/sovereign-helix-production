# sovereign-helix-production

Thin public cut for **thesovereignhelix.com**.

Worker `sovereign-helix` + static pages in `public/`.

Vault / experiments: `The-Solveriegn-Helix` (do not deploy that repo).

## Local

```bash
npm install
npx wrangler dev
```

## Ship

```bash
npx wrangler deploy
```

Then attach custom domain in Cloudflare. See `docs/DEPLOYMENT.md`.

Health: `/health`

Geohash: `#AAC.11.11.1992`  
Tag: `#MYGEO`
