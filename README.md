# AgentBridge NoAPI Storefront

## Project Overview

[AgentBridge NoAPI](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI) is an e-commerce storefront backed by PostgreSQL. It is intentionally independent from its separately deployed [UI-automation WebMCP adapter](https://github.com/misbah7172/AgentBridge--External-WebMCP-NoAPI-Adapter).

## Problem Statement and Solution

Many websites offer a complete human interface but should not publish a reusable public API. This application keeps commerce logic behind normal server-rendered pages and Next.js server actions. The companion Cloudflare adapter can make selected, visible UI actions for browser agents without this repository exposing REST endpoints or embedding WebMCP code.

## Architecture

```text
Human browser → rendered Next.js UI → server actions → Prisma → PostgreSQL
Agent browser → Cloudflare Worker adapter → injected DOM bridge → same rendered UI
```

The application itself does not register WebMCP tools and has no `app/api` route tree. It supplies stable `data-agentbridge-*` attributes on visible pages, forms, fields, and controls as an integration contract for the external adapter—not as a public data API.

## WebMCP and the External Adapter

[WebMCP](https://webmachinelearning.github.io/webmcp/) enables structured browser tools. In this project it is supplied only by the independent [adapter Worker](https://github.com/misbah7172/AgentBridge--External-WebMCP-NoAPI-Adapter/blob/main/worker/index.ts), which proxies the storefront HTML, injects a same-origin bridge, and performs navigation, field entry, and button clicks. The Worker does not call this application’s data endpoints; there are none to call.

For the deployed demonstration, use the [Worker URL](https://agentbridge-webmcp-noapi-adapter.agentbridge-noapi.workers.dev/) rather than the direct [Render storefront](https://agentbridge-external-webmcp-powered-e.onrender.com/). The Worker’s `TARGET_ORIGIN` is its own URL and `ORIGIN_UPSTREAM` is the Render URL, as documented in the [adapter configuration](https://github.com/misbah7172/AgentBridge--External-WebMCP-NoAPI-Adapter/blob/main/wrangler.toml).

## User Journeys, State, and Safety

The UI supports account registration and sign-in, catalog search, product viewing, cart and wishlist actions, coupon entry, order history, and mock checkout. Session state is stored in HTTP-only cookies and enforced by server actions. The external adapter reads only rendered state: anonymous pages expose catalog tools, while an authenticated header exposes protected UI tools. Confirmation is required in the adapter before destructive cart actions and checkout.

## Tooling Contract

The visible hooks used by the adapter include `data-agentbridge-session`, `data-agentbridge-product-id`, `data-agentbridge-cart-item`, `data-agentbridge-wishlist-product`, `data-agentbridge-field`, and `data-agentbridge-action`. This small contract is deliberately state-aware and reviewable. Missing controls result in a recoverable UI error, rather than an arbitrary network or database operation.

## Tech Stack and Structure

Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL/Neon, and server actions power the storefront. Key locations are [application pages](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/tree/main/app), [server actions](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/blob/main/app/actions.ts), [reusable components](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/tree/main/components), and the [Prisma schema](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/blob/main/prisma/schema.prisma).

## Setup, Environment, and Running

```bash
pnpm install
cp .env.example .env
pnpm prisma db push
pnpm prisma db seed
pnpm dev
```

Set `DATABASE_URL` in `.env` to a PostgreSQL connection string. Do not commit credentials. Run `pnpm build` for production verification. The seeded demonstration credentials are documented in [prisma/seed.ts](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/blob/main/prisma/seed.ts).

## Testing and Evaluation

`pnpm build` performs compilation and type validation. Browser/E2E validation should cover anonymous and authenticated user journeys through the Worker URL, tool discovery, confirmation gates, and DOM-hook recovery. Useful evaluation metrics are page-action completion rate, tool visibility correctness, selector failure rate, and confirmation compliance.

## Security, Limitations, and Future Improvements

The storefront does not expose a public API or WebMCP runtime. Database access remains server-side; authentication is enforced by server actions. The external adapter depends on stable visible UI hooks, so UI changes require companion adapter review. Planned improvements include automated browser evaluations, richer accessible labels, user-facing server-action errors, and configurable website-specific adapter generation.

## License

MIT. See [LICENSE](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/blob/main/LICENSE).
