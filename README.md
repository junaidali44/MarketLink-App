# MarketLink

> **Farm Fresh Just a Click Away** — a full-stack MERN platform connecting local farmers-market vendors with customers for pre-ordering fresh produce.

![MarketLink](https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=1200&q=80&auto=format&fit=crop)

---

## Table of Contents

1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Solution](#solution)
4. [Tech Stack](#tech-stack)
5. [Architecture](#architecture)
6. [Features](#features)
7. [Project Structure](#project-structure)
8. [Database Schema](#database-schema)
9. [API Reference](#api-reference)
10. [Installation & Setup](#installation--setup)
11. [Environment Variables](#environment-variables)
12. [Running the Application](#running-the-application)
13. [Demo Credentials](#demo-credentials)
14. [Deployment](#deployment)
15. [Testing](#testing)
16. [Team](#team)
17. [AI Tools Acknowledgement](#ai-tools-acknowledgement)
18. [License](#license)

---

## Overview

**MarketLink** is a full-stack web application that digitizes the traditional farmers-market experience. It allows local farmers to publish their weekly stock, manage pre-orders, and connect with customers — while giving customers the ability to discover nearby markets, browse available produce, reserve items for pickup, and leave feedback.

The platform bridges the information gap between farmers and consumers by centralizing inventory, pricing, pickup windows, and location data in a single application with interactive map support.

---

## Problem Statement

Local farmers markets are growing in popularity, but customers rarely know in advance:

- Which farmers will be present on a given day
- What stock they have available
- At what price items are being sold
- Whether their preferred farmer is even open this week

Availability is communicated informally through chalkboards, printed flyers, or word of mouth. This leads to wasted trips, sold-out inventory, and missed sales opportunities for farmers.

---

## Solution

MarketLink provides a unified platform where:

- **Farmers** register their stall, publish weekly stock, set pickup windows, and manage incoming pre-orders.
- **Customers** browse markets and farmers, filter products, place pre-orders for pickup, and leave reviews.
- **Administrators** approve farmers, manage markets, moderate content, and access platform-wide analytics.

An **AI-powered assistant** helps customers find products and answers common questions about markets, timings, and pickups.

---

## Tech Stack

### Frontend
| Layer | Technology |
|---|---|
| Framework | React 18 (Vite) |
| Routing | React Router v6 |
| State / Data | React Query (TanStack) + Context API |
| HTTP Client | Axios |
| Forms | React Hook Form + Zod |
| Maps | Leaflet + OpenStreetMap |
| Styling | TailwindCSS |
| Notifications | React Hot Toast |
| Icons | Lucide React |

### Backend
| Layer | Technology |
|---|---|
| Runtime | Node.js 20 |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Auth | JWT + bcryptjs |
| Validation | Joi |
| File Upload | Multer + Cloudinary |
| Email | Nodemailer |
| AI | Google Gemini API |
| Security | Helmet, CORS, express-rate-limit |

### DevOps
| Layer | Technology |
|---|---|
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |
| Database Hosting | MongoDB Atlas |
| API Testing | Postman |
| Version Control | Git + GitHub |

---

## Architecture

MarketLink follows a standard **3-tier architecture**:
┌─────────────────────────────────────────────────────┐
│ CLIENT (React + Vite) │
│ Customer │ Farmer │ Admin │ Public │
└──────────────────────┬──────────────────────────────┘
│ HTTPS / REST
┌──────────────────────▼──────────────────────────────┐
│ SERVER (Node.js + Express) │
│ Routes → Controllers → Services → Models │
│ Middleware: Auth, Validation, Error Handling │
└──────────────────────┬──────────────────────────────┘
│ Mongoose
┌──────────────────────▼──────────────────────────────┐
│ DATABASE (MongoDB Atlas) │
│ users, farmers, markets, products, orders, │
│ reviews, notifications, categories │
└─────────────────────────────────────────────────────┘

### Request Lifecycle

1. Client sends HTTP request with optional JWT in `Authorization: Bearer <token>` header.
2. Express route matches → middleware chain runs (`verifyJWT` → `requireRole` → `validate`).
3. Controller calls business logic in a service or directly queries the model.
4. Response returned in a uniform envelope: `{ success, data, message }` or `{ success, error }`.

---

## Features

### Customer
- Register / login with JWT authentication
- Browse markets and farmers with map integration
- Search, filter, and sort products by category, price, market, and availability
- Place pre-orders for pickup at the market
- View order history and cancel before the farmer's cutoff time
- Save favorite farmers and products
- Leave ratings and reviews after completed orders
- Receive in-app notifications for order status changes
- AI chatbot for product discovery and FAQs

### Farmer
- Register (pending admin approval) and manage profile
- Add / edit / delete products with images
- Weekly stock templates for recurring inventory
- View incoming pre-orders, accept or decline them
- Mark orders as ready for pickup
- Set pickup windows and cutoff times
- View sales insights and total revenue
- Respond to customer reviews

### Admin
- Dedicated dashboard with platform-wide metrics
- Approve or suspend farmer registrations
- Activate / deactivate customer accounts
- Manage markets (add, edit, remove)
- Manage product categories
- Moderate reviews
- Generate reports (orders, revenue, most active farmers)

### Shared
- Role-Based Access Control (RBAC)
- Responsive design across mobile, tablet, and desktop
- Notifications for order events
- Ratings and feedback
- AI assistant

---

## Project Structure
MarketLink-App/
├── client/ # React frontend
│ ├── public/
│ ├── src/
│ │ ├── api/ # Axios modules per resource
│ │ ├── components/ # Reusable UI components
│ │ ├── context/ # Auth, Cart contexts
│ │ ├── hooks/ # Custom hooks
│ │ ├── layouts/ # Public / Customer / Farmer / Admin
│ │ ├── pages/ # Route-level components
│ │ ├── utils/ # Formatters, constants
│ │ ├── App.jsx
│ │ └── main.jsx
│ └── package.json
│
├── server/ # Express backend
│ ├── scripts/
│ │ └── seed.js # Demo data seeder
│ ├── src/
│ │ ├── config/ # db.js, env.js
│ │ ├── controllers/ # Business endpoints
│ │ ├── middleware/ # auth, error, validate
│ │ ├── models/ # Mongoose schemas
│ │ ├── routes/ # Express routers
│ │ ├── services/ # Email, AI, Cloudinary, Orders
│ │ ├── utils/ # response, asyncHandler, token
│ │ ├── app.js # Express app
│ │ └── server.js # HTTP server entry
│ ├── postman/ # Collection + environment
│ └── package.json
│
├── docs/ # SRS, diagrams, report
└── README.md


---

## Database Schema

MarketLink uses **MongoDB** with **Mongoose ODM**. Eight collections model the domain.

### `users`
Stores all accounts (customers, farmers, admins).

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `name` | String | Required |
| `email` | String | Required, unique, lowercase |
| `passwordHash` | String | bcrypt hashed |
| `phone` | String | Required |
| `address` | String | Optional |
| `role` | String | `customer` \| `farmer` \| `admin` |
| `isActive` | Boolean | Admin can deactivate |
| `isApproved` | Boolean | Farmers start as `false` |
| `favorites` | [ObjectId] | Refs to `farmer_profiles` |
| `createdAt`, `updatedAt` | Date | Auto |

**Indexes:** `email` (unique), `role`

---

### `farmer_profiles`
Extended profile for users with role `farmer`.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `userId` | ObjectId | Ref `users`, unique |
| `stallName` | String | Required |
| `contactPerson` | String | Required |
| `description` | String | Optional |
| `imageUrl` | String | Cloudinary / external URL |
| `markets` | [ObjectId] | Refs to `markets` |
| `operatingDays` | [String] | `Mon`…`Sun` |
| `pickupWindows` | [{ day, startTime, endTime }] | Weekly pickup slots |
| `location` | Object | `{ address, lat, lng, type, coordinates }` |
| `rating` | Number | Average rating (0–5) |
| `totalReviews` | Number | Count of reviews |
| `createdAt`, `updatedAt` | Date | Auto |

**Indexes:** `userId` (unique), `location.coordinates` (**2dsphere** for geospatial queries)

---

### `markets`
Physical farmers-market locations.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `name` | String | Required |
| `address` | String | Required |
| `lat`, `lng` | Number | Required |
| `mapProvider` | String | `osm` \| `google` |
| `operatingDays` | [String] | Weekly days |
| `timings` | Object | `{ open, close }` in `HH:mm` |
| `location` | GeoJSON Point | `{ type: 'Point', coordinates: [lng, lat] }` |
| `createdBy` | ObjectId | Ref `users` (admin) |
| `createdAt`, `updatedAt` | Date | Auto |

**Indexes:** `location` (**2dsphere**)

---

### `products`
Weekly stock items listed by farmers.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `farmerId` | ObjectId | Ref `farmer_profiles` |
| `name` | String | Required |
| `category` | String | Matches `categories.name` |
| `description` | String | Optional |
| `price` | Number | Required |
| `unit` | String | `kg` \| `dozen` \| `piece` \| `litre` \| `bunch` |
| `stockQuantity` | Number | Required |
| `imageUrl` | String | Cloudinary / external |
| `isAvailable` | Boolean | Default `true` |
| `isTemplate` | Boolean | Weekly recurring template flag |
| `weekOf` | Date | For non-template items |
| `createdAt`, `updatedAt` | Date | Auto |

**Indexes:** `{ farmerId, isAvailable }`, `category`, text index on `{ name, description }`

---

### `orders`
Pre-orders placed by customers for pickup.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `customerId` | ObjectId | Ref `users` |
| `farmerId` | ObjectId | Ref `farmer_profiles` |
| `marketId` | ObjectId | Ref `markets` |
| `items` | [{ productId, name, price, quantity, unit }] | **Snapshot** at order time |
| `totalAmount` | Number | Computed |
| `pickupDate` | Date | Required |
| `pickupWindow` | Object | `{ startTime, endTime }` |
| `status` | String | `placed` \| `accepted` \| `declined` \| `ready` \| `completed` \| `cancelled` |
| `cutoffTime` | Date | 12h before pickup |
| `notes` | String | Optional |
| `createdAt`, `updatedAt` | Date | Auto |

**Indexes:** `{ customerId, status }`, `{ farmerId, status }`

**Business rules:**
- Prices are **snapshotted** at order time; later product price changes do not affect existing orders.
- Stock is decremented on order placement, restored on cancellation.
- Cancellation allowed only before `cutoffTime`.

---

### `reviews`
Ratings and comments on completed orders.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `orderId` | ObjectId | Ref `orders`, **unique** |
| `productId` | ObjectId | Ref `products` |
| `farmerId` | ObjectId | Ref `farmer_profiles` |
| `customerId` | ObjectId | Ref `users` |
| `rating` | Number | 1–5 |
| `comment` | String | Optional |
| `farmerResponse` | String | Optional |
| `createdAt`, `updatedAt` | Date | Auto |

**Indexes:** `farmerId`, `orderId` (unique)

**Business rule:** Only allowed after order status = `completed`.

---

### `notifications`
In-app notifications for order events.

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `userId` | ObjectId | Ref `users` |
| `type` | String | `order_placed`, `order_accepted`, `order_ready`, `order_declined`, `order_cancelled`, `review_received`, `farmer_approved` |
| `message` | String | Human-readable |
| `link` | String | Frontend deep link |
| `isRead` | Boolean | Default `false` |
| `createdAt` | Date | Auto |

**Indexes:** `{ userId, isRead }`

---

### `categories`
Master list of product categories (admin-managed).

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | PK |
| `name` | String | Required, unique |
| `imageUrl` | String | Optional |
| `isActive` | Boolean | Default `true` |
| `createdAt`, `updatedAt` | Date | Auto |

---

## API Reference

**Base URL:** `https://your-railway-url.up.railway.app/api`

**Auth:** All protected routes expect `Authorization: Bearer <JWT>` header.

**Response envelope:**
```json
{ "success": true,  "data": { ... }, "message": "..." }
{ "success": false, "error": "..." }
Authentication
Method	Endpoint	Access	Description
POST	/auth/register	Public	Register a customer
POST	/auth/register/farmer	Public	Register a farmer (pending admin approval)
POST	/auth/login	Public	Login (all roles)
GET	/auth/me	Auth	Get current user
POST	/auth/logout	Auth	Logout (stateless)
POST	/auth/bootstrap-admin	Dev only	Create first admin
Users
Method	Endpoint	Access	Description
PUT	/users/profile	Auth	Update own profile
Favorites
Method	Endpoint	Access	Description
POST	/favorites/:farmerId	Customer	Toggle favorite
GET	/favorites	Customer	List favorites
Notifications
Method	Endpoint	Access	Description
GET	/notifications	Auth	List notifications
PATCH	/notifications/:id/read	Auth	Mark one as read
PATCH	/notifications/read-all	Auth	Mark all as read
Admin
Method	Endpoint	Access	Description
GET	/admin/dashboard	Admin	Platform metrics
GET	/admin/reports	Admin	Reports (orders, revenue)
GET	/admin/farmers	Admin	List all farmers
GET	/admin/farmers/pending	Admin	List pending farmers
PATCH	/admin/farmers/:id/approve	Admin	Approve farmer
PATCH	/admin/farmers/:id/suspend	Admin	Suspend farmer
GET	/admin/customers	Admin	List customers
PATCH	/admin/customers/:id/status	Admin	Activate / deactivate
GET	/admin/categories	Admin	List categories
POST	/admin/categories	Admin	Create category
PUT	/admin/categories/:id	Admin	Update category
DELETE	/admin/categories/:id	Admin	Delete category
Markets
Method	Endpoint	Access	Description
GET	/markets	Public	List markets (filter by day, city)
GET	/markets/near	Public	Nearby (lat, lng, radiusKm)
GET	/markets/:id	Public	Market details
POST	/markets	Admin	Create market
PUT	/markets/:id	Admin	Update market
DELETE	/markets/:id	Admin	Delete market
Farmers
Method	Endpoint	Access	Description
GET	/farmers	Public	List farmers (filter by market, day)
GET	/farmers/me	Farmer	Own profile
GET	/farmers/:id	Public	Farmer public profile
GET	/farmers/:id/products	Public	Products by farmer
PUT	/farmers/profile	Farmer	Update own profile
Products
Method	Endpoint	Access	Description
GET	/products	Public	Search / filter / paginate
GET	/products/mine	Farmer	Own products
GET	/products/:id	Public	Product details
POST	/products	Farmer	Create product
POST	/products/template	Farmer	Create weekly template
PUT	/products/:id	Farmer	Update own product
DELETE	/products/:id	Farmer	Delete own product
PATCH	/products/:id/availability	Farmer	Toggle availability
Query params for GET /products: search, category, farmerId, marketId, minPrice, maxPrice, availableOnly, page, limit, sort

Orders
Method	Endpoint	Access	Description
POST	/orders	Customer	Place pre-order
GET	/orders/my	Customer	Own orders
GET	/orders/farmer	Farmer	Incoming orders
GET	/orders/:id	Owner / Admin	Order details
PATCH	/orders/:id/status	Farmer	Accept / decline / ready / complete
PATCH	/orders/:id/cancel	Customer	Cancel before cutoff
PATCH	/orders/:id/modify	Customer	Modify before cutoff
Reviews
Method	Endpoint	Access	Description
POST	/reviews	Customer	Post review after completed order
GET	/reviews/farmer/:id	Public	Reviews for a farmer
GET	/reviews/product/:id	Public	Reviews for a product
POST	/reviews/:id/respond	Farmer	Respond to review
DELETE	/reviews/:id	Admin	Remove review
AI Assistant
Method	Endpoint	Access	Description
POST	/ai/chat	Public	Chat with AI assistant
File Upload
Method	Endpoint	Access	Description
POST	/upload/image	Auth	Upload image (multipart form: file)
Health
Method	Endpoint	Access	Description
GET	/health	Public	Health check
Installation & Setup
Prerequisites
Node.js ≥ 18

npm ≥ 9

MongoDB Atlas account (free tier)

Cloudinary account (free tier, optional)

Google Gemini API key (free tier, optional)

1. Clone the repository
git clone https://github.com/junaidali44/MarketLink-App.git
cd MarketLink-App
cd server
npm install
cp .env.example .env
# Edit .env with your values
cd ../client
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
cd ../server
npm run seed
5. Run locally
Terminal 1 (backend):
cd server
npm run dev
Terminal 2 (frontend):
Set Root Directory to /server

Add environment variables (see above)

Set Build Command to npm install

Set Start Command to npm start

Set Healthcheck Path to /api/health

Generate a public domain

Frontend — Vercel
Sign in to Vercel with GitHub

Import Project → select the repo

Set Root Directory to client

Add environment variable:

VITE_API_URL = your Railway backend URL + /api

Deploy

Database — MongoDB Atlas
Create a free M0 cluster

Add database user

Whitelist IPs (0.0.0.0/0 for cloud hosting)

Copy the connection string into MONGO_URI

Testing
Postman
The repository includes a Postman collection and environment under server/postman/.

Import MarketLink.postman_collection.json

Import MarketLink.postman_environment.json

Select the MarketLink - Local environment

Run requests top-to-bottom to exercise the full flow

Manual smoke test
bash
# Health
curl https://your-railway-url.up.railway.app/api/health

# Markets
curl https://your-railway-url.up.railway.app/api/markets

# Products
curl https://your-railway-url.up.railway.app/api/products
Team
Name	Role
Junaid Ali	Backend (Auth, Admin, Models, Deployment)
Noor	Backend (Markets, Products, Orders, Reviews)
Suffyan	Frontend (Customer + Public)
Hamza	Frontend (Farmer + Admin + Maps)
AI Tools Acknowledgement
In accordance with the project guidelines, the following AI tools were used during development for learning, productivity, and debugging support. All final code, design decisions, and implementation logic reflect the team's own work.

Tool	Usage
ChatGPT / Claude	Documentation drafting, code review suggestions, debugging help
GitHub Copilot	Inline code suggestions during development
Google Gemini API	Powers the in-app AI assistant (runtime feature)
No AI tool was used to generate complete, ready-made project templates or documentation without modification and understanding.

License
This project was developed for academic and competition purposes. All rights reserved by the MarketLink team.

Built with ❤️ in Karachi, Pakistan
---

## How to Use This

1. **Save it as `README.md` in your repo root** (not inside `server/` or `client/`).
2. Replace `your-railway-url.up.railway.app` with your actual Railway domain once you have it.
3. Replace `junaidali44/MarketLink-App` if your repo name differs.
4. Commit and push:

```bash
git add README.md
git commit -m "docs: add complete project README with schemas and API reference"
git push origin main
git push origin develop
