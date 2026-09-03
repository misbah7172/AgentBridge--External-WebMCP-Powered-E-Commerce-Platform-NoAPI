# Comprehensive Development Prompt: agentbridge-noapi WebMCP Adapter

## 1. Project Overview

Build a separate project called:

```text
AgentBridge-webmcp-adapter
```

This project is an **external WebMCP compatibility layer for one specific website: agentbridge-noapi**.

The adapter must be completely separate from the agentbridge-noapi source repository.

It must NOT require modifications to the agentbridge-noapi application source code.

The adapter knows the structure and REST API of agentbridge-noapi because it is intentionally designed specifically for agentbridge-noapi.

This is NOT a universal WebMCP adapter.

Do NOT attempt to automatically understand arbitrary websites.

Do NOT automatically generate tools from arbitrary websites.

Do NOT crawl websites and infer actions.

Do NOT create an arbitrary HTTP request tool.

The adapter should contain manually designed, strongly typed tools that map to known agentbridge-noapi API operations.

---

# 2. Target Website

Configure the adapter for exactly:

```text
https://AgentBridge.example
```

Use an environment variable for deployment:

```env
TARGET_ORIGIN=https://AgentBridge.example
```

For local development:

```env
TARGET_ORIGIN=http://localhost:3000
```

The adapter must verify that it is operating against the configured agentbridge-noapi origin.

Do not allow arbitrary origins.

---

# 3. Core Concept

The architecture is:

```text
                         AI AGENT
                            │
                            │ WebMCP
                            ▼
                    Browser WebMCP
                            │
                            ▼
                  Injected Bridge
                            │
                            ▼
              agentbridge-noapi WebMCP Adapter
              ┌─────────────────────────┐
              │ Tool Registry           │
              │ Tool Schemas            │
              │ Permissions             │
              │ Safety Rules             │
              │ API Mappings             │
              │ API Executor             │
              │ Browser Executor         │
              │ Authentication Context   │
              └────────────┬────────────┘
                           │
                    ┌──────┴──────┐
                    ▼             ▼
             agentbridge-noapi REST    Browser DOM
                  API          fallback
                    │             │
                    └──────┬──────┘
                           ▼
                     agentbridge-noapi
```

---

# 4. Critical Separation

There must be two independent repositories:

```text
AgentBridge/
```

and:

```text
AgentBridge-webmcp-adapter/
```

The agentbridge-noapi repository must not import the adapter.

The adapter may know the agentbridge-noapi API.

The agentbridge-noapi application must not know anything about the adapter.

---

# 5. Recommended Technology

Use:

- TypeScript
- Node.js
- Cloudflare Workers
- Cloudflare HTMLRewriter
- WebMCP JavaScript API
- Zod
- JSON Schema
- native fetch
- Vitest
- Playwright for optional browser fallback

Recommended structure:

```text
AgentBridge-webmcp-adapter/
│
├── src/
│   ├── bridge/
│   │   └── webmcpBridge.ts
│   │
│   ├── registry/
│   │   └── toolRegistry.ts
│   │
│   ├── tools/
│   │   ├── searchProducts.ts
│   │   ├── getProductDetails.ts
│   │   ├── filterProducts.ts
│   │   ├── sortProducts.ts
│   │   ├── getRecommendations.ts
│   │   ├── getShippingEstimate.ts
│   │   ├── getCart.ts
│   │   ├── addToCart.ts
│   │   ├── updateCart.ts
│   │   ├── removeFromCart.ts
│   │   ├── clearCart.ts
│   │   ├── getWishlist.ts
│   │   ├── addToWishlist.ts
│   │   ├── removeFromWishlist.ts
│   │   ├── getOrders.ts
│   │   ├── getOrderDetails.ts
│   │   ├── cancelOrder.ts
│   │   ├── applyCoupon.ts
│   │   └── checkout.ts
│   │
│   ├── executors/
│   │   ├── apiExecutor.ts
│   │   └── browserExecutor.ts
│   │
│   ├── auth/
│   │   └── authManager.ts
│   │
│   ├── security/
│   │   ├── permissions.ts
│   │   └── safety.ts
│   │
│   ├── config/
│   │   └── agentbridge-noapi.ts
│   │
│   └── logging/
│       └── logger.ts
│
├── worker/
│   └── index.ts
│
├── tests/
│   ├── tools/
│   ├── security/
│   └── integration/
│
├── public/
│
├── wrangler.toml
├── package.json
├── tsconfig.json
└── README.md
```

---

# 6. Manual Tool Registry

Create a manually defined registry.

Example concept:

```typescript
const tools = [
  searchProductsTool,
  getProductDetailsTool,
  filterProductsTool,
  getCartTool,
  addToCartTool,
  updateCartTool,
  removeFromCartTool,
  checkoutTool,
];
```

Do NOT dynamically generate these tools by scraping agentbridge-noapi.

Do NOT inspect arbitrary JavaScript variables.

Do NOT infer tools from DOM elements.

The tools are intentionally authored for agentbridge-noapi.

---

# 7. WebMCP Registration

The adapter must contain actual WebMCP registration code.

The generated bridge must execute in the agentbridge-noapi page context.

Use:

```javascript
document.modelContext.registerTool(...)
```

for every exposed tool.

The final repository must visibly contain the actual implementation because the project is intended to demonstrate WebMCP integration.

Example structure:

```javascript
document.modelContext.registerTool({
  name: "search_products",
  description: "Search agentbridge-noapi products.",
  inputSchema: {
    type: "object",
    properties: {
      query: {
        type: "string",
      },
    },
  },
  execute: async (input) => {
    // adapter execution
  },
});
```

Use the current WebMCP API shape supported by the target browser.

Keep browser compatibility in mind.

---

# 8. Tool: search_products

Expose:

```text
search_products
```

Schema:

```json
{
  "type": "object",
  "properties": {
    "query": {
      "type": "string"
    },
    "category": {
      "type": "string"
    },
    "minPrice": {
      "type": "number"
    },
    "maxPrice": {
      "type": "number"
    },
    "brand": {
      "type": "string"
    },
    "minRating": {
      "type": "number"
    },
    "page": {
      "type": "number"
    },
    "limit": {
      "type": "number"
    }
  }
}
```

Map it to:

```http
GET /api/products/search
```

Example agent request:

```json
{
  "query": "RTX 4060 laptop",
  "maxPrice": 900
}
```

Adapter generates:

```text
/api/products/search?q=RTX%204060%20laptop&maxPrice=900
```

---

# 9. Tool: get_product_details

Expose:

```text
get_product_details
```

Input:

```json
{
  "productId": "..."
}
```

Map to:

```http
GET /api/products/:id
```

---

# 10. Tool: filter_products

Expose:

```text
filter_products
```

Support:

```text
category
brand
minPrice
maxPrice
minRating
stockStatus
```

Map to:

```http
GET /api/products/filter
```

---

# 11. Tool: sort_products

Expose:

```text
sort_products
```

Supported values:

```text
price_asc
price_desc
rating
newest
popularity
```

Map this to the known agentbridge-noapi product API.

---

# 12. Tool: get_product_recommendations

Expose:

```text
get_product_recommendations
```

Map to:

```http
GET /api/products/recommendations
```

---

# 13. Tool: get_shipping_estimate

Expose:

```text
get_shipping_estimate
```

Input:

```json
{
  "postalCode": "1234",
  "country": "Bangladesh"
}
```

Map to:

```http
GET /api/shipping/estimate
```

---

# 14. Tool: get_cart

Expose:

```text
get_cart
```

Map to:

```http
GET /api/cart
```

The request must use the user's existing browser authentication context.

Do not ask the AI model for:

```text
username
password
session cookie
access token
```

---

# 15. Tool: add_to_cart

Expose:

```text
add_to_cart
```

Input:

```json
{
  "productId": "...",
  "variantId": "...",
  "quantity": 1
}
```

Map to:

```http
POST /api/cart/items
```

The adapter must use the browser's existing authenticated session.

---

# 16. Tool: update_cart

Expose:

```text
update_cart
```

Input:

```json
{
  "itemId": "...",
  "quantity": 2
}
```

Map to:

```http
PATCH /api/cart/items/:id
```

---

# 17. Tool: remove_from_cart

Expose:

```text
remove_from_cart
```

Map to:

```http
DELETE /api/cart/items/:id
```

---

# 18. Tool: clear_cart

Expose:

```text
clear_cart
```

Map to:

```http
DELETE /api/cart
```

This should be classified as a destructive action.

Require confirmation before execution.

---

# 19. Wishlist Tools

Expose:

```text
get_wishlist
add_to_wishlist
remove_from_wishlist
```

Mappings:

```http
GET    /api/wishlist
POST   /api/wishlist/items
DELETE /api/wishlist/items/:productId
```

---

# 20. Order Tools

Expose:

```text
get_orders
get_order_details
cancel_order
```

Mappings:

```http
GET  /api/orders
GET  /api/orders/:id
POST /api/orders/:id/cancel
```

Cancel order must require confirmation.

---

# 21. Coupon Tool

Expose:

```text
apply_coupon
```

Input:

```json
{
  "code": "SAVE10"
}
```

Map to:

```http
POST /api/cart/coupon
```

---

# 22. Checkout Tool

Expose:

```text
checkout
```

This is a high-impact operation.

The tool MUST NOT immediately place an order without human confirmation.

Instead, the first call should return:

```json
{
  "requiresConfirmation": true,
  "action": "checkout",
  "message": "Checkout requires explicit user confirmation."
}
```

Only after explicit confirmation should the adapter call:

```http
POST /api/checkout
```

This prevents an AI agent from accidentally placing an order.

---

# 23. Tool Permission Model

Create tool categories:

```text
READ
WRITE
DESTRUCTIVE
TRANSACTIONAL
```

Example:

### READ

```text
search_products
get_product_details
filter_products
sort_products
get_recommendations
get_shipping_estimate
get_cart
get_wishlist
get_orders
get_order_details
```

### WRITE

```text
add_to_cart
update_cart
add_to_wishlist
remove_from_wishlist
apply_coupon
```

### DESTRUCTIVE

```text
remove_from_cart
clear_cart
cancel_order
```

### TRANSACTIONAL

```text
checkout
```

---

# 24. Security Rules

Never expose arbitrary HTTP requests.

Do NOT create:

```text
http_request(url, method, headers, body)
```

This is intentionally forbidden.

The adapter must only call predefined agentbridge-noapi API endpoints.

For example:

```text
search_products
      ↓
GET /api/products/search
```

not:

```text
agent decides arbitrary URL
      ↓
fetch arbitrary URL
```

---

# 25. Authentication

The adapter should operate using the user's existing agentbridge-noapi browser session.

Conceptually:

```text
User logs into agentbridge-noapi
        ↓
Browser receives session cookie
        ↓
WebMCP tool executes
        ↓
Adapter request uses same-origin browser credentials
        ↓
AGENTBRIDGE identifies user
```

The model should never receive the raw session cookie.

Never expose:

```text
document.cookie
```

to the model.

Never return:

- passwords
- authentication tokens
- cookies
- session secrets

as tool output.

---

# 26. API Executor

Create:

```text
src/executors/apiExecutor.ts
```

The API executor should:

1. validate endpoint
2. validate HTTP method
3. validate request schema
4. construct the agentbridge-noapi URL
5. execute fetch
6. include appropriate credentials
7. parse response
8. normalize errors
9. return structured tool output

Example conceptual flow:

```text
Tool Input
   ↓
Zod validation
   ↓
Tool permission check
   ↓
Known API mapping
   ↓
AGENTBRIDGE API
   ↓
Response validation
   ↓
Tool result
```

---

# 27. Browser Executor

Create:

```text
src/executors/browserExecutor.ts
```

This is optional.

The primary execution mechanism should be the REST API.

Browser automation should only be used when a specific operation cannot be performed through the known API.

Do not use browser automation to bypass:

- authentication
- CAPTCHA
- anti-bot protections
- access controls
- authorization

Do not extract credentials.

The browser executor should only perform explicitly configured agentbridge-noapi actions.

---

# 28. Cloudflare Injection Architecture

Create a Cloudflare Worker responsible for injecting the adapter bridge into the agentbridge-noapi HTML.

Conceptually:

```text
User opens:

https://AgentBridge.example
          │
          ▼
     Cloudflare
          │
          ▼
HTMLRewriter
          │
          ▼
Inject WebMCP bridge
          │
          ▼
AGENTBRIDGE HTML
          │
          ▼
Browser executes bridge
          │
          ▼
document.modelContext.registerTool(...)
```

The original agentbridge-noapi source remains unchanged.

---

# 29. Injection

Inject the adapter bridge before the closing body tag or at another appropriate location.

Conceptually:

```html
<script
  type="module"
  src="https://adapter.example.com/webmcp-bridge.js"
></script>
```

The exact Cloudflare implementation should use the current Cloudflare Worker/HTMLRewriter APIs.

Do not claim that the remote adapter magically executes without being loaded into the page.

The bridge must actually execute in the target page context.

---

# 30. Target-Origin Protection

The Cloudflare Worker must verify:

```text
TARGET_ORIGIN
```

before injecting the adapter.

For example:

```text
Allowed:

https://AgentBridge.example

Not allowed:

https://random-site.example
https://attacker.example
```

The adapter is intentionally website-specific.

---

# 31. Website-Specific Configuration

Create:

```text
src/config/AgentBridge.ts
```

Containing the known agentbridge-noapi integration contract.

Example:

```typescript
export const agentbridge-noapiConfig = {
  origin: process.env.TARGET_ORIGIN,

  api: {
    searchProducts: "/api/products/search",
    productDetails: "/api/products",
    cart: "/api/cart",
    cartItems: "/api/cart/items",
    wishlist: "/api/wishlist",
    orders: "/api/orders",
    checkout: "/api/checkout",
    shipping: "/api/shipping/estimate",
  },
};
```

This configuration proves that the adapter is designed specifically for agentbridge-noapi.

---

# 32. Tool Descriptions

Tool descriptions must be optimized for AI agents.

Example:

```text
search_products:

Search the agentbridge-noapi product catalog using keywords,
category, price range, brand, and rating.

Returns matching products with product IDs,
names, prices, stock status, and ratings.
```

Avoid vague descriptions such as:

```text
Do something with products.
```

---

# 33. Structured Tool Results

Return predictable JSON.

Example:

```json
{
  "success": true,
  "products": [
    {
      "id": "p123",
      "name": "Gaming Laptop RTX 4060",
      "price": 899,
      "currency": "USD",
      "stock": 12
    }
  ]
}
```

Errors:

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product was not found."
  }
}
```

---

# 34. Tool Execution Flow

Implement the following architecture:

```text
AI Agent
   │
   │ chooses tool
   ▼
WebMCP
   │
   ▼
registerTool()
   │
   ▼
Tool Handler
   │
   ├── Validate input
   │
   ├── Check permission
   │
   ├── Check confirmation requirement
   │
   ├── Select predefined API mapping
   │
   ▼
API Executor
   │
   ▼
AGENTBRIDGE REST API
   │
   ▼
Response
   │
   ▼
Normalize
   │
   ▼
WebMCP Tool Result
   │
   ▼
AI Agent
```

---

# 35. Example End-to-End Interaction

The agent receives:

```text
Find me an RTX 4060 laptop under $900.
```

Agent selects:

```text
search_products
```

Input:

```json
{
  "query": "RTX 4060 laptop",
  "maxPrice": 900
}
```

Adapter maps this to:

```http
GET /api/products/search?q=RTX%204060%20laptop&maxPrice=900
```

AGENTBRIDGE responds.

Adapter returns structured products.

---

# 36. Add to Cart Example

Agent:

```text
Add the first laptop to my cart.
```

Agent calls:

```text
add_to_cart
```

Input:

```json
{
  "productId": "p123",
  "quantity": 1
}
```

Adapter:

```text
add_to_cart
      ↓
POST /api/cart/items
      ↓
AGENTBRIDGE
```

The original agentbridge-noapi UI should reflect the changed cart.

---

# 37. Checkout Example

Agent:

```text
Checkout my cart.
```

Adapter must NOT immediately place the order.

Return:

```json
{
  "success": true,
  "requiresConfirmation": true,
  "action": "checkout"
}
```

Agent asks the user for confirmation.

After explicit confirmation:

```text
checkout
      ↓
POST /api/checkout
      ↓
AGENTBRIDGE
      ↓
Order created
```

---

# 38. Logging

Log:

```text
timestamp
toolName
executionStatus
latency
endpoint
HTTP status
```

Do NOT log:

```text
password
session cookie
access token
payment information
secret
```

Example:

```text
2026-09-02T12:00:00Z
tool=search_products
status=success
latency=142ms
endpoint=/api/products/search
```

---

# 39. Development Inspector

Create an optional development page:

```text
/inspector
```

Show:

```text
AGENTBRIDGE WebMCP Adapter

Target:
https://AgentBridge.example

Registered Tools: 18

READ
 ├── search_products
 ├── get_product_details
 ├── filter_products
 ├── sort_products
 ├── get_recommendations
 ├── get_shipping_estimate
 ├── get_cart
 ├── get_wishlist
 ├── get_orders
 └── get_order_details

WRITE
 ├── add_to_cart
 ├── update_cart
 ├── add_to_wishlist
 ├── remove_from_wishlist
 └── apply_coupon

DESTRUCTIVE
 ├── remove_from_cart
 ├── clear_cart
 └── cancel_order

TRANSACTIONAL
 └── checkout
```

This inspector is for development/demo purposes.

---

# 40. Tests

Test every tool independently.

For example:

```text
search_products
   ✓ validates input
   ✓ constructs correct API request
   ✓ rejects invalid price
   ✓ handles API errors
```

Also test:

```text
add_to_cart
checkout
cancel_order
```

for permission and confirmation behavior.

---

# 41. Integration Test

Create an end-to-end test:

```text
Open agentbridge-noapi
      ↓
Cloudflare injects adapter
      ↓
WebMCP bridge loads
      ↓
Tools register
      ↓
Agent/browser discovers tools
      ↓
search_products
      ↓
AGENTBRIDGE API
      ↓
result returned
```

Also test:

```text
add_to_cart
      ↓
AGENTBRIDGE API
      ↓
cart updated
      ↓
AGENTBRIDGE UI reflects update
```

---

# 42. No Universal Adapter

This requirement must be explicit throughout the project.

The adapter is:

```text
AGENTBRIDGE WebMCP Adapter
```

It is NOT:

```text
Universal WebMCP Adapter
Universal Website Agent
Generic Website Controller
Automatic Website-to-MCP Generator
```

Do not implement:

```text
crawl arbitrary website
↓
understand DOM
↓
generate tools
```

Instead:

```text
Known agentbridge-noapi API
       ↓
Manually designed mappings
       ↓
WebMCP tools
```

---

# 43. No Origin-Code Modification

The final demonstration should prove:

```text
AGENTBRIDGE repository

does NOT contain:

document.modelContext.registerTool()
```

and does NOT contain:

```text
WebMCP
MCP server
Agent SDK
```

The adapter repository contains the WebMCP implementation.

Cloudflare provides the edge injection layer.

---

# 44. Deployment

Deploy:

### agentbridge-noapi

Any suitable hosting provider.

Example:

```text
https://AgentBridge.example
```

### Adapter

Deploy Cloudflare Worker:

```text
https://AgentBridge-webmcp-adapter.example.workers.dev
```

The Worker is responsible for:

```text
request
   ↓
check target
   ↓
fetch agentbridge-noapi
   ↓
inject WebMCP bridge
   ↓
return modified response
```

Use the current Cloudflare deployment APIs and configuration.

---

# 45. README

The README must clearly explain:

```text
AGENTBRIDGE
```

is the original WebMCP-unaware website.

```text
AGENTBRIDGE WebMCP Adapter
```

is a separate integration project.

Architecture:

```text
                   AI Agent
                       │
                       ▼
                 Browser WebMCP
                       │
                       ▼
            Cloudflare Edge Injection
                       │
                       ▼
             agentbridge-noapi WebMCP Adapter
                       │
                       ▼
              agentbridge-noapi REST API
                       │
                       ▼
                  agentbridge-noapi
```

Explain that:

- the original website source is unchanged
- the adapter is website-specific
- the adapter manually defines the tools
- Cloudflare injects the bridge
- tools execute against known agentbridge-noapi APIs
- authentication remains within the user's browser session
- dangerous operations require confirmation

---

# 46. Final Demo Scenario

The final project must support this demonstration:

### Step 1

Open the normal agentbridge-noapi website.

Show that it is an ordinary e-commerce website.

### Step 2

Show agentbridge-noapi source code.

Demonstrate:

```text
No WebMCP implementation
No registerTool()
No MCP endpoint
```

### Step 3

Show the separate:

```text
AgentBridge-webmcp-adapter
```

repository.

Show:

```text
tools/
registry/
executors/
security/
bridge/
worker/
```

### Step 4

Enable Cloudflare edge injection.

### Step 5

Open agentbridge-noapi through the injected environment.

### Step 6

WebMCP-capable agent discovers:

```text
search_products
get_product_details
get_cart
add_to_cart
...
checkout
```

### Step 7

Agent:

```text
Find me an RTX 4060 laptop under $900.
```

Tool:

```text
search_products(...)
```

### Step 8

Agent:

```text
Add the cheapest suitable laptop to my cart.
```

Tool:

```text
add_to_cart(...)
```

### Step 9

Open the cart.

Show that the original agentbridge-noapi UI has changed.

### Step 10

Agent:

```text
Checkout.
```

Adapter blocks automatic checkout:

```text
Confirmation required.
```

### Step 11

Human confirms.

### Step 12

Adapter executes:

```text
POST /api/checkout
```

### Step 13

Show the newly created order in the original agentbridge-noapi website.

---

# 47. Core Project Statement

Use this description in the README:

> agentbridge-noapi WebMCP Adapter is a website-specific external compatibility layer that enables an existing WebMCP-unaware e-commerce application to expose manually defined agent-facing WebMCP tools without modifying the application's original source code. The adapter is deployed separately and injected at the edge, where its WebMCP bridge executes in the target page context and maps structured agent actions to the website's existing REST API.

---

# 48. Important Technical Principle

Do not describe the architecture as:

```text
External server magically controls any website.
```

Describe it as:

```text
External adapter
      ↓
Cloudflare edge injection
      ↓
WebMCP bridge executes in target page context
      ↓
Registered WebMCP tools
      ↓
Known agentbridge-noapi APIs
```

The adapter is external in terms of:

- repository
- deployment
- maintenance
- source ownership
- integration architecture

but its injected WebMCP bridge necessarily executes within the webpage context so that it can register tools with the browser's WebMCP interface.

---

# 49. Final Success Criteria

The project is complete when all of the following are true:

- agentbridge-noapi works independently.
- agentbridge-noapi has a complete REST API.
- agentbridge-noapi contains no WebMCP implementation.
- agentbridge-noapi contains no MCP server.
- Adapter exists in a separate repository.
- Adapter is specifically configured for agentbridge-noapi.
- Adapter contains manually defined WebMCP tools.
- Adapter contains actual `document.modelContext.registerTool()` implementation.
- Cloudflare Worker injects the bridge.
- Browser can discover the tools.
- Public product operations work.
- Authenticated operations work using the existing browser session.
- Cart can be modified through the agent.
- Wishlist can be modified through the agent.
- Orders can be read through the agent.
- Checkout requires explicit confirmation.
- No arbitrary HTTP request tool exists.
- No credentials are exposed to the model.
- No arbitrary websites are supported.
- Original agentbridge-noapi source remains unchanged.
- End-to-end demonstration works.

The final result should clearly demonstrate that a WebMCP-unaware website can be given a carefully designed agent interface through an **external, website-specific adapter and edge injection layer**, while keeping the original application independent of WebMCP.
