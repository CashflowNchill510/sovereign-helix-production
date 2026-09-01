# Deployment — TheSovereignHelix.com

Canonical domain: `thesovereignhelix.com`  
Worker name: `sovereign-helix`  
Repo: `CashflowNchill510/sovereign-helix-production`  
Vault (do not deploy): `CashflowNchill510/The-Solveriegn-Helix`

## You still do by hand

1. Buy or transfer `thesovereignhelix.com`.
2. Add the zone in Cloudflare. Point registrar nameservers to Cloudflare.
3. Wait until the hostname resolves.
4. Create a Cloudflare API token: Account → Workers Scripts Edit + Zone → Workers Routes Edit.
5. GitHub repo → Settings → Secrets → Actions → `CLOUDFLARE_API_TOKEN`.
6. First deploy:
   ```bash
   npm install
   npx wrangler login
   npx wrangler deploy
   ```
7. Dashboard → Workers & Pages → `sovereign-helix` → Settings → Domains & Routes → Add Custom Domain → `thesovereignhelix.com` and `www.thesovereignhelix.com`.
8. Optional later: add `solveriegnhelix.com` as a redirect zone.

Do not put custom domains in wrangler until the zone exists. Routes with a missing zone fail the deploy.

## Bindings

- `AI` — Workers AI (required for `/api/*`)
- `ASSETS` — `./public` (automatic from wrangler.jsonc)

## Verify

```bash
curl https://sovereign-helix.<account>.workers.dev/health
curl https://thesovereignhelix.com/health
```

Expect `{ "ok": true, "version": "0.1.0" }`.

## What this repo is not

Not the dump. No zips, no tarballs, no loop notes, no personal PDFs. Those stay in the vault.
