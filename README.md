# ChantCode Official Website

The official public knowledge site for ChantCode. It explains the product to parents, search engines, AI retrieval systems, and app-review teams. It intentionally does not provide a browser-based learning app, game, account system, database, or data-upload feature.

## Public pages

- `/` — official introduction
- `/about` — what ChantCode is
- `/method` — how the method works
- `/parents` — parent guide
- `/learning` — 36 core facts and learning structure
- `/book` — the book behind the method
- `/faq` — parent and AI-search questions
- `/app` — app overview and release status
- `/privacy` — privacy policy
- `/support` — official support contact

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
npm test
```

## GitHub and Cloudflare deployment

1. Create a GitHub repository for this `website` directory and push the project.
2. In Cloudflare, create a project and connect the GitHub repository.
3. Use `npm run build` as the build command. Deploy the generated Vinext Cloudflare worker and static assets rather than creating an application database or a separate application server.
4. Use Node.js 22.13 or newer in the build environment.
5. Add `chantcode.com` as the custom domain and follow Cloudflare's DNS instructions.
6. Verify `/`, `/privacy`, `/support`, `/robots.txt`, and `/sitemap.xml` on the public domain before App Store submission.

No D1 or R2 binding is required. App Store and Google Play links remain disabled until verified public listings exist.

The production build is validated with `npm test` before each saved deployment version.
