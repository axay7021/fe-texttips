# Deployment setup and TODO

Deploy the full Next.js app, including its API routes, to Vercel under 190020107022ait@gmail.com, personal scope akshay-dobariyas-projects. No separate backend is needed.

The current connection can read this account but project creation returned 403 because team/scope consent is missing. Authorize the existing connection for team_VifP2fo09snOry74VZ0VlNYH, then create/import axay7021/fe-texttips as a Next.js project.

Set a securely generated BETTER_AUTH_SECRET in encrypted Vercel environment variables. Set NEXT_PUBLIC_APP_URL and BETTER_AUTH_URL to the actual deployed origin. Set a real MONGODB_URI (MongoDB Atlas free M0 is an option; creation and database credentials require an account connection). Configure SMTP_USER and SMTP_PASSWORD in Vercel; signup requires verification mail. OAuth and payment credentials are optional and must not be invented.

Missing database/auth/AI configuration returns a clear 503 on the relevant routes. No localhost database is provisioned or supplied as a deployment credential. A build passing with empty provider keys verifies compilation only.

## TODO — owner adds provider keys later

- [ ] AI_PROVIDER=google is the default. Leave GEMINI_API_KEY empty until the owner adds it in Vercel Project Settings → Environment Variables. If choosing openai or anthropic, set that provider's server-only key instead.
- [ ] Redeploy after configuration changes.
- [ ] Verify signup, verification email, login, MongoDB usage storage and a real streaming rewrite end to end.
- [ ] Verify payments only after real payment credentials are configured; do not claim payments work before then.
- [ ] Add the real frontend URL to the portfolio only after successful deployment and checks.

## Hosting update — 30 October 2026

Vercel personal workspace access is approved. The project is created under team_VifP2fo09snOry74VZ0VlNYH. Earlier 403/access-grant notes above are historical and no longer the blocker.

Public production frontend: https://texttips.vercel.app
Vercel project ID: prj_VBg2wKkqCIkA9QUxELcDW6PtqxPC

This is a real application deployment, with explicit unavailable/configuration-pending states where required services are missing. It does not imply that AI, authentication, storage or billing integrations are operational. Provider keys remain empty intentionally.

Vercel GitHub integration was unavailable for repository import. The current deployment uses a direct source wrapper that downloads an immutable public GitHub commit before installation/build. Private .env files are excluded. Automatic Git deployments remain TODO; install the Vercel GitHub integration and link this repository to enable them. Use pinned pnpm versions for both install and build, because Vercel's fallback pnpm version can be too old for these manifests.

The custom frontend domain is attached in Vercel but its Name.com DNS records have not been applied. Domain ownership verification is not proof that DNS routing or TLS is ready. Preserve existing portfolio and email records. See the task-level DNS_RECORDS.md for the returned per-project CNAME targets.
