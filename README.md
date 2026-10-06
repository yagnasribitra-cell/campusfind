# CampusFind — Campus Lost & Found Matcher

**Lost something? Let us find the match.** CampusFind is a responsive campus lost-and-found demo that helps students post items, discover related reports, and follow up on potential matches.

## What it does

- Browse seeded lost and found posts from a searchable, filterable dashboard.
- Submit a four-step lost/found report with category, description, location, date, approximate time, color, and an optional photo.
- Rank opposite-status posts using category, campus location, and date clues; show the weighted score and factor breakdown.
- Review match notifications, open item details, contact the other reporter through a demo dialog, and confirm a claim.
- Explore a selectable schematic campus map and a demo student profile.
- Keep new reports, claim state, and notification dismissals in browser-local storage.

The matcher is deterministic rules-based code, not an external AI service. It compares **category (40 points), location (35 points), and date (25 points)** and sorts eligible matches from highest to lowest. Exact category matches receive 40 points; exact locations receive 35, while recognized nearby library aliases can receive a partial location score; date proximity contributes up to 25 points. For example, the featured Library / Central Library match on the same day scores 94% (40 + 29 + 25).

## Requirements

- Node.js 22 or later
- Corepack and pnpm 10.18.0 (the package manager version is pinned in `package.json`)

## Install and run

```bash
git clone https://github.com/yagnasribitra-cell/campusfind.git
cd campusfind
corepack enable
corepack prepare pnpm@10.18.0 --activate
pnpm install --frozen-lockfile
pnpm dev:static
```

Open [http://localhost:3000](http://localhost:3000). To use a different port in a POSIX shell, run `PORT=4173 pnpm dev:static`.

## Useful commands

| Command             | Purpose                                                                |
| ------------------- | ---------------------------------------------------------------------- |
| `pnpm dev:static`   | Run the Vite frontend at port 3000 (or `$PORT`).                       |
| `pnpm check`        | Type-check the TypeScript project.                                     |
| `pnpm test`         | Run the Vitest suite, including matching and demo-data coverage tests. |
| `pnpm build:static` | Build the static site into `dist/public/`.                             |

## Pages

| Path             | Page                                     |
| ---------------- | ---------------------------------------- |
| `/`              | Landing page and impact story            |
| `/dashboard`     | Dashboard, filters, and featured matches |
| `/lost`          | Lost-item listings                       |
| `/found`         | Found-item listings                      |
| `/matches`       | Ranked smart matches                     |
| `/map`           | Schematic campus map                     |
| `/report`        | Multi-step lost/found report             |
| `/notifications` | Match notifications                      |
| `/profile`       | Demo student profile and report tabs     |

## Demo behavior and limitations

This repository is a frontend-first demo. It does **not** include a production backend, real student accounts, password storage, external messaging, or a live campus map. Login/signup and contact dialogs are demonstrations; no credentials or messages are sent. Confirmed claims are recorded only in the current browser. Sample students, posts, activity figures, match notifications, and impact metrics are illustrative—not live campus-wide data.

Reports and notification state use `localStorage` in the current browser (`campusfind.items.v1` and `campusfind.notifications.v1`). They do not synchronize between students or devices. Photos selected for a new report are compressed and kept with that browser-local demo data.

The four seeded item-card photos are stored through the original Manus project's `/manus-storage/` route, so they may not load when this repository is run outside that hosted project; cards fall back to category icons if an image is unavailable. The photo source notes are in [ASSET_SOURCES.md](ASSET_SOURCES.md).

## Project layout

- `client/src/pages/` — landing, dashboard, listings, matches, map, report, notifications, and profile.
- `client/src/components/` — shared navigation, item/match cards, and detail/contact/claim dialogs.
- `client/src/lib/campusfind-types.ts` — category, location, item, match, notification, and profile types.
- `client/src/lib/campusfind-data.ts` — realistic seeded demo records and sample metrics.
- `client/src/lib/campusfind-matching.ts` — deterministic weighted scoring and ranked candidate selection.
- `client/src/lib/campusfind-store.tsx` — browser-local demo state and persistence.
- `client/public/manus-routes.json` — page-route manifest.

## Development checks

Before submitting changes, run:

```bash
pnpm check
pnpm test
pnpm build:static
```
