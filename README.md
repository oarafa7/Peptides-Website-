# PeptideLab — E-Commerce Storefront

A full-stack e-commerce website built with Next.js 14 (App Router), Prisma/PostgreSQL,
NextAuth, Tailwind CSS + shadcn-style UI, Stripe Checkout, an admin console, and a
bilingual English/Arabic storefront with full RTL support.

Products, pricing, and copy are placeholder demo content for a fictional research-peptide
brand ("PeptideLab") — swap in real inventory before launching.

## Tech Stack

- **Framework:** Next.js 14 (App Router, Server Actions, React Server Components)
- **Database/ORM:** PostgreSQL + Prisma
- **Auth:** NextAuth.js (Credentials provider, JWT sessions, `CUSTOMER`/`ADMIN` roles)
- **i18n:** next-intl — locale-prefixed routing (`/en`, `/ar`), RTL layout, bilingual product data
- **Styling/UI:** Tailwind CSS, shadcn-style Radix UI components, Framer-Motion-ready
- **Payments:** Stripe Checkout + webhooks
- **State:** Zustand (cart, wishlist), Server Actions for all mutations
- **Search:** Fuse.js fuzzy search over the catalog (`/api/search`)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | e.g. `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Random 32-byte secret (`openssl rand -hex 32`) |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | From your Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | From `stripe listen` or your webhook endpoint config |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used for Stripe redirect URLs |
| `CLOUDINARY_*` | Optional — not required; product images upload to local disk by default (see below) |

### 3. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

This creates the schema and seeds:

- 5 categories, 10 demo products (with variants, images, reviews) — each with English
  **and Arabic** title/description/materials/shipping copy
- 2 coupons: `WELCOME10` (10% off) and `FREESHIP` (free shipping over $100)
- An admin account: **admin@peptidelab.test / Admin123!**
- A customer account: **customer@peptidelab.test / Customer123!**

### 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` (redirects to `/en`) for the storefront, or `/ar` for the
Arabic version. `/en/admin` / `/ar/admin` is the admin console (sign in with the admin
account above). A language switcher lives in the storefront header and the admin sidebar.

## Internationalization (English / Arabic)

- Routing is locale-prefixed via [next-intl](https://next-intl.dev): every page lives under
  `src/app/[locale]/...`, e.g. `/en/shop` and `/ar/shop`. The root `/` redirects to the
  default locale (`en`).
- `messages/en.json` and `messages/ar.json` hold every UI string (nav, storefront, auth,
  account, and the full admin console) — both files are validated to have identical key sets.
- `<html dir="rtl">` is set automatically for Arabic, and the layout mirrors correctly:
  the cart drawer slides in from the left, the admin sidebar moves to the right, icons that
  imply direction (arrows, chevrons) flip via Tailwind's `rtl:` variant, and spacing utilities
  use logical properties (`ps-`/`pe-`/`start-`/`end-`) instead of physical `pl-`/`pr-`/`left-`/`right-`.
- Product/category/review content is bilingual: `Product.titleAr`, `descriptionAr`,
  `materialsAr`, `shippingReturnsAr` (and equivalents on `Category`/`Review`) are optional
  columns alongside the English fields. `src/lib/data/products.ts` resolves the right
  language server-side with automatic fallback to English when a translation is missing, so
  components never branch on locale themselves.
- The admin product form has an "Arabic Translation" section (optional fields) so store staff
  can add/edit the Arabic copy per product without touching the database directly.
- To add a third language: add the locale to `src/i18n/routing.ts`, create `messages/<locale>.json`
  with the same keys as `messages/en.json`, and add it to `LOCALE_META` in `src/i18n/config.ts`.

## Stripe Checkout

Checkout uses Stripe Checkout Sessions created on the fly from cart contents (no
pre-created Stripe Products/Prices needed). To test payments locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the printed webhook signing secret into `STRIPE_WEBHOOK_SECRET`. Use Stripe's test
card `4242 4242 4242 4242` with any future expiry/CVC. On `checkout.session.completed`,
the webhook creates the `Order`/`OrderItem` records, decrements stock, and records coupon
redemptions.

**Note:** without real Stripe API keys, the "Checkout" button will fail gracefully with a
toast error (the code path is fully implemented and will work once real `sk_test_...` /
`whsec_...` values are set).

## Product Images

The admin product form supports direct file upload: click the upload button next to an
image row to pick a file (JPEG/PNG/WebP/AVIF/GIF, max 5MB) — it's saved to
`public/uploads/products/` and served statically. You can still paste a hosted image URL
instead (Cloudinary, S3, Unsplash, etc.) in the same row.

**Local disk storage is dev/self-hosted only.** On serverless platforms (Vercel, etc.) the
filesystem is ephemeral/read-only in production, so uploaded files won't persist across
deploys. For production, swap the upload route
(`src/app/api/admin/upload/route.ts`) to upload to Cloudinary or S3 instead (the
`CLOUDINARY_*` env vars are already present in `.env.example` for this) — the response
contract (`{ url: string }`) stays the same, so no other code needs to change.

## Project Structure

```
prisma/schema.prisma          Database schema (User, Product, Variant, Order, Coupon, ...)
prisma/seed.ts                 Demo data seed script (English + Arabic content)
messages/en.json               English UI strings
messages/ar.json               Arabic UI strings (same key set as en.json)
src/i18n/                      next-intl routing, navigation helpers, locale metadata
src/middleware.ts               Combines next-intl locale routing with auth route protection
src/app/[locale]/(storefront)/  Public storefront: home, shop, collections, PDP, cart, account
src/app/[locale]/(auth)/        Login / signup
src/app/[locale]/admin/         Admin console: dashboard, products, orders, coupons
src/app/api/                   NextAuth route, Stripe webhook, search, upload, misc data routes
src/components/ui/             shadcn-style primitives (button, dialog, sheet, table, ...)
src/components/storefront/     Product cards, grids, gallery, add-to-cart, filters, reviews
src/components/admin/          Admin forms and table row actions
src/lib/actions/                Server Actions (auth, checkout, admin CRUD, account)
src/lib/data/                  Read-only Prisma query helpers per domain (locale-aware)
src/lib/store/                 Zustand stores (cart, wishlist)
```

## Known Limitations / Next Steps

- **Payments** need real Stripe keys to complete end-to-end (see above).
- **Image uploads** save to local disk — fine for dev/self-hosted, needs Cloudinary/S3 for
  serverless production deploys (see above).
- **Search** is in-process Fuse.js over the product table — fine at small-to-medium
  catalog size; swap for Algolia/Meilisearch if you need typo-tolerant search at scale.
- **Tax** is not calculated (Stripe Tax is disabled by default in the checkout session).
- **Wishlist** is stored client-side (localStorage) rather than synced to the signed-in
  user's account, even though the `WishlistItem` model exists in the schema for that.
- **Admin console back-office listings** (product/order tables) intentionally show English
  product titles/category names regardless of the admin's chosen UI language, matching
  common back-office convention — only the chrome (labels, buttons, nav) is translated there.
- Variant facet names (e.g. "Size") translate via a small static dictionary in
  `add-to-cart.tsx` rather than a database column — extend that map (or add an `option1NameAr`
  column) if you introduce new facet types.
- Dependency audit flags several `next@14` CVEs whose fixes ship only in the Next.js 16
  major line; upgrading is a deliberate, separate decision outside this build's scope.
