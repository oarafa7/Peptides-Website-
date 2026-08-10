import { PrismaClient, Role, ProductStatus, DiscountType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Recovery & Repair",
    slug: "recovery-repair",
    description: "Formulated for post-training recovery and tissue support research.",
  },
  {
    name: "Longevity",
    slug: "longevity",
    description: "Research compounds studied for cellular aging and longevity.",
  },
  {
    name: "Metabolic",
    slug: "metabolic",
    description: "Compounds researched for metabolic and body-composition studies.",
  },
  {
    name: "Cognitive",
    slug: "cognitive",
    description: "Nootropic-adjacent peptides studied for cognitive support.",
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Bac water, syringes, vials, and lab accessories.",
  },
];

const products = [
  {
    title: "BPC-157 Research Blend",
    slug: "bpc-157-research-blend",
    description:
      "A high-purity BPC-157 lyophilized peptide blend, third-party tested to >99% purity via HPLC. Supplied for laboratory research use only.",
    priceCents: 5900,
    compareAtCents: 7200,
    categorySlug: "recovery-repair",
    tags: ["bestseller", "recovery"],
    isFeatured: true,
    materials: "Lyophilized peptide powder, sealed glass vial.",
    variants: [
      { name: "5mg", option1Name: "Size", option1Value: "5mg", priceCents: 5900, stockQuantity: 42 },
      { name: "10mg", option1Name: "Size", option1Value: "10mg", priceCents: 9900, stockQuantity: 30 },
    ],
  },
  {
    title: "TB-500 Research Vial",
    slug: "tb-500-research-vial",
    description:
      "TB-500 fragment, produced under strict quality control and verified for identity and purity. For research and laboratory use only.",
    priceCents: 6900,
    compareAtCents: null,
    categorySlug: "recovery-repair",
    tags: ["recovery"],
    isFeatured: false,
    materials: "Lyophilized peptide powder, sealed glass vial.",
    variants: [
      { name: "5mg", option1Name: "Size", option1Value: "5mg", priceCents: 6900, stockQuantity: 25 },
      { name: "10mg", option1Name: "Size", option1Value: "10mg", priceCents: 11900, stockQuantity: 18 },
    ],
  },
  {
    title: "Epithalon Longevity Vial",
    slug: "epithalon-longevity-vial",
    description:
      "Epithalon (Epitalon) tetrapeptide, researched extensively for its role in telomerase activity studies. HPLC verified.",
    priceCents: 4900,
    compareAtCents: 5900,
    categorySlug: "longevity",
    tags: ["longevity", "new"],
    isFeatured: true,
    materials: "Lyophilized peptide powder, sealed glass vial.",
    variants: [
      { name: "10mg", option1Name: "Size", option1Value: "10mg", priceCents: 4900, stockQuantity: 50 },
    ],
  },
  {
    title: "NAD+ Research Compound",
    slug: "nad-research-compound",
    description:
      "Nicotinamide adenine dinucleotide, supplied for laboratory cellular metabolism research. Cold-chain shipped.",
    priceCents: 8900,
    compareAtCents: null,
    categorySlug: "longevity",
    tags: ["longevity"],
    isFeatured: false,
    materials: "Lyophilized powder, amber glass vial.",
    variants: [
      { name: "500mg", option1Name: "Size", option1Value: "500mg", priceCents: 8900, stockQuantity: 20 },
    ],
  },
  {
    title: "AOD-9604 Research Blend",
    slug: "aod-9604-research-blend",
    description:
      "A modified fragment of human growth hormone studied in metabolic and body composition research contexts.",
    priceCents: 6500,
    compareAtCents: 7500,
    categorySlug: "metabolic",
    tags: ["metabolic", "bestseller"],
    isFeatured: true,
    materials: "Lyophilized peptide powder, sealed glass vial.",
    variants: [
      { name: "5mg", option1Name: "Size", option1Value: "5mg", priceCents: 6500, stockQuantity: 33 },
    ],
  },
  {
    title: "Tesamorelin Research Vial",
    slug: "tesamorelin-research-vial",
    description:
      "Growth-hormone releasing factor analog researched in visceral fat and metabolic studies. Third-party tested.",
    priceCents: 8900,
    compareAtCents: null,
    categorySlug: "metabolic",
    tags: ["metabolic"],
    isFeatured: false,
    materials: "Lyophilized peptide powder, sealed glass vial.",
    variants: [
      { name: "10mg", option1Name: "Size", option1Value: "10mg", priceCents: 8900, stockQuantity: 15 },
    ],
  },
  {
    title: "Semax Research Nasal Blend",
    slug: "semax-research-blend",
    description:
      "Semax heptapeptide studied for cognitive and neurotrophic research applications. Supplied for laboratory use.",
    priceCents: 5400,
    compareAtCents: null,
    categorySlug: "cognitive",
    tags: ["cognitive", "new"],
    isFeatured: false,
    materials: "Lyophilized peptide powder, sealed glass vial.",
    variants: [
      { name: "10mg", option1Name: "Size", option1Value: "10mg", priceCents: 5400, stockQuantity: 40 },
    ],
  },
  {
    title: "Selank Research Vial",
    slug: "selank-research-vial",
    description:
      "Synthetic heptapeptide analog of tuftsin, researched for anxiolytic and cognitive study applications.",
    priceCents: 5400,
    compareAtCents: 6200,
    categorySlug: "cognitive",
    tags: ["cognitive"],
    isFeatured: false,
    materials: "Lyophilized peptide powder, sealed glass vial.",
    variants: [
      { name: "10mg", option1Name: "Size", option1Value: "10mg", priceCents: 5400, stockQuantity: 27 },
    ],
  },
  {
    title: "Bacteriostatic Water 30mL",
    slug: "bacteriostatic-water-30ml",
    description:
      "USP-grade bacteriostatic water for laboratory reconstitution use. Sterile, multi-dose vial.",
    priceCents: 1200,
    compareAtCents: null,
    categorySlug: "accessories",
    tags: ["accessory"],
    isFeatured: false,
    materials: "Sterile water with 0.9% benzyl alcohol.",
    variants: [
      { name: "30mL", option1Name: "Size", option1Value: "30mL", priceCents: 1200, stockQuantity: 200 },
    ],
  },
  {
    title: "Insulin Syringes (100ct)",
    slug: "insulin-syringes-100ct",
    description:
      "1mL 29G insulin syringes for precise laboratory reconstitution and measurement. Box of 100, individually wrapped.",
    priceCents: 1800,
    compareAtCents: null,
    categorySlug: "accessories",
    tags: ["accessory", "bestseller"],
    isFeatured: false,
    materials: "Medical-grade plastic, stainless steel needle.",
    variants: [
      { name: "100 count", option1Name: "Pack", option1Value: "100ct", priceCents: 1800, stockQuantity: 150 },
    ],
  },
];

const productImages: Record<string, string[]> = {
  "bpc-157-research-blend": [
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&q=80",
  ],
  "tb-500-research-vial": [
    "https://images.unsplash.com/photo-1580281657702-257584239a55?w=1200&q=80",
  ],
  "epithalon-longevity-vial": [
    "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=1200&q=80",
  ],
  "nad-research-compound": [
    "https://images.unsplash.com/photo-1576671081837-49000212a370?w=1200&q=80",
  ],
  "aod-9604-research-blend": [
    "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=1200&q=80",
  ],
  "tesamorelin-research-vial": [
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=1200&q=80",
  ],
  "semax-research-blend": [
    "https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=1200&q=80",
  ],
  "selank-research-vial": [
    "https://images.unsplash.com/photo-1580281657702-257584239a55?w=1200&q=80",
  ],
  "bacteriostatic-water-30ml": [
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=1200&q=80",
  ],
  "insulin-syringes-100ct": [
    "https://images.unsplash.com/photo-1576671081837-49000212a370?w=1200&q=80",
  ],
};

async function main() {
  console.log("Seeding categories...");
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  console.log("Seeding products...");
  for (const p of products) {
    const category = await prisma.category.findUnique({ where: { slug: p.categorySlug } });
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        title: p.title,
        slug: p.slug,
        description: p.description,
        status: ProductStatus.ACTIVE,
        priceCents: p.priceCents,
        compareAtCents: p.compareAtCents ?? undefined,
        tags: p.tags,
        isFeatured: p.isFeatured,
        materials: p.materials,
        shippingReturns:
          "Ships within 1-2 business days via cold-chain courier. For laboratory research use only — not for human consumption. Returns accepted on unopened, sealed vials within 30 days.",
        stockQuantity: p.variants.reduce((sum, v) => sum + v.stockQuantity, 0),
        categoryId: category?.id,
      },
    });

    const images = productImages[p.slug] ?? [];
    await prisma.productImage.deleteMany({ where: { productId: product.id } });
    for (const [i, url] of images.entries()) {
      await prisma.productImage.create({
        data: { productId: product.id, url, position: i, altText: p.title },
      });
    }

    for (const v of p.variants) {
      await prisma.variant.upsert({
        where: { sku: `${p.slug}-${v.option1Value}`.toUpperCase() },
        update: {},
        create: {
          productId: product.id,
          name: v.name,
          sku: `${p.slug}-${v.option1Value}`.toUpperCase(),
          option1Name: v.option1Name,
          option1Value: v.option1Value,
          priceCents: v.priceCents,
          stockQuantity: v.stockQuantity,
        },
      });
    }

    await prisma.review.deleteMany({ where: { productId: product.id } });
    await prisma.review.createMany({
      data: [
        {
          productId: product.id,
          authorName: "Jordan M.",
          rating: 5,
          title: "Exactly as described",
          body: "Purity certificate matched the batch, packaging was cold and secure on arrival.",
        },
        {
          productId: product.id,
          authorName: "Casey R.",
          rating: 4,
          title: "Solid vendor",
          body: "Fast shipping and good communication. Will reorder for the next research cycle.",
        },
      ],
    });
  }

  console.log("Seeding coupons...");
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      type: DiscountType.PERCENTAGE,
      value: 10,
      usageLimit: 500,
      isActive: true,
    },
  });
  await prisma.coupon.upsert({
    where: { code: "FREESHIP" },
    update: {},
    create: {
      code: "FREESHIP",
      type: DiscountType.FREE_SHIPPING,
      value: 0,
      minSubtotalCents: 10000,
      isActive: true,
    },
  });

  console.log("Seeding admin + demo customer...");
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@peptidelab.test" },
    update: {},
    create: {
      name: "Store Admin",
      email: "admin@peptidelab.test",
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const customerPassword = await bcrypt.hash("Customer123!", 10);
  await prisma.user.upsert({
    where: { email: "customer@peptidelab.test" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@peptidelab.test",
      passwordHash: customerPassword,
      role: Role.CUSTOMER,
    },
  });

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
