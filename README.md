# owae.ga

The 2026 owae.ga website, built with Next.js and deployed on Vercel.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm test
npm run lint
```

The test suite builds the production site and verifies that the homepage and
all preserved browser-tool URLs return successfully.

## Deployment

Vercel builds the site with `npm run build`. The legacy browser tools are kept
in `public/` so their original URLs, including `/Swiss-VJ.html` and
`/Beatmaker_Cues.html`, remain available.
