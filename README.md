# AgentBridge NoAPI

AgentBridge NoAPI is a full-stack electronics commerce application built as a conventional web product. It provides a responsive storefront and a documented REST API for product discovery, user accounts, carts, wishlists, orders, coupons, shipping estimates, and mock checkout.

The application is intentionally independent of agent runtimes and browser tool-registration APIs. Its integration surface is its REST API only.

## Architecture

```text
Browser UI (Next.js / React)
            |
            v
     Route Handlers (REST API)
            |
            v
 PostgreSQL (Prisma ORM)
```

## Capabilities

- Product catalog, categories, product variants, search, filtering, sorting, and recommendations.
- Registration, login, logout, and server-managed HTTP-only sessions.
- Authenticated cart, wishlist, coupon, order, and cancellation workflows.
- Transactional mock checkout with server-side stock, price, discount, and shipping validation.
- OpenAPI metadata at `/openapi.json` and a health endpoint at `/api/health`.
- Repeatable database seed with 30 products across seven categories.

## Technology

- Next.js, React, and TypeScript
- Tailwind CSS
- PostgreSQL and Prisma
- Zod input validation

## Local Setup

### Prerequisites

- Node.js 20 or later
- PostgreSQL database

### Installation

```bash
npm install
copy .env.example .env
```

Update `.env` with your PostgreSQL connection string and a strong session secret. Do not commit `.env`.

```bash
npx prisma db push
npm run db:seed
npm run dev
```

The application is served at `http://localhost:3000` by default.

## Demo Account

After seeding, the following local demo account is available:

```text
Email: demo@agentbridge.local
Password: DemoPass123!
```

Change or remove demo credentials before any production deployment.

## Common Commands

```bash
npm run dev          # Start local development server
npm run build        # Create production build
npm run start        # Run production server
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Create and apply development migration
npm run db:seed      # Seed catalog, user, and coupons
npm test             # Run test suite
```

## REST API Overview

All endpoints use the response envelope below:

```json
{ "success": true, "data": {} }
```

Errors use:

```json
{ "success": false, "error": { "code": "ERROR_CODE", "message": "Description" } }
```

| Area | Endpoints |
| --- | --- |
| Authentication | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/session` |
| Products | `GET /api/products/search`, `GET /api/products/filter`, `GET /api/products/:id`, `GET /api/products/recommendations` |
| Cart | `GET /api/cart`, `POST /api/cart/items`, `PATCH /api/cart/items/:id`, `DELETE /api/cart/items/:id`, `DELETE /api/cart`, `POST /api/cart/coupon` |
| Wishlist | `GET /api/wishlist`, `POST /api/wishlist/items`, `DELETE /api/wishlist/items/:productId` |
| Orders | `GET /api/orders`, `GET /api/orders/:id`, `POST /api/orders/:id/cancel` |
| Checkout | `POST /api/checkout` |
| Shipping | `GET /api/shipping/estimate` |

Use `/openapi.json` as the machine-readable integration entry point.

## Security Principles

- Passwords are stored using salted password hashes.
- Session cookies are HTTP-only and use `SameSite=Lax`; production cookies require HTTPS.
- Prices, discounts, ownership checks, stock validation, and order totals are computed on the server.
- Authenticated resources are always resolved from the session, never from client-provided user IDs.
- The project does not contain a browser-agent implementation, tool registration, or an MCP endpoint.

## Related Project

The separately deployed `AgentBridge NoAPI WebMCP Adapter` consumes this API through manually maintained, website-specific mappings. It is deliberately not imported by, deployed with, or coupled to this application.
