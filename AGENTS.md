# Repository working notes

## Product shape

- This is a Next.js site deployed through OpenNext on Cloudflare Workers.
- Travel guide routes live under `app/travel/<trip-slug>/`.
- Reusable, source-backed trip records live under `guides/<trip-slug>/` with `README.md`, `docs/`, `data/`, and `maps/`.

## Travel guide quality bar

- Treat traveler constraints, fixed bookings, flight times, and hotel location as hard constraints.
- Verify live transport, opening hours, ticket rules, weather, and reservations with current sources before publishing.
- Keep public guide data free of login tokens, cookies, personal browser data, and private source-library material.
- Prefer public transit, compact neighborhood sequences, explicit rest windows, meal backups, and rain/heat alternatives.
- Interactive maps must preserve overview/day/detail views and itinerary editing actions; route lines are sequence references unless backed by official geometry.

## Validation and delivery

- Run `npm run check` and `npm run build` before delivery.
- Preserve unrelated worktree changes.
- Use the existing Cloudflare/OpenNext deployment configuration.
