# Google and verified email sign-in

Email/password is retained. Better Auth requires email verification, sends a one-hour link on signup or unverified signin, and signs in after successful verification. The verification screen retains the correct recipient for resends. Google OAuth is registered only when both Google credentials are present; social sign-in errors are displayed.

## Vercel environment

- MONGODB_URI: persistent MongoDB connection (still pending)
- BETTER_AUTH_SECRET: already configured; preserve its value
- BETTER_AUTH_URL=https://texttips.akshaydobariya.dev
- NEXT_PUBLIC_APP_URL=https://texttips.akshaydobariya.dev
- GOOGLE_CLIENT_ID: Google Cloud Web application client ID
- GOOGLE_CLIENT_SECRET: matching client secret
- SMTP_HOST=smtp.gmail.com, SMTP_PORT=587 (or 465)
- SMTP_USER: authorized sender email
- SMTP_PASSWORD: app password / SMTP credential, never a regular Gmail password
- SMTP_FROM: optional authorized sender address

Register this exact redirect URI in Google Cloud:

https://texttips.akshaydobariya.dev/api/auth/callback/google

Keep secrets in Vercel and the ignored local .env. Do not expose client secrets through NEXT_PUBLIC_ variables. Existing provider fields remain blank. Missing configuration yields explicit 503 responses; failed mail delivery is never reported as successful. Google sign-in can work independently of SMTP once Google and MongoDB are configured.

Browser tests exercise signup, verification/resend using the original email, and the unverified-password flow with mocked auth responses. Real Google consent, persistent MongoDB auth and actual email delivery require credentials and live checks.
