# Docker Builder · Build GitHub Repos into Docker Images in One Click

> Paste a GitHub repo URL and build it into a Docker image, then push it to GHCR / Docker Hub.
> The build runs on your own GitHub Actions — the target repo only needs to be readable, no write access required.

[中文 README](./README.md)

## What It Is

Docker Builder is an image-building tool powered by **Cloudflare Workers + GitHub Actions**:

- The frontend (static assets) is served by a Cloudflare Worker — plain vanilla JS, no framework;
- You enter a **target repo URL**, the Worker checks access, lists branches / tags, and validates the Dockerfile;
- After you log in to GitHub and configure build options, the Worker dispatches `workflow_dispatch` to the **build-host repo** (your own fork);
- The target repo is only cloned → built → pushed. Public repos are cloned anonymously; only private repos need a read token.

## Highlights

- **One-click build**: a 3-step wizard (detect repo → configure build → watch progress), no local tools required;
- **No-login detection for public repos**: the frontend calls the GitHub API directly; public repos need no token;
- **Multi-architecture builds**: `linux/amd64`, `linux/arm64`, `linux/arm/v7`, `linux/386` (QEMU enabled automatically);
- **Multiple registries**: GHCR (default) and/or Docker Hub;
- **Image visibility**: public / private (public by default), auto-set on GHCR after the push;
- **Built-in env vars**: bake `ENV` (KEY=VALUE) into the image — builds a `-base` image plus an overlay;
- **Bilingual UI**: Chinese / English switch, preference saved in browser localStorage;
- **Session restore**: refresh / OAuth redirect returns you to the same step with the form refilled, without re-running detection.

## How It Works

```
User browser
   │  ① Enter repo URL (frontend calls GitHub API directly; public repos need no token)
   │  ② Log in with GitHub (OAuth) or a manual token → check fork status
   │  ③ Configure: image tag / platforms / registry / visibility / env vars
   ▼
Cloudflare Worker (this repo)
   │  ④ Verify the user has forked the build-host (default smanx/docker-builder) with Actions enabled
   │  ⑤ Encrypt Docker Hub / private-repo read credentials into the fork's Actions secrets
   │  ⑥ Trigger the build via workflow_dispatch on your fork
   ▼
GitHub Actions (your own fork)
   │  ⑦ Clone the target repo (anonymous for public / GH_PAT for private) → detect root Dockerfile
   │  ⑧ Build multi-arch → push to GHCR / Docker Hub → set GHCR package visibility
   ▼
Images on ghcr.io / Docker Hub
```

> Key idea: the **target repo** is only cloned and built — you need no write access to it.
> The **build-host repo** is your fork of `docker-builder` (Actions are off by default on forks — enable them once).

## Quick Start

### 1. Deploy the Worker

```bash
npm install
npx wrangler login
npx wrangler deploy
```

### 2. Configure the OAuth App

1. Create an OAuth App on GitHub (Settings → Developer settings → OAuth Apps), callback URL:
   `https://your-worker-domain/api/auth/callback`;
2. Set two secrets (for GitHub login, scope `repo + workflow`):

```bash
npx wrangler secret put GH_OAUTH_CLIENT_ID
npx wrangler secret put GH_OAUTH_CLIENT_SECRET
```

### 3. Prepare the build-host repo (important)

Before building, every user must:

1. **Fork** `smanx/docker-builder` into their own account (the Worker validates the fork status and guides you);
2. **Enable GitHub Actions** on the fork (disabled by default on forks).

> The build-host source repo can be overridden via `[vars] BUILDER_SOURCE = "owner/repo"` (see `wrangler.toml`).
> After changing the source repo, re-fork and re-run `wrangler deploy`.

### Local development

```bash
npm run dev
```

Put local secrets in `.dev.vars` (see `.dev.vars.example`, ignored by `.gitignore`).

## Build Flow

| Step | What happens |
| --- | --- |
| Step 1 · Detect | Enter `https://github.com/owner/repo` or `owner/repo`; public repos are detected anonymously, private repos need a "detect token"; default branch / branches / tags are listed, and a Dockerfile check is run on the selected version |
| Step 2 · Configure | GitHub login or manual token (needs `repo + workflow` scopes) → check fork status → set image tag, platforms, registry, visibility, env vars |
| Step 3 · Progress | Polls the GitHub Actions run status in real time ("trigger → build → push"), then prints the image address and `docker pull` command |

## API Endpoints

| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/health` | GET | Health check |
| `/api/whoami` | GET | Current logged-in user (requires Bearer token) |
| `/api/auth/login` | GET | Redirect to GitHub OAuth |
| `/api/auth/callback` | GET | OAuth callback; exchanges code for an access token |
| `/api/fork-status` | GET | Whether the user has forked the build-host and enabled Actions |
| `/api/build` | POST | Validate fork → write secrets → dispatch workflow_dispatch |
| `/api/status` | GET | Query build status for a run_id (queued / in_progress / completed) |

## Configuration

| Key | Type | Description |
| --- | --- | --- |
| `GH_OAUTH_CLIENT_ID` / `GH_OAUTH_CLIENT_SECRET` | Secret | GitHub OAuth credentials (scope `repo + workflow`) |
| `GH_OAUTH_CALLBACK_URL` | Secret (optional) | Custom OAuth callback URL; defaults to `<origin>/api/auth/callback` |
| `BUILDER_SOURCE` | Var | Build-host source repo, default `smanx/docker-builder` |

> On every build the Worker writes / removes secrets on your fork:
> `DOCKERHUB_USERNAME` / `DOCKERHUB_TOKEN` (only when Docker Hub is selected) and `GH_PAT` (only for private target repos).
> Values are encrypted with a libsodium-compatible `crypto_box_seal` before being stored — never in plain text.

## Project Layout

```
public/              Frontend assets (index.html / style.css / app.js, vanilla JS)
src/index.js         Worker entry: /api/* → API handlers, everything else → static assets
src/api/             API routes (auth / whoami / fork / build / status)
src/github.js        GitHub API wrapper (repos, Actions secrets, workflow_dispatch, runs)
src/crypto.js        libsodium-compatible sealed box (for writing secrets)
src/util.js          Helpers (token parsing, repo URL parsing, platform / env-var validation)
.github/workflows/
  docker-build.yml   Build-host workflow (triggered via workflow_dispatch)
wrangler.toml        Worker config (static assets binding, BUILDER_SOURCE)
```

## Notes / Limitations

- **Dockerfile must be at the repo root**: `Dockerfile` or a `Dockerfile.*` variant is supported, otherwise the build fails;
- **GHCR visibility**: set automatically by the workflow via the GitHub API after the push; first pushes may have propagation delay — failure does not abort the build (a warning link is shown);
- **Docker Hub visibility**: Docker Hub has no API to set it — it follows the repo's default setting and must be adjusted manually on the Docker Hub website;
- **Private target repos**: provide a token that can read it in step 1 (or use the logged-in account if it has access — it is reused automatically);
- **Docker Hub credentials**: only required when Docker Hub is selected — username + Access Token (Read & Write permission).

## License

MIT
