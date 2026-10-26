# Sayin – Marketing Website

The official static marketing website for **Sayin**, a personal finance and expense-splitting app for iOS and Android (iPhone, iPad, Android phones, and tablets), made by **Bagan Byte**.

- **Live URL:** [https://sayin.baganbyte.com](https://sayin.baganbyte.com)
- **Tech Stack:** Plain semantic HTML5, CSS3, and vanilla JavaScript. Zero build steps, zero third-party tracking scripts, zero frameworks.

---

## Folder Structure

Each page is an `index.html` inside its own directory so GitHub Pages serves clean URLs without `.html` extensions:

```
├── CNAME                     # sayin.baganbyte.com
├── index.html                # Homepage
├── 404.html                  # Custom 404 error page
├── privacy-policy/
│   └── index.html            # Privacy Policy (supports #my anchor)
├── privacy/
│   └── index.html            # Automatic redirect to /privacy-policy preserving hash
├── user-guide/
│   └── index.html            # English / Burmese user guide with contents and screenshots
├── news/
│   └── index.html            # News & Updates (release notes, EN/MY)
├── support/
│   └── index.html            # Support contacts & user feedback guide
├── assets/
│   ├── css/
│   │   └── style.css         # Theme tokens, Burmese typography, responsive layout
│   ├── js/
│   │   └── main.js           # Bilingual toggle (EN/မြန်မာ), theme toggle, carousel
│   ├── icons/
│   │   └── sayin-icon.svg    # Vector 3D app icon
│   ├── screens/              # App screenshot mockups (PNG & SVG)
│   ├── favicon.svg           # Vector favicon
│   ├── favicon.png           # 32x32 favicon
│   └── apple-touch-icon.png  # 180x180 iOS touch icon
└── README.md
```

---

## How to Deploy to GitHub Pages with Custom Domain

1. **Push to GitHub**:
   Push this entire repository to your GitHub repository (e.g. `baganbyte/sayin-website` or `sayin`).

2. **Enable GitHub Pages**:
   - In your GitHub repository, navigate to **Settings** > **Pages** (under the "Code and automation" section).
   - Under **Build and deployment**:
     - **Source**: Select `Deploy from a branch`.
     - **Branch**: Select `main` (or `master`) and directory `/ (root)`.
     - Click **Save**.

3. **Configure Custom Domain**:
   - Under **Custom domain**, enter `sayin.baganbyte.com` (this is automatically pre-configured by the `CNAME` file in the repository root).
   - Click **Save**.

4. **DNS Configuration (at your Domain Registrar / DNS Provider)**:
   Add a `CNAME` record in your DNS settings for the `baganbyte.com` zone:
   - **Type**: `CNAME`
   - **Name / Host**: `sayin`
   - **Value / Target**: `<your-github-username-or-org>.github.io.`
   - **TTL**: Automatic or 3600

5. **Enforce HTTPS**:
   - Once DNS propagates (usually a few minutes to an hour), return to GitHub repository **Settings** > **Pages**.
   - Check the **Enforce HTTPS** box. GitHub will automatically provision a free Let's Encrypt SSL certificate for `sayin.baganbyte.com`.

---

## Replacing Screenshots

To replace placeholder screenshots with your final production screenshots:
Place your device screenshots inside `/assets/screens/`:
- `screen-dashboard.png`
- `screen-groups.png`
- `screen-add.png`
- `screen-remittance.png`
- `screen-account.png`

Recommended aspect ratio: iPhone screen (e.g., 390x844 or 1179x2556).

---

## License

© Bagan Byte. All rights reserved.

## User guide

The `/user-guide/` page supports English and Burmese through the shared language switch. The Burmese source is `../sayin/docs/user-guide/USER_GUIDE_MY.md`, with screenshots and Myanmar fonts in `assets/user-guide/`. The guide is static HTML and works with both direct GitHub Pages hosting and the Vite build. When updating it, use the Markdown source as the reference; its content may be newer than the exported standalone HTML.

## Android APK download

The Android button currently downloads `/assets/downloads/sayin-android.apk` directly. To update the release, replace that file with the new release APK. The existing build copies `assets/` into `dist/assets/`; direct GitHub Pages hosting serves it from the same URL.
