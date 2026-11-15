# heartpilot-legal

The public site at https://heartpilot.org, served by GitHub Pages from `main`.
Plain HTML, CSS and a little vanilla JS. No framework, no build step, no external
scripts, fonts, analytics, trackers or cookies.

## Structure

| Path | What it is |
|---|---|
| `index.html` | The landing page (English and Arabic in one file) |
| `404.html` | Not found page, same style |
| `privacy-policy.html`, `terms-of-service.html` | The legal pages. Do not move or rename; the app links to them |
| `CNAME` | The custom domain. Do not edit |
| `assets/css/styles.css` | All styling, light and dark mode, RTL via logical properties |
| `assets/js/main.js` | Language toggle, mobile menu, mailto subject. Nothing else |
| `assets/fonts/` | IBM Plex Sans Arabic (SIL OFL), Arabic subset, self-hosted. English uses system fonts |
| `assets/*.png` | Favicon, apple-touch-icon (the app icon), `og-image.png` (1200x630) |
| `robots.txt`, `sitemap.xml` | SEO. Add new pages to the sitemap |
| `docs/arabic-review.md` | Every Arabic string next to its English, for a native reviewer |
| `docs/screenshots/` | QA screenshots at 390, 768 and 1440 px, English and Arabic |

## Editing copy

Every sentence appears twice in `index.html`, side by side:

```html
<span data-l="en">English text</span><span data-l="ar" lang="ar">النص العربي</span>
```

CSS shows one and hides the other according to `<html lang>`. Edit both spans, and
update the matching row in `docs/arabic-review.md`. Accessibility labels use
`aria-label` plus `data-aria-en` and `data-aria-ar` (kept in step by `main.js`).
The page title and description for Arabic are in `main.js`.

Placeholders still to fill in `index.html`: the "Clinically led" section (bio,
approved title, photo permission) and the contact address (`legal@heartpilot.org`,
used in the `mailto:` link and the JSON-LD block).

## Deploy

Commit and push to `main`. Pages rebuilds in a minute or two. Settings that must
stay on: Settings > Pages > Source "Deploy from a branch" (`main`, `/`), custom
domain `heartpilot.org`, and "Enforce HTTPS" ticked.

Before pushing, check: no request leaves the site (browser network tab), the
page works at 390 px, and `privacy-policy.html`, `terms-of-service.html` and
`CNAME` are unchanged (`git diff --stat`).
