# Vercel Preview Domain for `dev.roboddl.com`

This repository is already safe to keep the public website on `main` because GitHub Pages only deploys from `main`.

To expose the `dev` branch on a separate preview domain such as `dev.roboddl.com`, use Vercel for the preview deployment while keeping the existing GitHub Pages setup for production.

## Recommended setup

1. Import this repository into Vercel as a new project.
2. Keep `main` as the Production Branch in Vercel.
3. Push the `dev` branch to GitHub.
4. In Vercel, open the project and confirm that the `dev` branch creates a Preview Deployment.
5. Add `dev.roboddl.com` under the project's Domains settings.
6. Bind that domain to the `dev` branch preview deployment in the Vercel UI.
7. In your DNS provider, add the DNS record value that Vercel shows for `dev.roboddl.com`.

## Why this setup

- `main` stays isolated for the public website.
- `dev` gets its own URL and can change independently.
- Additional branches still get disposable preview URLs from Vercel when needed.

## Notes

- This repository includes `vercel.json` so Vercel uses `npm ci`, `npm run build`, and publishes `dist/`.
- `.vercel/` is ignored so local Vercel metadata does not get committed.
- `public/CNAME` is still for the existing GitHub Pages production deployment and does not affect Vercel preview hosting.
