# Comprehensive Development Prompt: agentbridge-noapi E-Commerce Website

## 1. Project Overview

Build a production-quality full-stack e-commerce website called **AgentBridge**.

AgentBridge is intentionally designed as a **normal WebMCP-unaware e-commerce application**.

The website must:

- provide a complete modern e-commerce experience for human users
- expose a clean, documented REST API
- support authentication and sessions
- support products, categories, search, filtering, cart, wishlist, orders, coupons, shipping estimates, and checkout
- have realistic business logic
- be suitable for integration with an external AI-agent adapter
- NOT implement WebMCP
- NOT implement `document.modelContext.registerTool()`
- NOT contain an MCP endpoint
- NOT contain an AI-agent integration
- NOT contain browser-agent-specific code

The WebMCP functionality will be implemented later in a completely separate repository.

The separation between the two projects is extremely important.

---

# 2. Core Architecture

Use the following architecture:

```text
                         HUMAN USER
                              │
                              ▼
                    ┌──────────────────┐
                    │   agentbridge-noapi UI   │
                    │ Next.js + React  │
                    └────────┬─────────┘
                             │
                             │ REST API
                             ▼
                    ┌──────────────────┐
                    │ agentbridge-noapi Server │
                    │ Next.js API      │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │ PostgreSQL DB    │
                    └──────────────────┘
```

There must be NO:

```text
WebMCP
MCP Server
document.modelContext
registerTool()
AI Agent
LLM SDK
Agent SDK
```

inside this repository.

---

# 3. Recommended Technology Stack

Use:

### Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui where useful
- Lucide icons

### Backend

Use Next.js API routes or Route Handlers.

Use:

- TypeScript
- REST API
- Zod validation
- HTTP-only session cookies

### Database

- PostgreSQL
- Prisma ORM

### Authentication

Implement:

- registration
- login
- logout
- session management
- protected routes

Use secure HTTP-only cookies.

Never expose passwords, session secrets, or authentication tokens to frontend JavaScript unnecessarily.

---

# 4. Repository Structure

Create:

```text
AgentBridge/
│
├── app/
│   ├── page.tsx
│   ├── products/
│   │   ├── page.tsx
│   │   └── [slug]/
│   │       └── page.tsx
│   │
│   ├── search/
│   │   └── page.tsx
│   │
│   ├── cart/
│   │   └── page.tsx
│   │
│   ├── wishlist/
│   │   └── page.tsx
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── register/
│   │   └── page.tsx
│   │
│   ├── account/
│   │   ├── page.tsx
│   │   ├── orders/
│   │   ├── addresses/
│   │   └── profile/
│   │
│   ├── checkout/
│   │   └── page.tsx
│   │
│   └── order-success/
│       └── [id]/
│
├── app/api/
│   ├── auth/
│   ├── products/
│   ├── cart/
│   ├── wishlist/
│   ├── orders/
│   ├── checkout/
│   ├── shipping/
│   └── recommendations/
│
├── components/
│   ├── navbar/
│   ├── product/
│   ├── cart/
│   ├── checkout/
│   ├── account/
│   └── ui/
│
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── validation.ts
│   ├── pricing.ts
│   └── api-response.ts
│
├── prisma/
│   └── schema.prisma
│
├── public/
│
├── tests/
│
├── README.md
├── package.json
└── .env.example
```

---

# 5. Product System

Create realistic product data.

Categories:

```text
Laptops
Smartphones
Headphones
Monitors
Keyboards
Mice
Accessories
```

Each product should contain:

```text
id
name
slug
description
shortDescription
brand
categoryId
price
compareAtPrice
currency
stock
rating
reviewCount
images
createdAt
updatedAt
```

Support variants.

Example:

```text
Product
 ├── Variant
 │    ├── SKU
 │    ├── Price
 │    ├── Stock
 │    └── Attributes
```

Example attributes:

```json
{
  "color": "Black",
  "ram": "16GB",
  "storage": "512GB"
}
```

---

# 6. Product Search

Implement:

```http
GET /api/products/search
```

Parameters:

```text
q
category
minPrice
maxPrice
brand
minRating
page
limit
sort
```

Example:

```text
/api/products/search?q=RTX%204060%20laptop&maxPrice=900
```

Return:

```json
{
  "success": true,
  "data": {
    "products": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

---

# 7. Product Details

Implement:

```http
GET /api/products/:id
```

Return complete product information including:

- variants
- stock
- pricing
- rating
- images
- category
- specifications

---

# 8. Filtering

Implement:

```http
GET /api/products/filter
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

---

# 9. Sorting

Support:

```text
price_asc
price_desc
rating
newest
popularity
```

---

# 10. Shopping Cart

Implement:

```http
GET    /api/cart
POST   /api/cart/items
PATCH  /api/cart/items/:id
DELETE /api/cart/items/:id
DELETE /api/cart
```

Adding a product:

```json
{
  "productId": "product-id",
  "variantId": "variant-id",
  "quantity": 1
}
```

The server must:

- validate product
- validate variant
- validate stock
- validate quantity
- calculate prices server-side
- associate the cart with the authenticated user

Never trust a client-supplied price.

---

# 11. Wishlist

Implement:

```http
GET    /api/wishlist
POST   /api/wishlist/items
DELETE /api/wishlist/items/:productId
```

The wishlist must belong to the authenticated user.

---

# 12. Authentication

Implement:

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/session
```

Use:

```text
HTTP-only cookie
Secure cookie in production
SameSite protection
```

Never return:

- password hashes
- session secrets
- authentication tokens

to the AI-agent adapter or frontend unless explicitly necessary.

The adapter should be able to use the browser's authenticated session without receiving raw credentials.

---

# 13. Orders

Implement:

```http
GET  /api/orders
GET  /api/orders/:id
POST /api/orders/:id/cancel
```

Users must only be able to access their own orders.

Never trust:

```json
{
  "userId": "..."
}
```

from the client.

Always derive the authenticated user from the server-side session.

---

# 14. Coupon System

Implement:

```http
POST /api/cart/coupon
```

Example:

```json
{
  "code": "SAVE10"
}
```

Support:

- percentage discounts
- fixed discounts
- minimum order value
- expiration
- usage limits

---

# 15. Shipping Estimate

Implement:

```http
GET /api/shipping/estimate
```

Parameters:

```text
postalCode
country
```

Return:

```json
{
  "success": true,
  "data": {
    "shippingCost": 12,
    "estimatedDays": "3-5"
  }
}
```

Use mock shipping calculations for the demo.

---

# 16. Product Recommendations

Implement:

```http
GET /api/products/recommendations
```

Return products based on:

- category
- popularity
- related products
- purchase history if available

This can use deterministic recommendation logic rather than an AI model.

---

# 17. Checkout

Implement:

```http
POST /api/checkout
```

Checkout must:

1. verify authentication
2. retrieve the user's cart
3. validate all products
4. validate inventory
5. validate quantities
6. calculate subtotal
7. apply valid discounts
8. calculate shipping
9. calculate final total
10. create order
11. create order items
12. decrease inventory
13. clear cart
14. return order information

Use a database transaction.

---

# 18. Payment

Do NOT integrate real payment processing.

Use a mock payment system.

Example:

```json
{
  "paymentMethod": "mock"
}
```

The purpose is to demonstrate the agent workflow without handling real financial credentials.

---

# 19. API Response Standard

Every API response should follow:

### Success

```json
{
  "success": true,
  "data": {}
}
```

### Error

```json
{
  "success": false,
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product not found"
  }
}
```

Use consistent HTTP status codes.

---

# 20. API Documentation

Create an API documentation page.

Document every endpoint with:

- HTTP method
- URL
- authentication requirement
- parameters
- request body
- response
- error responses
- example requests

Also create an OpenAPI specification:

```text
/openapi.json
```

The REST API should be easy for an external integration layer to consume.

---

# 21. WebMCP Isolation Requirement

This is critical.

The agentbridge-noapi source code MUST NOT contain:

```javascript
document.modelContext;
```

or:

```javascript
navigator.modelContext;
```

or:

```javascript
registerTool(...)
```

or:

```text
MCP
WebMCP
Model Context Protocol
```

as an implementation.

Do not add an MCP endpoint such as:

```text
/mcp
```

The website must behave exactly like a conventional e-commerce application.

---

# 22. External Adapter Compatibility

Design the API so that a completely external project can perform the following operations:

```text
search products
get product details
filter products
sort products
get recommendations
get shipping estimate

get cart
add to cart
update cart
remove from cart
clear cart

get wishlist
add wishlist item
remove wishlist item

get orders
get order details
cancel order

apply coupon

checkout
```

The external adapter will later map these operations into WebMCP tools.

The agentbridge-noapi project must NOT know that this adapter exists.

---

# 23. UI Requirements

Create a polished modern e-commerce interface.

Include:

- responsive navbar
- search bar
- category navigation
- product cards
- filters
- sorting
- product detail page
- cart drawer/page
- wishlist
- authentication UI
- account dashboard
- order history
- checkout
- order confirmation

The UI should clearly show changes caused by API operations.

For example, when an external system adds a product to the cart, refreshing or navigating to the cart should show the updated cart.

---

# 24. Seed Data

Create realistic seed data.

Include at least:

- 30 products
- multiple categories
- multiple brands
- product variants
- different prices
- different stock levels
- ratings
- sample users
- sample orders
- coupon codes

Create:

```bash
npm run db:seed
```

---

# 25. Testing

Create tests for:

- product search
- filtering
- product details
- authentication
- cart operations
- wishlist operations
- order access control
- coupon validation
- shipping calculation
- checkout
- inventory updates

Test that users cannot access another user's:

- cart
- wishlist
- orders

---

# 26. Security Requirements

Implement:

- input validation
- SQL injection protection through Prisma
- authentication
- authorization
- CSRF-safe authentication architecture
- rate limiting where appropriate
- secure cookies
- server-side price calculation
- server-side inventory validation

Never expose:

- password hashes
- session secrets
- private API keys
- database credentials

---

# 27. Final Principle

AgentBridge is the **origin application**.

It does not know about AI agents.

It does not know about WebMCP.

It only exposes a clean, well-designed REST API.

The future architecture will be:

```text
                    AI AGENT
                        │
                        ▼
                Browser WebMCP
                        │
                        ▼
             External WebMCP Adapter
                        │
                        ▼
                 agentbridge-noapi REST API
                        │
                        ▼
                  agentbridge-noapi Server
                        │
                        ▼
                    Database
```

Keep these two systems completely separate.
