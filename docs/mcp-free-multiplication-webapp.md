# Unlisted ChantCode web resource

## Latest status: deployed to production, 2026-09-19

The user resumed and authorized publication after the local UI changes. The latest website package was generated and all 11 content checks passed. It was uploaded to the existing Cloudflare Pages project `chantcode-website`, production branch `main`. The original App runtime was not recompiled. No database migrations, DNS edits, secret updates, or payment-configuration edits were performed.

- Live resource: `https://chantcode.com/free-multiplication`.
- Deployment: `https://ffa373dd.chantcode-website.pages.dev`.
- Previous production deployment recorded before upload: `7f1d76b7-86fc-4f8c-900a-c646aef4161e`.
- Upload result: 280 files uploaded, 18 already present; Functions bundle, headers and routing included.
- This was a direct Pages upload, not a Git commit/push. Future Git deployments must include the local changes to preserve this release.

Public-domain checks returned HTTP 200 for the page, embedded app, manual-practice module, QR and a real chant WAV. Both page metadata and X-Robots-Tag specify noindex, nofollow. Homepage navigation and sitemap do not expose the resource. The live QR was decoded and points to `https://apps.apple.com/app/id6799623130`.

Production Edge browser verification passed real audio playback, waiting for the child without automatic advancement, replay, Previous, Next, Finish, restart and navigation cleanup. It observed no microphone requests, no mastery/recognition-score writes, and no page errors.

The local Node TLS handshake initially failed with ECONNRESET; the CLI succeeded with process-scoped `NODE_OPTIONS=--tls-max-v1.2`. Certificate verification was not disabled and system settings were not changed. Bundling emitted two warnings from an existing Apple SDK dependency; payment flows were not exercised.

The local resource page now places a prominent App Store download card and the unchanged existing QR image above the web app. Mobile visitors get a wide download button; desktop visitors can scan the large QR. A separate optional honest-review link is below the web resource. The web app remains usable without downloading, reviewing, or paying. No review was submitted and no download-count increase is claimed.

Desktop and mobile browser checks verified the download URL, review-link URL, QR image loading, no horizontal overflow, and a download button visible before scrolling. Noindex and unlisted navigation behavior remain in place. The QR image itself was not regenerated or modified.

## Current source and route

- Source: `C:/Users/Administrator/OneDrive/Desktop/ChantCode_Apple_Adaptive_UI`.
- Local page: `http://localhost:5173/free-multiplication`.
- Production page: `https://chantcode.com/free-multiplication` (deployed and verified).
- Standalone runtime: `public/free-multiplication-app/index.html`.
- The route embeds the original browser learning app, with a separate App Store download link and full-window link.

## Import method

The final import copied 205 runtime/source-assets files from the supplied directory. Existing `game/runtime` JavaScript and CSS were reused. No compiler was invoked for the final import. Asset references were rebased to `/free-multiplication-app/`; noindex metadata was added to the copied HTML. Only browser runtime and learning assets were copied, not native iOS projects, credentials, dependencies, review notes, or build tools.

Source checksums were verified unchanged during import. The previous website app copy and import manifest are in `.mcp-backups/2026-09-19T18-05-34-916Z/`. The pre-integration resource page, stylesheet, shell, sitemap, and generator are preserved in `.mcp-backups/pre-webapp-page.json`.

The importer `scripts/import-chantcode-web.mjs` now accepts prebuilt source only. It backs up the existing website app before `--replace`; it does not run npm, esbuild, Vite, native builds, or deployment. Unreferenced files from the previous website copy are retained, not deleted.

## Unlisted access

- Removed the free-resource link from the common top navigation and footer.
- Removed the route from `scripts/generate-search-files.mjs` and `public/sitemap.xml`.
- Page and imported HTML use noindex, nofollow.
- `public/_headers` adds X-Robots-Tag to the page variants and imported runtime paths for the Pages deployment.
- This is unlisted public access, NOT authentication or password protection. Anyone with the URL can use/share it; noindex depends on crawler compliance.

## Browser limitations

- Original native iOS speech assessment is not available in the browser. The page states this limitation; the original speech bridge reports unavailable outside iOS.
- Progress stays in this browser, not synchronized to the iOS app. Clearing browser storage can remove it.
- No new permanent-free promise about the iOS app was added.

## Verification performed

- Edge headless: embedded app renders; page robots metadata includes noindex.
- Actual 6 x 6 chant decoded and playback time advanced.
- Child navigation responds and learning controls are present.
- 390px mobile wrapper fits without horizontal overflow; screenshot reviewed.
- Existing precompiled tower game renders a question and answer buttons.
- These exercised paths produced no page errors or HTTP 4xx/5xx responses.
- Initial HTTP checks confirmed page, JS, game, and example audio return 200; homepage has no resource link and sitemap does not expose it.
- Wrapper typecheck passed before the final source swap. Focused lint: no errors, one existing SiteShell image warning.
- Not an exhaustive test of all lessons, game progression, Safari, or iOS-specific behavior.

## Build and deployment state

The final resource uses the replacement directory's precompiled App runtime. A fresh website build was later generated for the user-authorized deployment, including manual follow-along and the latest download/QR/full-window controls. The current release was deployed as recorded above. No directory submission or App Store review was submitted.

Browser probes and screenshots remain under `.cache/browser-check/`, not in docs.

## Manual listen-and-repeat browser adaptation

The user selected child-controlled Next, not timed advancement. Browser Recite Yourself is now Listen & Repeat: play a real chant, wait for it to finish, let the child repeat aloud, then use Next. Replay, Previous, Stop audio, Finish practice, and Practice again are available. Moving to the next chant starts that chant's audio; no timer moves the child forward.

This mode does not request microphone access, record speech, judge correctness, assign scores, or write mastery/recognition records. Completing the set means only that the child manually worked through it. Existing iOS-native speech behavior and original Desktop source files remain unchanged.

Implementation lives in `web-adaptations/manual-follow-along.js` and `.css`; `scripts/apply-web-follow-along.mjs` applies the browser-only hooks to the copied app. `scripts/import-chantcode-web.mjs` reapplies this adaptation after future imports, without compilation. Browser-copy backups are in `.mcp-backups/manual-follow-along/`. The page's browser explanation has been updated accordingly.


## Browser review fixes — 2026-09-19

- Download heading: Get ChantCode Free on iPhone & iPad.
- Web practice uses separate localStorage key `chantcode.web-practice.v1`; saves position after Next, Previous and Start over; never sets speech scores or test mastery. Reloading a partly completed set offers Continue practice. Worked-through count reflects the furthest completed step; Practice again preserves that history.
- Parent progress uses manual worked-through counts and explicitly disclaims speech recognition/mastery.
- Standalone runtime has an optional App Store download bar; iframe avoids duplicating it.
- Storage write errors show a notice; resetting learning progress also clears web practice.
- Web-only icon 10,798 bytes and welcome image 104,920 bytes. Existing original PNGs and original App source remain unchanged.
- Adapter is idempotent and runs after every prebuilt import; updated module/style URLs invalidate old browser caches.
- Local build and 11 content tests passed. Browser test passed resume, separate mastery, parent counts, shared-origin storage, standalone links, simulated quota failure, reset and 320/390/768px no-overflow checks.
- Reproducible browser check: install Playwright, build website, then `node tests/web-resource.browser.cjs`. Uses Edge on Windows or bundled Chromium elsewhere. Set CHECK_URL to audit a deployment. BROWSER_PATH and BROWSER_PROXY are optional process-scoped settings. Uses disposable browser contexts only.
- Git scope intentionally excludes pre-existing payment/referral/server/package changes. Preserve those existing deployment requirements separately; this feature branch alone is not a complete snapshot of the unrelated production referral backend. Do not auto-deploy an old backend over production.

### Review release — published and verified

- Production: https://chantcode.com/free-multiplication
- Deployment: https://bca9eb64.chantcode-website.pages.dev (Pages production branch main).
- Website feature commit: f810965; final preload fix: 75041c8; pushed to origin/website/free-multiplication-20260919. Main Git branch was deliberately not overwritten and no history was rebuilt.
- Previous production deployment: https://ffa373dd.chantcode-website.pages.dev (rollback reference).
- Direct production upload retained the existing local Functions bundle and configuration; unrelated backend changes were not added to the feature commit.
- Production browser regression passed: resumed chant 2 after reload, completed 4/4 manual practice, unchanged mastery storage, accurate parent counts, standalone download link, shared-origin storage, storage-failure alert, reset cleanup, and 320/390/768px no horizontal overflow. Zero page errors in this test.
- Public URL checks confirmed new heading, new modules/images, noindex headers and continued sitemap exclusion.
- Original prebuilt App source was rechecked against the import manifest: all 205 hashes unchanged. No original App compilation, payment migration, or DNS change.
- Real iPhone/Safari testing and educational review of every AI-generated audio clip remain outside this automated verification.

- Final browser run also asserts that the original 1.85 MB welcome PNG is not fetched; the HTML preload now targets the optimized WebP. Production formal-test regression also passed all 7 questions with saved results after reload.
- If Git HTTPS stalls in this network, process-scoped HTTP/1.1 plus the existing proxy succeeded; no global Git or proxy settings were changed.
