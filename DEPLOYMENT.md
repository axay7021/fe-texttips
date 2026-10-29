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
