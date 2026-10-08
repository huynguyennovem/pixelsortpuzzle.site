# Pixel Dunes — landing page

Static site: plain HTML, one CSS file, one small JS file. No build step.

```
index.html     landing page
privacy.html   privacy policy (needed for the store listings)
support.html   support page, served at /support: email form + direct address (use as the App Store "Support URL")
app-ads.txt    AdMob authorized-sellers file — must be served at the domain root
css/ js/ assets/
```

## Preview locally

```bash
python3 tools/serve_landingpage.py        # from the repo root; http://127.0.0.1:8000/
```

Use this instead of `python3 -m http.server`: it serves the clean URLs (`/privacy`, `/support`)
the same way GitHub Pages does.

## Clean URLs

Pages are linked without `.html`: `/privacy`, `/support`, `/`. GitHub Pages serves `privacy.html`
at `/privacy` on its own, so the files keep their `.html` names. Old `.html` links still work —
`js/main.js` rewrites the address bar to the clean URL — and each page declares the clean URL as
`<link rel="canonical">`, so search engines index that one. GitHub Pages cannot send real
301 redirects; if you ever move to a host that can (Cloudflare Pages, Netlify), add one from
`/privacy.html` to `/privacy`. `/privacy/` (trailing slash) is not served by GitHub Pages.

## Fill in before publishing

These values do not exist anywhere in the Unity project, so the page shows highlighted
placeholders (yellow, dashed underline) and disabled "Coming soon" store badges until
you set them. Edit the `CONFIG` block at the top of [`js/main.js`](js/main.js):

| Key | What | Where it shows |
|---|---|---|
| `studioName` | Developer / company name — set to **HugeTree** (also written directly in `index.html`, `privacy.html` and `support.html`; change all four places if it changes) | footer, privacy policy |
| `supportEmail` | Contact address — set to **hugetree29@gmail.com** (also written directly in `index.html`, `privacy.html` and `support.html`; change all four places if it changes) | footer, privacy policy |
| `googlePlayUrl` | Play Store listing URL | both store badges sections |
| `appStoreUrl` | App Store listing URL | both store badges sections |

Search for `class="placeholder"` to see every place a placeholder appears.

## Deploy notes

- **`app-ads.txt` must be reachable at `https://<your-domain>/app-ads.txt`.** AdMob
  only reads the site root of the developer website listed in the store listing. On
  GitHub Pages that means a user/org site (`<user>.github.io`) or a custom domain —
  a project site at `<user>.github.io/<repo>/` will not work for this file.
- Use `https://<your-domain>/privacy` as the privacy policy URL in Google Play
  Console and App Store Connect.
- The page can be hosted as-is on Cloudflare Pages, Netlify, GitHub Pages, S3, etc.
  Publish the contents of `landingpage/` as the site root.
- Add absolute `og:image` / canonical URLs in `index.html` once the final domain is known
  (social previews generally need absolute URLs).

## Support form

`support.html` has no backend: submitting it opens the visitor's own mail app (`mailto:`) or
Gmail with the message pre-filled, addressed to `CONFIG.supportEmail`. Nothing is sent until
the visitor presses send there, and no third party receives their data. If you later want
messages sent straight from the browser, swap the handler in `js/main.js` for a form service
(Formspree, Web3Forms, a Cloudflare Worker) — and update the note on the page and the
privacy policy, since that service would then process the message.

## Content accuracy

Copy was written from the code and docs (`GAME_DESIGN.md`, `Documentation/ADMOB_SETUP.md`):

- **Endless levels**: the first 50 are designed (`LadderDefinition`), the rest are generated. Update the hero chip and meta
  description if that changes.
- Ads: banner on gameplay/complete screens, interstitial between levels (after ≥ 5
  completed levels, then every 4 levels, ≥ 90 s apart), rewarded video on HINT — and a
  hint is always granted even if the ad fails or is closed. If `MonetizationConfig`
  changes, update `privacy.html`.
- The privacy policy matches the current integration (AdMob + UMP consent + iOS ATT, no
  IAP, no other SDKs). Re-check it whenever an SDK is added, and have it reviewed
  before release; it is not legal advice.

## Where the images come from

- `assets/screenshots/gameplay.png` and `step-1…3-*.png` are frames rendered by the real game
  (current build, with the M16 tube cracks), captured in a scratch copy of the Unity project
  with a PlayMode harness — not mocked up in CSS. Re-capture them when the board art changes.
- `level-select.png` and `level-complete.png` come from the earlier `ss/` captures.
- The jar icon on the first feature card is `art_export/app_icon/app_icon_64_master.png`.

## Known gaps

- Store badges are plain styled buttons, not the official Google/Apple badge artwork.
  Swap in the official badges (per their brand guidelines) when the listings go live.
- `level-select.png` / `level-complete.png` predate the latest build; refresh them if their UI changed.

## Credits

The pixel font is **Pixeloid Sans** (SIL OFL 1.1) — license in
[`assets/fonts/PixeloidSans-OFL.txt`](assets/fonts/PixeloidSans-OFL.txt).
