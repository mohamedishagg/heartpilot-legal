# heartpilot-legal

The public site at https://heartpilot.org, served by GitHub Pages from `main`.
One landing page, plus the legal pages. Plain HTML, CSS and a little vanilla JS.
No framework, no build step, no external scripts, fonts, analytics, trackers or cookies.

## Structure

| Path | What it is |
|---|---|
| `index.html` | The landing page: hero, why it helps, benefits, how it works, proof, FAQ, waitlist and contact. English and Arabic in one file |
| `404.html` | Not found page, same style |
| `privacy-policy.html`, `terms-of-service.html` | The legal pages. Do not move or rename; the app links to them |
| `CNAME` | The custom domain. Do not edit |
| `assets/css/styles.css` | All styling, light and dark mode, right-to-left via logical properties |
| `assets/js/main.js` | Language toggle and mailto subject. Nothing else |
| `assets/logo-128.png` | The app icon, rounded, used as the logo |
| `assets/*.png` | Favicon, apple-touch-icon, `og-image.png` (1200x630) |
| `robots.txt`, `sitemap.xml` | SEO |
| `docs/arabic-review.md` | Every Arabic string next to its English, for a native reviewer |
| `docs/screenshots/` | QA screenshots at 390, 768 and 1440 px, English and Arabic |

## Colours and font

The app's own theme: brand teal `#166B5C`, navy `#10314A`, canvas `#FAF9F7`, and the
cream of the app icon. They are CSS variables at the top of `assets/css/styles.css`,
with a dark-mode set under `prefers-color-scheme`. Arial throughout (a system font,
nothing is hosted). Thmanyah and Anton were tried and dropped; Thmanyah's licence
forbids hosting the files on a website.

## Editing copy

Every sentence appears twice, side by side:

```html
<span data-l="en">English text</span><span data-l="ar" lang="ar">النص العربي</span>
```

CSS shows one according to `<html lang>`. Edit both spans and update the matching
row in `docs/arabic-review.md`. Accessibility labels use `aria-label` plus
`data-aria-en` and `data-aria-ar`. The Arabic page title and description are
`<meta name="title-ar">` and `<meta name="description-ar">` in the head.

Placeholders still to fill in `index.html` (search for `PLACEHOLDER`): the proof
section (real testimonials or pilot results, with permission), pricing (the FAQ says
"not announced yet"), and the contact address (`legal@heartpilot.org`, used in the
mailto link and the JSON-LD block).

## Deploy

Commit and push to `main`. Pages rebuilds in a minute or two. Settings that must
stay on: Settings > Pages > "Deploy from a branch" (`main`, `/`), custom domain
`heartpilot.org`, and "Enforce HTTPS" ticked.

Before pushing, check: no request leaves the site (browser network tab), the page
works at 390 px, and `privacy-policy.html`, `terms-of-service.html` and `CNAME` are
unchanged (`git diff --stat`).
