# eatLays — Campus Food Pre-Ordering & Queue Management Platform

> **Skip the Queue. Order Ahead. Pick Up Between Classes.**

**eatLays** is a full-stack campus food pre-ordering and queue-management platform built specifically for college students and campus canteen vendors. Students have short 15-to-30 minute breaks between classes; during peak lunch hours, they lose valuable break time waiting in long canteen lines.

eatLays solves this problem by allowing students to browse canteens across campus, order ahead, follow live kitchen preparation, and collect hot meals directly from the express counter using a 4-digit token code.

---

## Critical Distinction

**eatLays is strictly a campus counter pickup & queue management platform.**
- NO home delivery, delivery riders, or delivery addresses
- NO delivery fees or rider dashboards
- Freshly prepared meals collected at dedicated canteen pickup counters

---

## The 5-Step Student Journey

```
[ 01. Browse Canteens ] ──> [ 02. Choose Food ] ──> [ 03. Place Order ] ──> [ 04. Track Live Queue ] ──> [ 05. Collect at Counter ]
```

1. **Browse a Canteen:** Discover campus dining spots, live operating hours, and location blocks.
2. **Choose Food:** Explore categorized menus, customized prep times, and prices.
3. **Place Order:** Review order summary with transparent pricing and single-canteen checkout.
4. **Track Live Queue:** Watch kitchen status advance in real-time (`PLACED` -> `ACCEPTED` -> `PREPARING` -> `READY`).
5. **Collect at Counter:** Show the authoritative 4-digit pickup token code to counter staff to collect your meal.

---

## Brand Identity & Color Palette

eatLays combines a modern, high-contrast interface with selected **retro-comic accents**: solid ink black (`#19130F`) outlines, restrained 3px/4px offset drop shadows, chunky display typography (*Paytone One*, *Titan One*), and clean body typography (*Plus Jakarta Sans*).

| Color Token | Hex Code | Semantic Role |
| :--- | :--- | :--- |
| **Primary Orange** | `#FF7900` | **Dominant brand color**, hero backgrounds, primary navbar, key CTAs, active pills |
| **Fiery Red-Orange** | `#FF3D0A` | Highlights, important actions, order buttons, price tags, alerts |
| **Butter Cream** | `#FFF0B8` | Surface cards, pills, informative boxes, comfortable reading surfaces |
| **Ink Black** | `#19130F` | Strong typography, 2px solid outlines, restrained offset shadows |
| **White** | `#FFFFFF` | Clean content surfaces and readability |
| **Minor Brand Accent** | `#590004` | Optional minor brand accent |

*Strictly zero emojis are used across the application. All icons are rendered via professional Lucide React vector icons.*

---

## Tech Stack

### Frontend
- **Framework:** React 19 + Vite
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4 + Custom Retro-Comic Design System
- **Icons:** Lucide React (no emojis)
- **State Management:** React Context API (`AuthContext`, `CartContext`)

### Backend
- **Runtime:** Node.js (ES Modules)
- **Framework:** Express.js
- **Database:** PostgreSQL (local / cloud)
- **ORM:** Prisma ORM
- **Authentication:** JWT with bcryptjs password hashing
- **Security:** Helmet, express-rate-limit, single-outlet transactional order validation

---

## Project Structure

```
eatLays/
├── client/                      # React frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/              # Illustrations & logos
│   │   ├── components/
│   │   │   ├── common/          # OutletConflictModal, ProtectedRoute
│   │   │   └── layout/          # Navbar, Footer
│   │   ├── context/             # AuthContext, CartContext
│   │   ├── pages/
│   │   │   ├── admin/           # AdminDashboardPage
│   │   │   ├── public/          # LandingPage, OutletsPage, OutletMenuPage, LoginPage, RegisterPage
│   │   │   ├── student/         # CartPage, CheckoutPage, OrderTrackingPage, MyOrdersPage
│   │   │   └── vendor/          # VendorDashboardPage, VendorOrdersPage, VendorMenuPage
│   │   ├── services/            # Axios/Fetch API client
│   │   ├── App.jsx
│   │   └── index.css            # Retro-comic utility tokens
│   └── package.json
├── server/                      # Node.js backend
│   ├── prisma/
│   │   ├── schema.prisma        # PostgreSQL models (User, Outlet, MenuItem, Order, etc.)
│   │   └── seed.js              # Comprehensive campus seed data
│   ├── src/
│   │   ├── controllers/         # Auth, Outlets, Orders, Vendor, Admin
│   │   ├── middleware/          # JWT auth & role-based access control
│   │   ├── routes/              # Express API route declarations
│   │   └── index.js             # Server entry point
│   ├── test-flows.js            # Automated 20/20 end-to-end integration test suite
│   ├── .env.example
│   └── package.json
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** (v14+ running locally or a connection URI like Supabase/Neon)

### 2. Backend Setup
```bash
cd server
npm install

# Create environment file from example
cp .env.example .env

# Configure your PostgreSQL connection in .env:
# DATABASE_URL="postgresql://postgres:postgres@localhost:5432/eatlays?schema=public"
# JWT_SECRET="your_jwt_secret"
# PORT=5000

# Push schema and seed campus test data
npx prisma db push
npx prisma db seed

# Run backend development server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Start Vite development server
npm run dev
```

Frontend will run at: `http://localhost:5173`
Backend will run at: `http://localhost:5000`

---

## Demo Credentials (Autofill Enabled on Login Page)

| Role | Email | Password | Access / Capabilities |
| :--- | :--- | :--- | :--- |
| **Student** | `student@campus.edu` | `Student123!` | Browse canteens, cart, counter pre-orders, live order tracking |
| **Vendor** | `vendor.central@campus.edu` | `Vendor123!` | Kitchen terminal, order acceptance, preparation timeline, PIN verification, menu control |
| **Admin** | `admin@campus.edu` | `Admin123!` | Campus outlet management, vendor-outlet assignment, platform audit log |

---

## Automated Verification Tests

The repository includes a comprehensive 20-step end-to-end test suite verifying all database operations, role escalation protections, single-outlet transactional guarantees, and live queue state machine transitions:

```bash
cd server
node test-flows.js
```

All 20 integration tests verify:
- Database connectivity & health endpoints
- Strict public student registration role enforcement
- Cross-outlet cart item conflict prevention
- Counter pickup PIN generation and snapshot immutability
- Role-based authorization for students, vendors, and admins
- Valid state machine transitions: `PLACED` -> `ACCEPTED` -> `PREPARING` -> `READY` -> `COMPLETED`
- Prevention of illegal state rollbacks
