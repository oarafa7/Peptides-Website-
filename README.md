# PeptideLab — E-Commerce Storefront

A full-stack e-commerce website built with Next.js 14 (App Router), Prisma/PostgreSQL,
NextAuth, Tailwind CSS + shadcn-style UI, Stripe Checkout, and an admin console.

Products, pricing, and copy are placeholder demo content for a fictional research-peptide
brand ("PeptideLab") — swap in real inventory before launching.

## Tech Stack

- **Framework:** Next.js 14 (App Router, Server Actions, React Server Components)
- **Database/ORM:** PostgreSQL + Prisma
- **Auth:** NextAuth.js (Credentials provider, JWT sessions, `CUSTOMER`/`ADMIN` roles)
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
| `CLOUDINARY_*` | Optional — not wired up; product images are entered as URLs (see below) |

### 3. Set up the database

```bash
npx prisma migrate dev --name init
npx prisma db seed
```

This creates the schema and seeds:

- 5 categories, 10 demo products (with variants, images, reviews)
- 2 coupons: `WELCOME10` (10% off) and `FREESHIP` (free shipping over $100)
- An admin account: **admin@peptidelab.test / Admin123!**
- A customer account: **customer@peptidelab.test / Customer123!**

### 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000` for the storefront, `/admin` for the admin console
(sign in with the admin account above).

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

There's no image storage service wired up (Cloudinary/S3 env vars are present but unused).
The admin product form accepts direct image URLs instead — paste any publicly hosted image
URL (Cloudinary, S3, Unsplash, etc.). To add real upload support, wire the `CLOUDINARY_*`
env vars into an upload route and swap the URL inputs in
`src/components/admin/product-form.tsx` for an upload widget.

## Project Structure

```
prisma/schema.prisma          Database schema (User, Product, Variant, Order, Coupon, ...)
prisma/seed.ts                 Demo data seed script
src/app/(storefront)/          Public storefront: home, shop, collections, PDP, cart, account
src/app/(auth)/                Login / signup
src/app/admin/                 Admin console: dashboard, products, orders, coupons
src/app/api/                   NextAuth route, Stripe webhook, search, misc data routes
src/components/ui/             shadcn-style primitives (button, dialog, sheet, table, ...)
src/components/storefront/     Product cards, grids, gallery, add-to-cart, filters, reviews
src/components/admin/          Admin forms and table row actions
src/lib/actions/                Server Actions (auth, checkout, admin CRUD, account)
src/lib/data/                  Read-only Prisma query helpers per domain
src/lib/store/                 Zustand stores (cart, wishlist)
```

## Known Limitations / Next Steps

- **Payments** need real Stripe keys to complete end-to-end (see above).
- **Image hosting** is URL-based; no direct upload widget is wired up.
- **Search** is in-process Fuse.js over the product table — fine at small-to-medium
  catalog size; swap for Algolia/Meilisearch if you need typo-tolerant search at scale.
- **Tax** is not calculated (Stripe Tax is disabled by default in the checkout session).
- **Wishlist** is stored client-side (localStorage) rather than synced to the signed-in
  user's account, even though the `WishlistItem` model exists in the schema for that.
- Dependency audit flags several `next@14` CVEs whose fixes ship only in the Next.js 16
  major line; upgrading is a deliberate, separate decision outside this build's scope.
