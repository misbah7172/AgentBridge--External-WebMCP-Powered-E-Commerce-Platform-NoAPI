# AgentBridge NoAPI

[AgentBridge NoAPI](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI) is the independent, conventional e-commerce origin application for the AgentBridge demonstration. Its companion, the [AgentBridge NoAPI WebMCP Adapter](https://github.com/misbah7172/AgentBridge--External-WebMCP-NoAPI-Adapter), is a separately deployed integration layer.

## 1. Project Overview

The application provides a modern electronics storefront and a server-owned REST API for catalog discovery, authentication, cart and wishlist management, orders, coupons, shipping, and mock checkout.

## 2. Problem Statement

Existing web applications need a safe, maintainable integration surface for automation without embedding agent-specific runtime code in the application itself.

## 3. Solution / Approach

AgentBridge NoAPI remains a normal Next.js application. It publishes a fixed REST contract; the separate [adapter repository](https://github.com/misbah7172/AgentBridge--External-WebMCP-NoAPI-Adapter) maps that contract to browser tools without modifying this codebase.

## 4. What is WebMCP?

[WebMCP](https://webmachinelearning.github.io/webmcp/) is an emerging browser API that lets a page register structured, discoverable tools for browser-mediated agents. This origin application intentionally does not implement it.

## 5. Why WebMCP?

WebMCP can expose explicit application actions rather than relying on fragile screen interpretation. Here, that capability belongs exclusively to the [external adapter](https://github.com/misbah7172/AgentBridge--External-WebMCP-NoAPI-Adapter), preserving clean application ownership boundaries.

## 6. System Architecture

```text
Human user → Next.js storefront → REST route handlers → Prisma → PostgreSQL
                                      ↑
                   Separate adapter consumes this fixed contract
```

The data model is defined in the [Prisma schema](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/blob/main/prisma/schema.prisma).

## 7. Agent ↔ Browser ↔ WebMCP Flow

This repository has no agent or WebMCP flow. The end-to-end flow is documented in the [adapter README](https://github.com/misbah7172/AgentBridge--External-WebMCP-NoAPI-Adapter#7-agent--browser--webmcp-flow).

## 8. WebMCP Tools

No WebMCP tools are registered in this application. The REST endpoints below are intentionally the only integration contract.

## 9. Tool Discovery

Tool discovery is not applicable to the origin application. The adapter registers its tools in the target page context after edge injection.

## 10. Tool Schemas & Contracts

The machine-readable API entry point is [`/openapi.json`](http://localhost:3000/openapi.json) in local development; its implementation is [available here](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/blob/main/app/openapi.json/route.ts). Request validation is implemented with [Zod schemas](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/blob/main/lib/validation.ts).

## 11. Agent Interaction / User Journeys

Human users can browse products, create an account, add items to a cart, apply coupons, and place a mock order. An equivalent agent-assisted journey is documented in the [adapter repository](https://github.com/misbah7172/AgentBridge--External-WebMCP-NoAPI-Adapter#11-agent-interaction--user-journeys).

## 12. State-Aware Tool Exposure

This project exposes state through authenticated REST operations. Session ownership determines cart, wishlist, and order access; tool exposure is an adapter concern.

## 13. Error Handling & Safety

Route handlers return a consistent success/error envelope. Authentication, inventory, coupon eligibility, price calculation, and ownership checks are performed server-side.

## 14. Multi-Step Tool Execution

Checkout is an atomic database transaction: validate session and stock, calculate totals, create an order, decrement stock, update coupon usage, and clear the cart. See the [checkout handler](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/blob/main/app/api/checkout/route.ts).

## 15. Failure & Recovery Handling

Invalid requests return structured errors; failed checkout validation leaves cart state intact. The application does not retry transactional requests automatically.

## 16. Testing Strategy

The implementation is build-verified. Deterministic API, browser end-to-end, and agent evaluation suites are planned before production release.

## 17. Deterministic Tests

Planned coverage includes authentication, authorization isolation, search/filtering, cart mutation, coupon rules, inventory updates, and checkout transactions.

## 18. LLM / Probabilistic Evaluations

Not applicable to this origin application. Such evaluations belong to the [adapter](https://github.com/misbah7172/AgentBridge--External-WebMCP-NoAPI-Adapter#18-llm--probabilistic-evaluations).

## 19. Browser / E2E Evaluations

Not yet automated. The intended scenario is browse → authenticate → cart → coupon → checkout → order history.

## 20. WebMCP Inspector Validation

Not applicable by design. The absence of `document.modelContext`, tool registration, and MCP endpoints in this repository is a separation requirement.

## 21. Evaluation Metrics

Planned metrics: API success rate, authorization failures correctly rejected, checkout inventory consistency, and browser journey completion rate.

## 22. Results / Benchmarks

No benchmark suite has been executed. `npm run build` completes successfully; any future performance claims will be published with reproducible methodology.

## 23. Demo

Run locally, register an account or use the seeded account, then browse products and complete a mock checkout. The companion adapter demo is described [here](https://github.com/misbah7172/AgentBridge--External-WebMCP-NoAPI-Adapter#23-demo).

### Demo Login Credentials

The committed [seed script](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/blob/main/prisma/seed.ts) creates the following demonstration account:

```text
Email:    demo@agentbridge.local
Password: DemoPass123!
```

These credentials are for development and demonstration only. Remove or rotate them before production use.

## 24. Screenshots / Demo GIF / Video

Visual assets have not yet been published. This section will link to recorded browser and adapter demonstrations when available.

## 25. Tech Stack

Next.js, React, TypeScript, Tailwind CSS, PostgreSQL, Prisma, and Zod. See the [package manifest](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/blob/main/package.json).

## 26. Project Structure

| Area | Purpose |
| --- | --- |
| [`app`](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/tree/main/app) | Pages and REST route handlers |
| [`components`](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/tree/main/components) | Storefront UI components |
| [`lib`](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/tree/main/lib) | Authentication, pricing, validation, and persistence helpers |
| [`prisma`](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/tree/main/prisma) | Schema and repeatable seed data |

## 27. Setup & Installation

```bash
git clone https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI.git
cd AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI
npm install
copy .env.example .env
```

## 28. Environment Variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | High-entropy server secret; replace the example value |
| `NEXT_PUBLIC_APP_URL` | Yes | Public application URL |

Use the [environment template](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/blob/main/.env.example); never commit `.env`.

## 29. Running the Application

```bash
npx prisma db push
npm run db:seed
npm run dev
```

The local storefront is available at [http://localhost:3000](http://localhost:3000). The seeded demo account is `demo@agentbridge.local` / `DemoPass123!`; remove or rotate it for production.

## 30. Running Tests

```bash
npm run build
npm test
```

`npm run build` is currently the verified check. The test command is reserved for the planned Vitest suite.

## 31. Running WebMCP Evaluations

Not applicable in this repository. Follow the [adapter evaluation instructions](https://github.com/misbah7172/AgentBridge--External-WebMCP-NoAPI-Adapter#31-running-webmcp-evaluations).

## 32. Reproducibility

Use the committed [schema](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/blob/main/prisma/schema.prisma), [seed script](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/blob/main/prisma/seed.ts), and lockfile to reproduce the database-backed catalog and build.

## 33. Security Considerations

- Passwords use salted scrypt hashes.
- Sessions use HTTP-only cookies with `SameSite=Lax`; HTTPS is required in production.
- Client prices and user IDs are never trusted.
- Cart, wishlist, and order access is derived from the active server session.
- Real payment processing is intentionally out of scope.

## 34. Limitations

The payment flow is mock-only. There is no admin dashboard, delivery integration, product reviews, automated test suite, or production observability implementation.

## 35. Future Improvements

Add migration history, full test coverage, rate limiting, CSRF hardening for every mutating route, production telemetry, an administration interface, and a deployed API reference.

## 36. Hackathon Requirements / How the Project Addresses Them

The project demonstrates strict origin/adapter separation: a functional conventional website with a typed REST contract, plus an external website-specific WebMCP layer. The origin can operate independently and remains free of WebMCP, MCP server, and agent-runtime code.

## 37. References

- [WebMCP specification](https://webmachinelearning.github.io/webmcp/)
- [Next.js documentation](https://nextjs.org/docs)
- [Prisma documentation](https://www.prisma.io/docs)
- [Companion adapter repository](https://github.com/misbah7172/AgentBridge--External-WebMCP-NoAPI-Adapter)

## 38. License

Released under the [MIT License](https://github.com/misbah7172/AgentBridge--External-WebMCP-Powered-E-Commerce-Platform-NoAPI/blob/main/LICENSE).
