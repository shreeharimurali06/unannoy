# Unannoy

Tiny tools for wildly annoying tasks.

Unannoy is a local-first utility website for the small digital chores that somehow eat the afternoon: cleaning pasted text, counting words, formatting JSON, previewing Markdown, removing tracking junk from URLs, generating slugs, and other tiny fixes that should not require sign-ups, popups, uploads, or seven suspicious browser tabs.

The site is built to be fast, useful, privacy-aware, mobile-friendly, SEO-ready, and easy to grow into a larger tool library.

## What It Is

Unannoy is a browser-first toolbox.

Most tools run entirely in the user’s browser. There is no backend in V1, no database, no login, no account system, and no intentional storage of user input.

The product goal is simple:

> Paste the annoying thing. Fix it. Copy the result. Leave happier than you arrived.

## Live Tool Set

Unannoy currently has 20 published tools.

### Text Tools

| Tool | Route | What it does |
| --- | --- | --- |
| Text Cleaner | `/text-cleaner` | Trims lines, removes odd spacing, blank lines, tabs, duplicates, and invisible characters. |
| Word Counter | `/word-counter` | Counts words, characters, sentences, paragraphs, lines, reading time, and speaking time. |
| Character Counter | `/character-counter` | Counts characters and checks text against common limits. |
| Case Converter | `/case-converter` | Converts text to uppercase, lowercase, title case, camelCase, snake_case, slug-case, and more. |
| Remove Duplicate Lines | `/remove-duplicate-lines` | Removes repeated lines with trimming, case, empty-line, and order controls. |
| Sort Lines Alphabetically | `/sort-lines` | Sorts lines A to Z or Z to A with numeric and cleanup options. |
| Line Counter | `/line-counter` | Counts total, non-empty, empty, duplicate, shortest, longest, and average lines. |
| List Cleaner | `/list-cleaner` | Splits, joins, trims, dedupes, bullets, numbers, quotes, and reshapes lists. |
| Reading Time Calculator | `/reading-time-calculator` | Estimates reading and speaking time for articles, scripts, posts, and notes. |

### Developer Tools

| Tool | Route | What it does |
| --- | --- | --- |
| JSON Formatter | `/json-formatter` | Formats, validates, and minifies JSON with indentation options. |
| XML Formatter | `/xml-formatter` | Formats and validates XML using browser parsing. |
| JSON Validator | `/json-validator` | Validates JSON and shows friendly parse errors where possible. |
| JSON Minifier | `/json-minifier` | Validates and compacts JSON with before/after size metrics. |
| Base64 Encoder/Decoder | `/base64-encoder-decoder` | Encodes UTF-8 text to Base64 and decodes valid Base64 text. |

### Markdown Tools

| Tool | Route | What it does |
| --- | --- | --- |
| Markdown Viewer | `/markdown-viewer` | Previews Markdown as rendered HTML. |
| Markdown Editor Preview | `/markdown-editor` | Provides a split Markdown editor and live preview. |

### Link Tools

| Tool | Route | What it does |
| --- | --- | --- |
| URL Cleaner | `/url-cleaner` | Removes common tracking parameters from URLs. |
| UTM Remover | `/utm-remover` | Removes UTM campaign parameters, with optional broader tracker cleanup. |
| Slug Generator | `/slug-generator` | Turns titles and text into clean URL slugs. |
| URL Encoder/Decoder | `/url-encoder-decoder` | Encodes and decodes URL components or full URLs. |

## Product Principles

Unannoy is intentionally opinionated.

- No account required to count words.
- No database for pasted text.
- No backend for tools that can run in the browser.
- No unnecessary uploads.
- No analytics payloads containing user input.
- No public links to unfinished tools.
- No thin placeholder tool pages in the sitemap.
- Useful first, playful second, polished always.

## Tech Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| UI direction | Material 3-inspired custom components, with shadcn/Radix-style primitives where useful |
| Animation | Framer Motion |
| Icons | Lucide React |
| Storage | `localStorage` only for harmless preferences |
| Backend | None in V1 |
| Database | None |
| Auth | None |
| Deployment target | Vercel-ready |

## Local Setup

Clone the repo, install dependencies, and start the dev server.

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment Variables

Unannoy can run with no `.env` file locally. For production-like URLs and analytics, use:

```env
SITE_URL=https://unannoy.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

Create a local `.env` from the example if you want production-like sitemap, canonical, robots, Open Graph URLs, or GA4 testing:

```bash
cp .env-example .env
```

For local-only development, the app falls back to:

```text
http://localhost:3000
```

Real `.env*` files are ignored. `.env-example` is committed.

`NEXT_PUBLIC_GA_MEASUREMENT_ID` is optional. When it is missing, Google Analytics is not loaded and local development keeps working.

## Scripts

```bash
npm run dev
```

Runs the local development server.

```bash
npm run build
```

Creates a production build and statically generates the app routes.

```bash
npm run start
```

Starts the production server after a build.

```bash
npm run lint
```

Runs ESLint.

Recommended pre-launch check:

```bash
npm run lint
npx tsc --noEmit --pretty false
npm run build
```

## Project Structure

```text
app/
  page.tsx                         Homepage
  tools/page.tsx                   Searchable published tool directory
  text-tools/page.tsx              Text category page
  developer-tools/page.tsx         Developer category page
  markdown-tools/page.tsx          Markdown category page
  link-tools/page.tsx              Link category page
  privacy/page.tsx                 Privacy policy
  terms/page.tsx                   Terms of use
  about/page.tsx                   About page
  contact/page.tsx                 Contact page
  not-found.tsx                    Custom 404
  sitemap.ts                       Published-only sitemap
  robots.ts                        Robots configuration

components/
  app-shell.tsx                    Shared app frame
  header.tsx                       Top navigation
  footer.tsx                       Footer and contact link
  theme-toggle.tsx                 Light/dark theme control
  tools/                           Shared tool UI components and widgets

lib/
  analytics.ts                     Provider-agnostic event abstraction
  constants.ts                     Site constants and SITE_URL env fallback
  tools/                           Tool registry, categories, SEO content
  text/                            Text/list/line utilities
  developer/                       JSON, XML, Base64 utilities
  links/                           URL cleaning, slug, URL encoding utilities
  markdown/                        Lightweight Markdown renderer
```

## Tool Registry Model

Tools are defined centrally in:

```text
lib/tools/tool-registry.ts
```

Each tool has:

- `slug`
- `title`
- `shortTitle`
- `description`
- `category`
- `status`
- `seoTitle`
- `seoDescription`
- `keywords`
- `relatedTools`
- `isLocalOnly`

Tool status matters:

| Status | Public grids | Sitemap | Route should exist |
| --- | --- | --- | --- |
| `published` | Yes | Yes | Yes |
| `draft` | No | No | No, unless explicitly noindexed |
| `planned` | No | No | No |

This keeps Unannoy from becoming a thin tool dump. If a tool is public, it should work, be useful, have real content, and deserve the page it gets.

## SEO Model

Published tool pages include:

- unique metadata title
- unique metadata description
- canonical-friendly route
- one clear H1
- useful intro copy
- main tool UI above the fold
- privacy note
- related published tools
- explanation content
- use cases
- FAQ content

The sitemap is generated from:

- core public routes
- published tools only

Draft and planned tools are excluded.

## Privacy Model

Unannoy is designed around local-first behavior.

Most tools process input in the browser. User text, JSON, XML, Markdown, URLs, and other pasted content are not intentionally sent to a backend because there is no backend in V1.

Analytics are abstracted through:

```text
lib/analytics.ts
```

Events may include safe metadata such as:

- tool slug
- category
- option name
- action
- length bucket
- theme

Events must not include raw user input or output.

Allowed length buckets:

```text
empty
1-100
101-500
501-2000
2001-10000
10000+
```

## Theme

Unannoy supports light and dark mode.

Theme preference is stored in:

```text
localStorage["unannoy-theme"]
```

If no preference exists, the app respects the system color scheme. A small pre-hydration script applies the theme early to reduce flashing.

## Adding A New Tool

Do not start by creating a route.

Use this order:

1. Add pure utility logic under the right `lib/` folder.
2. Add or reuse shared UI in `components/tools/`.
3. Add real SEO/help content in `lib/tools/tool-content.ts`.
4. Add the tool to `lib/tools/tool-registry.ts` as `draft`.
5. Build the page using `ToolPageShell`.
6. Verify the tool is complete, useful, mobile-friendly, and content-rich.
7. Only then change status to `published`.

Before publishing a new tool, confirm:

- it works with empty input
- copy and clear buttons work
- sample input does not get tracked
- dark mode looks good
- mobile layout does not overflow
- metadata is unique
- related links point only to published tools
- sitemap contains it only after it is complete

## Launch Checklist

Before deploying:

```bash
npm run lint
npx tsc --noEmit --pretty false
npm run build
```

Also verify:

- `SITE_URL` is set to `https://unannoy.com`
- sitemap contains only published tools
- robots.txt points to the correct sitemap
- `/tools` shows only published tools
- draft/planned routes return 404 or are noindexed
- contact email is correct
- custom 404 works
- Open Graph image loads
- mobile pages do not horizontally scroll
- dark mode does not flash badly

## Deployment Notes

The app is ready for a simple Vercel deployment.

Set this environment variable in Vercel:

```env
SITE_URL=https://unannoy.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

No database, server secrets, auth providers, or storage buckets are required for V1.

## Current Limitations

- Markdown rendering is practical and lightweight, not a full GitHub-flavored Markdown clone.
- XML validation is basic browser parsing, not schema validation.
- JSON error location depends on the browser parser message.
- Contact email is displayed, but mail routing must be configured outside the app.
- Analytics are abstracted but no production analytics provider is connected yet.
- Ads are not implemented yet.

## Brand Voice

Unannoy should sound like a competent human who has also been personally wronged by messy pasted text.

Friendly, useful, slightly funny. Not childish. Not corporate. No fake urgency. No “AI magic.” Just tiny tools that do the thing.

## License

Private project for now.

If this changes, update this section before publishing source code publicly.
