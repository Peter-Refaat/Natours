# 🏞️ Natours — Full-Stack Tourism Web Application

> A complete full-stack web application built with **Node.js**, **Express**, **MongoDB/Mongoose**, **Pug** templating, and modern JavaScript (ES Modules). The API follows **REST architecture** principles. This project is built as part of the [Jonas Schmedtmann](https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/) Node.js, Express, MongoDB & More: The Complete Bootcamp

<div align="center">

![Natours Logo](public/img/logo-green.png)

</div>

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Routes & API Endpoints](#routes--api-endpoints)
- [Authentication & Authorization](#authentication--authorization)
- [Payment Integration](#payment-integration)
- [Email System](#email-system)
- [Data Import/Export](#data-importexport)
- [Security Features](#security-features)
- [Key Design Patterns](#key-design-patterns)

---

## ✨ Features

- **🛣️ RESTful API Architecture** — All endpoints follow REST conventions with proper HTTP methods, resource-based URLs, and status codes
- **🌍 Tour Management** — Create, read, update, and delete tours with image uploads and GeoJSON location data
- **👥 User Authentication** — Full signup, login, logout, password reset, and role-based access control
- **⭐ Reviews & Ratings** — Users can leave reviews; automatic average rating calculation via Mongoose middleware
- **💳 Payment Checkout** — Integration with **Paymob** payment gateway for secure bookings
- **📧 Email Notifications** — Welcome and password reset emails via **Nodemailer** with responsive Pug templates
- **🗺️ Interactive Maps** — Leaflet.js maps showing tour locations with GeoJSON data
- **📊 Analytics Dashboard** — Tour statistics and monthly tour plans via MongoDB Aggregation Pipeline
- **🔍 Advanced Querying** — Filtering, sorting, field limiting, and pagination via a custom `APIFeatures` class
- **🛡️ Security Hardening** — Helmet.js, CORS, XSS sanitization, NoSQL injection prevention, rate limiting, and HPP protection
- **🌙 Dark Mode Toggle** — Client-side theme switching with localStorage persistence
- **📱 Responsive Design** — Mobile-first CSS with modern UI components

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|-----------|
| **Backend** | Node.js (ES Modules) |
| **Framework** | Express.js |
| **Database** | MongoDB + Mongoose |
| **Templating** | Pug (formerly Jade) |
| **CSS** | Custom stylesheet (SCSS-inspired variables) |
| **Client-side JS** | Vanilla JS + Axios |
| **Maps** | Leaflet.js + Esri ArcGIS tiles |
| **Payments** | Paymob Payment Gateway |
| **Email** | Nodemailer + Mailtrap (dev) / Brevo (prod) |
| **Image Processing** | Sharp |
| **File Upload** | Multer (memory storage) |
| **Security** | Helmet, CORS, express-mongo-sanitize, HPP, express-rate-limit |
| **Validation** | validator.js |
| **Testing Data** | JSON seed data + `dev-data` scripts |
| **Linting** | ESLint (Airbnb config) + Prettier |
| **Build** | esbuild (JS bundling) |

---

## 📁 Project Structure

```
natours/
├── app.js                    # Express application setup & middleware configuration
├── server.js                 # Entry point: DB connection, error handlers, server start
├── config.env                # Environment variables (DB, JWT, email, payment keys)
├── package.json              # Project dependencies & scripts

├── controllers/              # Request handlers (business logic)
│   ├── authController.js     # Signup, login, logout, JWT protect, password reset
│   ├── tourController.js     # CRUD + stats, monthly plan, geo-queries, image upload
│   ├── userController.js     # User profile update, photo upload, role management
│   ├── reviewController.js   # Review CRUD with automatic rating aggregation
│   ├── bookingController.js  # Checkout session, booking management
│   ├── viewsController.js    # Server-side rendered page controllers (Pug)
│   ├── errorController.js    # Global error handler with dev/prod modes
│   └── handlerFactory.js     # Reusable CRUD factory (deleteOne, updateOne, createOne, getOne, getAll)

├── models/                   # Mongoose schemas & models
│   ├── tourModel.js          # Tour schema with GeoJSON, virtuals, middleware
│   ├── userModel.js          # User schema with bcrypt, JWT, password reset tokens
│   ├── reviewModel.js        # Review schema with aggregation for average ratings
│   └── bookingModel.js       # Booking schema linking users and tours

├── routes/                   # Express route definitions
│   ├── tourRoutes.js         # Tour CRUD, stats, geo-queries, nested reviews
│   ├── userRoutes.js         # Auth, profile, admin user management
│   ├── reviewRoutes.js       # Review CRUD with authentication & authorization
│   ├── bookingRoutes.js      # Booking checkout and management
│   └── viewRoutes.js         # Server-rendered page routes (Pug templates)

├── views/                    # Pug templates (server-side rendering)
│   ├── base.pug              # Base layout with head/body blocks
│   ├── overview.pug          # Homepage with all tour cards
│   ├── tour.pug              # Individual tour detail page with map & reviews
│   ├── login.pug             # Login form
│   ├── signup.pug            # Signup form
│   ├── account.pug           # User account settings & profile
│   ├── error.pug             # Error page
│   ├── _header.pug           # Navigation header component
│   ├── _footer.pug           # Footer component
│   ├── _reviewCard.pug       # Review card mixin
│   └── email/                # Email templates
│       ├── baseEmail.pug     # Responsive email layout
│       ├── welcome.pug       # Welcome email
│       ├── passwordReset.pug # Password reset email
│       └── _style.pug        # Email CSS styles

├── utils/                    # Utility functions & helpers
│   ├── apiFeatures.js        # Query builder (filter, sort, limit, paginate)
│   ├── appError.js           # Custom error class with operational vs programmer errors
│   ├── catchAsync.js         # Async error wrapper for Express routes
│   ├── deepSanitize.js       # Recursive XSS sanitizer using sanitize-html
│   ├── email.js              # Email service class with Nodemailer transport
│   └── multer.js             # Multer configuration for image uploads

├── services/                 # External service integrations
│   └── paymobService.js      # Paymob payment gateway integration

├── public/                   # Static assets served by Express
│   ├── css/style.css         # Complete stylesheet with CSS variables & responsive design
│   ├── js/                   # Client-side JavaScript modules
│   │   ├── index.js          # Main entry point — event listeners, theme toggle, map init
│   │   ├── login.js          # Login & logout API calls
│   │   ├── signup.js         # Signup API call
│   │   ├── payment.js        # Tour booking & checkout flow
│   │   ├── updateSettings.js # Profile & password update API calls
│   │   ├── alerts.js         # Toast notification system
│   │   ├── leaflet.js        # Interactive map rendering
│   │   └── bundle.js         # esbuild-bundled JavaScript
│   ├── img/                  # Images (tour covers, user photos, icons, logos)
│   └── overview.html         # Static HTML version of homepage

├── dev-data/                 # Development seed data
│   ├── data/
│   │   ├── tours.json        # Sample tour data (9 tours)
│   │   ├── users.json        # Sample user data (20 users)
│   │   ├── reviews.json      # Sample review data
│   │   ├── tours-simple.json # Simplified tour data
│   │   └── import-dev-data.js # CLI script to import/delete data into MongoDB
│   ├── img/                  # Seed images for users and tours
│   └── templates/            # Template variants for development

└── .eslintrc.json            # ESLint configuration (Airbnb + Prettier)
    .prettierrc               # Prettier formatting rules
    .gitignore                # Git ignore rules
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 10.0.0
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm or yarn

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd 4-natours/starter

# 2. Install dependencies
npm install

# 3. Set up environment variables
# Copy config.env and add your MongoDB URI, JWT secret, email credentials, etc.
cp config.env .env  # Edit with your own values

# 4. Start the development server
npm run dev

# Or start in production mode
npm start
```

### Import Development Data

```bash
# Import seed data into MongoDB
node dev-data/data/import-dev-data.js --import

# Delete all data from MongoDB
node dev-data/data/import-dev-data.js --delete
```

### Build Client-Side JavaScript

```bash
# Bundle JS with esbuild (watches for changes)
npm run build:js
```

---

## 📡 Routes & API Endpoints

### 🗺️ Tours (`/api/v1/tours`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/` | Get all tours (filter, sort, paginate) | Public |
| `GET` | `/top-5-cheap` | Top 5 cheapest tours | Public |
| `GET` | `/tour-stats` | Tour statistics by difficulty | Public |
| `GET` | `/monthly-plan/:year` | Monthly tour starts plan | Admin/Lead-guide/Guide |
| `GET` | `/tours-within/:distance/center/:latlng/unit/:unit` | Tours within radius | Public |
| `GET` | `/distances/:latlng/unit/:unit` | Distance from location | Public |
| `GET` | `/:id` | Get single tour (with reviews) | Public |
| `POST` | `/` | Create a new tour | Admin/Lead-guide |
| `PATCH` | `/:id` | Update tour (+ image upload) | Admin/Lead-guide |
| `DELETE` | `/:id` | Delete a tour | Admin/Lead-guide |

### 👤 Users (`/api/v1/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `POST` | `/signup` | Create a new account | Public |
| `POST` | `/login` | Login & get JWT | Public |
| `GET` | `/logout` | Logout (clear JWT cookie) | Public |
| `POST` | `/forgotPassword` | Request password reset | Public |
| `PATCH` | `/resetPassword/:token` | Reset password | Public |
| `GET` | `/me` | Get current user profile | Authenticated |
| `PATCH` | `/updateMe` | Update profile & photo | Authenticated |
| `DELETE` | `/deleteMe` | Deactivate account | Authenticated |
| `PATCH` | `/updateMyPassword` | Change password | Authenticated |
| `GET` | `/` | Get all users | Admin |
| `POST` | `/` | Create user | Admin |
| `GET` | `/:id` | Get user by ID | Admin |
| `PATCH` | `/:id` | Update user | Admin |
| `DELETE` | `/:id` | Delete user | Admin |

### ⭐ Reviews (`/api/v1/reviews`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/` | Get all reviews | Public |
| `POST` | `/` | Create a review | Authenticated (user) |
| `GET` | `/:id` | Get single review | Public |
| `PATCH` | `/:id` | Update review | User/Admin |
| `DELETE` | `/:id` | Delete review | User/Admin |

### 💳 Bookings (`/api/v1/bookings`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| `GET` | `/checkout-session/:tourID` | Get Paymob checkout session | Authenticated |
| `GET` | `/` | Get all bookings | Admin/Lead-guide |
| `POST` | `/` | Create a booking | Admin/Lead-guide |
| `GET` | `/:id` | Get booking | Admin/Lead-guide |
| `PATCH` | `/:id` | Update booking | Admin/Lead-guide |
| `DELETE` | `/:id` | Delete booking | Admin/Lead-guide |

### 🌐 Server-Rendered Pages (`/`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Tour overview page |
| `GET` | `/tour/:slug` | Individual tour page |
| `GET` | `/login` | Login page |
| `GET` | `/signup` | Signup page |
| `GET` | `/me` | Account settings page |
| `GET` | `/my-tours` | My bookings page |

---

## 🔐 Authentication & Authorization

The project implements a **multi-layer security** authentication system:

1. **JWT-based Sessions** — Token stored in HTTP-only cookie for secure transmission
2. **Route Protection** — `protect` middleware verifies JWT and grants access
3. **Role-Based Access** — `restrictTo('admin', 'lead-guide')` limits endpoints by role
4. **Password Security** — bcryptjs hashing (cost factor 12), password confirmation validation
5. **Password Changed Detection** — JWT invalidated if password is changed after token issuance
6. **Password Reset** — Secure token-based reset with SHA-256 hashing and 10-minute expiry
7. **Soft Delete** — Users are soft-deactivated (`active: false`) rather than permanently removed
8. **Active User Filter** — All queries automatically exclude deactivated users

---

## 💳 Payment Integration

The **Paymob** payment gateway is integrated for checkout:

- User requests a checkout session → backend creates a Paymob payment intention
- Amount is converted to **EGP** (Egyptian Pounds) and processed in **piastres**
- User is redirected to the Paymob checkout page
- After payment, user is redirected back to the tour page
- A booking record is created server-side

> **Note:** A temporary "booking checkout" endpoint (`createBookingCheckout`) allows testing without actual payment by passing query parameters.

---

## 📧 Email System

The `Email` class in `utils/email.js` provides a complete email notification system:

- **Welcome Email** — Sent after user signup with a link to upload profile photo
- **Password Reset Email** — Sent when user requests password reset with secure reset link
- **Template Engine** — Pug templates rendered to HTML, converted to plain text via `html-to-text`
- **Transport Layers** — Mailtrap for development, Brevo (formerly Sendinblue) for production

---

## 📊 Database & Data Modeling

### Tour Schema
- Name, duration, max group size, difficulty, price, price discount
- GeoJSON `startLocation` and `locations` for mapping
- Image cover + gallery, ratings with auto-calculated averages
- Virtual `durationWeeks` and virtual population of reviews
- Compound index on `{price: 1, ratingsAverage: -1}` and `{slug: 1}` and `{startLocation: "2dsphere"}`

### User Schema
- Name, email (validated), role (user/guide/lead-guide/admin)
- Photo, password (bcrypt hashed), passwordChangedAt
- Password reset token & expiry, active status
- Method: `correctPassword()`, `changedPasswordAfter()`, `createPasswordResetToken()`

### Review Schema
- Text review, rating (1-5), references to Tour and User
- Unique compound index on `{user: 1, tour: 1}` to prevent duplicates
- Static method: `calcAverageRating()` via aggregation pipeline
- Auto-calculates tour average ratings on save/update/delete

### Booking Schema
- References to Tour and User, price, paid status, creation date
- Auto-populates user and tour name on queries

---

## 🛡️ Security Features

| Feature | Implementation |
|---------|---------------|
| **Helmet.js** | Security HTTP headers with strict CSP directives |
| **CORS** | Cross-origin resource sharing configured |
| **XSS Prevention** | Deep recursive HTML sanitization on all request inputs |
| **NoSQL Injection** | `express-mongo-sanitize` strips `$` and `.` from fields |
| **HTTP Parameter Pollution** | `hpp` whitelists allowed query parameters |
| **Rate Limiting** | 100 requests/hour per IP on all `/api` routes |
| **Compression** | Gzip compression via `compression` middleware |
| **Cookie Security** | HTTP-only cookies, secure flag in production |
| **JWT Security** | Token verification, expiration check, password change invalidation |
| **MongoDB Sanitization** | Query parameter sanitization |

---

## 🎨 Key Design Patterns

### 1. Handler Factory Pattern
The `handlerFactory.js` provides reusable CRUD functions (`createOne`, `getOne`, `getAll`, `updateOne`, `deleteOne`) that accept a Mongoose model and return a controller function, eliminating repetitive boilerplate code.

### 2. API Features Query Builder
The `APIFeatures` class enables a chainable query builder pattern:
```js
new APIFeatures(Model.find(filter), req.query)
  .filter()    // Remove excluded fields, convert gte/gt/lte/lt
  .sort()      // Sort by query parameter or default
  .limitFields() // Select specific fields
  .paginate();  // Skip & limit for pagination
```

### 3. Middleware Architecture
- **Pre-save**: Auto-generate slug, hash password, set `passwordChangedAt`
- **Pre-find**: Automatically filter out secret tours and soft-deleted users, populate guides
- **Post-save**: Recalculate tour average ratings
- **Aggregation**: MongoDB pipelines for statistics and monthly planning

### 4. MVC Pattern
- **Models**: Mongoose schemas with validation, middleware, and virtuals
- **Views**: Pug templates with layouts, mixins, and partials
- **Controllers**: Route handlers delegating to services and models

### 5. ES Modules throughout
The entire project uses modern ES module syntax (`import`/`export`) with `"type": "module"` in package.json.

---

## 🎯 Notable Techniques & Learning Points

- **Sharp image processing** — Dynamic image resizing and format conversion on upload
- **GeoJSON & MongoDB** — `$geoWithin`, `$centerSphere`, and `$geoNear` for location-based queries
- **Mongoose Virtuals** — `durationWeeks` computed property and virtual review population
- **Aggregation Pipeline** — Complex data analysis for stats and monthly plans
- **Leaflet.js Maps** — Interactive map rendering with custom markers and popups
- **Dark Mode Toggle** — CSS class toggling with localStorage persistence
- **Responsive Email Templates** — HTML email with inline CSS and media queries
- **Custom Error Handling** — Operational vs programmer errors with different dev/prod responses
- **Cookie-based JWT** — Secure authentication without localStorage
- **esbuild Bundling** — Fast production JavaScript bundling with watch mode

---

## 📝 License

This project is licensed under the [ISC License](LICENSE).

---

## 👤 Author

**Peter Refaat** — [GitHub Profile](https://github.com/Peter-Refaat)

> Based on the course by [Jonas Schmedtmann](https://www.udemy.com/user/jonasschmedtmann/?kw=jonas&src=sac) — "
Node.js, Express, MongoDB & More: The Complete Bootcamp"

