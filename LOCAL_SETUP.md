# Run owae.ga locally

This download contains the complete source code and local image assets for the
owae.ga website.

## Requirements

- Node.js 22.13 or newer
- npm (included with Node.js)
- An internet connection for the first dependency installation

## Start the site on macOS or Linux

1. Open Terminal.
2. Drag the unzipped `owae-ga-local` folder into the Terminal window after
   typing `cd `, then press Return.
3. Install the project once:

   ```bash
   npm ci
   ```

4. Start the local site:

   ```bash
   npm run dev
   ```

5. Open the local address printed in Terminal, normally
   `http://localhost:5173`.

Stop the site with `Control + C` in Terminal.

## What works offline

Once the dependencies have been installed, the website layout, text, logo,
album artwork, and other images are available from the local folder. External
destinations—including Bandcamp, Spotify, Instagram, GitHub, and the separate
browser tools linked from the page—still require internet access.

## Editing

- Main page content: `app/page.tsx`
- Site styling: `app/globals.css`
- Browser title and description: `app/layout.tsx`
- Images and logos: `public/`

After saving a source file, the local page refreshes automatically.
