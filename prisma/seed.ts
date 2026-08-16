import { PrismaClient, Role, ProductStatus, DiscountType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Protein & Mass",
    nameAr: "البروتين وزيادة الكتلة",
    slug: "protein-mass",
    description: "Whey isolates and mass gainers to fuel muscle growth and recovery.",
    descriptionAr: "بروتين مصل اللبن المعزول ومكملات زيادة الكتلة لدعم نمو العضلات والتعافي.",
  },
  {
    name: "Pre-Workout & Energy",
    nameAr: "ما قبل التمرين والطاقة",
    slug: "pre-workout-energy",
    description: "Explosive energy, sharp focus, and better pumps for your best training sessions.",
    descriptionAr: "طاقة انفجارية وتركيز عالٍ وضخ عضلي أفضل لأفضل جلسات تدريبك.",
  },
  {
    name: "Vitamins & Wellness",
    nameAr: "الفيتامينات والعافية",
    slug: "vitamins-wellness",
    description: "Everyday essentials to support immunity, energy, and overall health.",
    descriptionAr: "أساسيات يومية لدعم المناعة والطاقة والصحة العامة.",
  },
  {
    name: "Weight Management",
    nameAr: "إدارة الوزن",
    slug: "weight-management",
    description: "Science-backed formulas to support your fat-loss and metabolism goals.",
    descriptionAr: "تركيبات مدعومة علميًا لدعم أهدافك في حرق الدهون وتحسين الأيض.",
  },
  {
    name: "Accessories",
    nameAr: "الملحقات",
    slug: "accessories",
    description: "Gear and essentials that make every workout easier.",
    descriptionAr: "معدات وأساسيات تجعل كل تمرين أسهل.",
  },
];

const products = [
  {
    title: "Gold Whey Protein Isolate",
    titleAr: "بروتين مصل اللبن المعزول الذهبي",
    slug: "gold-whey-protein-isolate",
    description:
      "25g of fast-absorbing whey protein isolate per scoop, with minimal fat and sugar. Perfect for post-workout recovery or any time you need a clean protein boost.",
    descriptionAr:
      "25 جرامًا من بروتين مصل اللبن المعزول سريع الامتصاص في كل مغرفة، بأقل نسبة من الدهون والسكر. مثالي للتعافي بعد التمرين أو في أي وقت تحتاج فيه إلى جرعة بروتين نظيفة.",
    priceCents: 220000,
    compareAtCents: 280000,
    categorySlug: "protein-mass",
    tags: ["bestseller", "protein"],
    isFeatured: true,
    materials: "Whey protein isolate, natural and artificial flavors, sunflower lecithin, stevia leaf extract.",
    materialsAr: "بروتين مصل اللبن المعزول، نكهات طبيعية واصطناعية، ليسيثين دوار الشمس، مستخلص أوراق الستيفيا.",
    variants: [
      { name: "Chocolate", option1Name: "Flavor", option1Value: "Chocolate", priceCents: 220000, stockQuantity: 60 },
      { name: "Vanilla", option1Name: "Flavor", option1Value: "Vanilla", priceCents: 220000, stockQuantity: 45 },
    ],
  },
  {
    title: "Elite Mass Gainer",
    titleAr: "إيليت لزيادة الكتلة",
    slug: "elite-mass-gainer",
    description:
      "1,250 calories and 50g of protein per serving, blended with complex carbs to help hardgainers pack on size between meals.",
    descriptionAr:
      "1250 سعرة حرارية و50 جرامًا من البروتين في كل حصة، ممزوجة بكربوهيدرات معقدة لمساعدة من يصعب عليهم زيادة وزنهم على اكتساب الكتلة بين الوجبات.",
    priceCents: 280000,
    compareAtCents: null,
    categorySlug: "protein-mass",
    tags: ["mass"],
    isFeatured: false,
    materials: "Whey protein concentrate, maltodextrin, oat flour, MCT oil.",
    materialsAr: "بروتين مصل اللبن المركز، مالتوديكسترين، دقيق الشوفان، زيت MCT.",
    variants: [
      { name: "Chocolate", option1Name: "Flavor", option1Value: "Chocolate", priceCents: 280000, stockQuantity: 30 },
      { name: "Vanilla", option1Name: "Flavor", option1Value: "Vanilla", priceCents: 280000, stockQuantity: 20 },
    ],
  },
  {
    title: "Nitro Pump Pre-Workout",
    titleAr: "نيترو بمب ما قبل التمرين",
    slug: "nitro-pump-pre-workout",
    description:
      "A potent blend of caffeine, beta-alanine, and citrulline malate to sharpen focus and drive explosive pumps through your toughest sets.",
    descriptionAr:
      "مزيج قوي من الكافيين وبيتا ألانين وسيترولين مالات لتعزيز التركيز ودفع ضخ عضلي انفجاري خلال أصعب مجموعاتك التدريبية.",
    priceCents: 140000,
    compareAtCents: 160000,
    categorySlug: "pre-workout-energy",
    tags: ["bestseller", "energy"],
    isFeatured: true,
    materials: "Citrulline malate, beta-alanine, caffeine anhydrous, L-tyrosine.",
    materialsAr: "سيترولين مالات، بيتا ألانين، كافيين لا مائي، إل-تيروزين.",
    variants: [
      { name: "Blue Raspberry", option1Name: "Flavor", option1Value: "Blue Raspberry", priceCents: 140000, stockQuantity: 50 },
      { name: "Watermelon", option1Name: "Flavor", option1Value: "Watermelon", priceCents: 140000, stockQuantity: 40 },
    ],
  },
  {
    title: "Micronized Creatine Monohydrate",
    titleAr: "كرياتين مونوهيدرات مطحون دقيقًا",
    slug: "micronized-creatine-monohydrate",
    description:
      "Pure micronized creatine monohydrate for strength, power, and lean muscle gains. Unflavored and easy to mix into any drink.",
    descriptionAr:
      "كرياتين مونوهيدرات نقي ومطحون دقيقًا لزيادة القوة والطاقة واكتساب العضلات الخالية من الدهون. بدون نكهة وسهل المزج مع أي مشروب.",
    priceCents: 65000,
    compareAtCents: null,
    categorySlug: "pre-workout-energy",
    tags: ["bestseller"],
    isFeatured: true,
    materials: "100% micronized creatine monohydrate.",
    materialsAr: "كرياتين مونوهيدرات مطحون دقيقًا 100%.",
    variants: [
      { name: "300g", option1Name: "Size", option1Value: "300g", priceCents: 65000, stockQuantity: 70 },
      { name: "600g", option1Name: "Size", option1Value: "600g", priceCents: 110000, stockQuantity: 35 },
    ],
  },
  {
    title: "Daily Complete Multivitamin",
    titleAr: "الفيتامينات المتعددة اليومية الكاملة",
    slug: "daily-complete-multivitamin",
    description:
      "A full spectrum of essential vitamins and minerals to support energy, immunity, and everyday performance.",
    descriptionAr:
      "مجموعة كاملة من الفيتامينات والمعادن الأساسية لدعم الطاقة والمناعة والأداء اليومي.",
    priceCents: 45000,
    compareAtCents: null,
    categorySlug: "vitamins-wellness",
    tags: ["wellness"],
    isFeatured: false,
    materials: "Vitamins A, C, D3, E, B-complex, zinc, magnesium, selenium.",
    materialsAr: "فيتامينات A وC وD3 وE ومركب B، الزنك، المغنيسيوم، السيلينيوم.",
    variants: [
      { name: "60 Tablets", option1Name: "Count", option1Value: "60ct", priceCents: 45000, stockQuantity: 90 },
      { name: "120 Tablets", option1Name: "Count", option1Value: "120ct", priceCents: 80000, stockQuantity: 60 },
    ],
  },
  {
    title: "Omega-3 Fish Oil",
    titleAr: "زيت السمك أوميغا 3",
    slug: "omega-3-fish-oil",
    description:
      "Molecularly distilled fish oil delivering 1,000mg of EPA and DHA per softgel to support heart, joint, and brain health.",
    descriptionAr:
      "زيت سمك مقطر جزيئيًا يوفر 1000 ملغ من EPA وDHA في كل كبسولة لدعم صحة القلب والمفاصل والدماغ.",
    priceCents: 40000,
    compareAtCents: 50000,
    categorySlug: "vitamins-wellness",
    tags: ["wellness"],
    isFeatured: false,
    materials: "Fish oil concentrate (anchovy, sardine), gelatin softgel, vitamin E.",
    materialsAr: "مركز زيت السمك (الأنشوجة والسردين)، كبسولة جيلاتينية، فيتامين E.",
    variants: [
      { name: "90 Softgels", option1Name: "Count", option1Value: "90ct", priceCents: 40000, stockQuantity: 80 },
    ],
  },
  {
    title: "Thermo Burn Fat Burner",
    titleAr: "ثيرمو بيرن لحرق الدهون",
    slug: "thermo-burn-fat-burner",
    description:
      "A thermogenic formula with green tea extract and caffeine to support metabolism and energy while you work toward your goals.",
    descriptionAr:
      "تركيبة حرارية تحتوي على مستخلص الشاي الأخضر والكافيين لدعم الأيض والطاقة أثناء سعيك نحو أهدافك.",
    priceCents: 90000,
    compareAtCents: 105000,
    categorySlug: "weight-management",
    tags: ["weight"],
    isFeatured: true,
    materials: "Green tea extract, caffeine anhydrous, L-carnitine, chromium picolinate.",
    materialsAr: "مستخلص الشاي الأخضر، كافيين لا مائي، إل-كارنيتين، بيكولينات الكروم.",
    variants: [
      { name: "60 Capsules", option1Name: "Count", option1Value: "60ct", priceCents: 90000, stockQuantity: 55 },
    ],
  },
  {
    title: "L-Carnitine 1500 Liquid",
    titleAr: "إل-كارنيتين 1500 سائل",
    slug: "l-carnitine-1500-liquid",
    description:
      "Fast-absorbing liquid L-Carnitine to help convert fat into usable energy during training.",
    descriptionAr:
      "إل-كارنيتين سائل سريع الامتصاص يساعد على تحويل الدهون إلى طاقة قابلة للاستخدام أثناء التمرين.",
    priceCents: 55000,
    compareAtCents: null,
    categorySlug: "weight-management",
    tags: ["weight"],
    isFeatured: false,
    materials: "L-Carnitine tartrate, purified water, natural citrus flavor.",
    materialsAr: "إل-كارنيتين تارترات، ماء نقي، نكهة حمضيات طبيعية.",
    variants: [
      { name: "16 fl oz", option1Name: "Size", option1Value: "16 fl oz", priceCents: 55000, stockQuantity: 40 },
    ],
  },
  {
    title: "Pro Shaker Bottle",
    titleAr: "خلاط برو",
    slug: "pro-shaker-bottle",
    description:
      "A 24oz leak-proof shaker with a stainless steel mixing ball for perfectly smooth shakes on the go.",
    descriptionAr:
      "خلاط سعة 24 أونصة مقاوم للتسرب مزود بكرة خلط من الفولاذ المقاوم للصدأ لخلطات ناعمة تمامًا أثناء التنقل.",
    priceCents: 25000,
    compareAtCents: null,
    categorySlug: "accessories",
    tags: ["accessory"],
    isFeatured: false,
    materials: "BPA-free plastic, stainless steel mixing ball.",
    materialsAr: "بلاستيك خالٍ من BPA، كرة خلط من الفولاذ المقاوم للصدأ.",
    variants: [
      { name: "Black", option1Name: "Color", option1Value: "Black", priceCents: 25000, stockQuantity: 100 },
      { name: "White", option1Name: "Color", option1Value: "White", priceCents: 25000, stockQuantity: 80 },
    ],
  },
  {
    title: "Heavy-Duty Lifting Straps",
    titleAr: "أشرطة رفع فائقة التحمل",
    slug: "heavy-duty-lifting-straps",
    description:
      "Cotton-blend lifting straps that lock in your grip so you can push heavier pulls and rows without your hands giving out first.",
    descriptionAr:
      "أشرطة رفع مصنوعة من مزيج القطن تثبّت قبضتك لتتمكن من دفع أوزان أثقل في تمارين السحب والتجديف دون أن تخذلك يداك أولاً.",
    priceCents: 35000,
    compareAtCents: 45000,
    categorySlug: "accessories",
    tags: ["accessory", "bestseller"],
    isFeatured: false,
    materials: "Cotton-polyester webbing, neoprene wrist padding.",
    materialsAr: "شريط منسوج من القطن والبوليستر، وسادة معصم من النيوبرين.",
    variants: [
      { name: "Black", option1Name: "Color", option1Value: "Black", priceCents: 35000, stockQuantity: 65 },
    ],
  },
];

const SHIPPING_RETURNS_EN =
  "Orders ship within 1-2 business days via tracked courier across Egypt. Pay by InstaPay or cash on delivery. Unopened items in their original packaging can be returned within 30 days for a full refund.";
const SHIPPING_RETURNS_AR =
  "تُشحن الطلبات خلال يوم إلى يومي عمل عبر شركة شحن يمكن تتبعها داخل جمهورية مصر العربية. ادفع عبر إنستاباي أو نقدًا عند الاستلام. يمكن إرجاع المنتجات غير المفتوحة وبعبوتها الأصلية خلال 30 يومًا لاسترداد كامل المبلغ.";

const productImages: Record<string, string[]> = {
  "gold-whey-protein-isolate": [
    "https://images.unsplash.com/photo-1693996045899-7cf0ac0229c7?w=1200&q=80",
  ],
  "elite-mass-gainer": [
    "https://images.unsplash.com/photo-1680265158261-5fd6ba5d9959?w=1200&q=80",
  ],
  "nitro-pump-pre-workout": [
    "https://images.unsplash.com/photo-1704650311974-8ce378f0e8b0?w=1200&q=80",
  ],
  "micronized-creatine-monohydrate": [
    "https://images.unsplash.com/photo-1724160167630-a33086ddb552?w=1200&q=80",
  ],
  "daily-complete-multivitamin": [
    "https://images.unsplash.com/photo-1697273245326-1a3736f6f428?w=1200&q=80",
  ],
  "omega-3-fish-oil": [
    "https://images.unsplash.com/photo-1670850756917-8ed6c2a71e12?w=1200&q=80",
  ],
  "thermo-burn-fat-burner": [
    "https://images.unsplash.com/photo-1584362917165-526a968579e8?w=1200&q=80",
  ],
  "l-carnitine-1500-liquid": [
    "https://images.unsplash.com/photo-1633423411797-9a7317784d2b?w=1200&q=80",
  ],
  "pro-shaker-bottle": [
    "https://images.unsplash.com/photo-1775199603318-7f8a9a63b40d?w=1200&q=80",
  ],
  "heavy-duty-lifting-straps": [
    "https://images.unsplash.com/photo-1582852567809-a25c21a13ee6?w=1200&q=80",
  ],
};

const OLD_PRODUCT_SLUGS = [
  "bpc-157-research-blend",
  "tb-500-research-vial",
  "epithalon-longevity-vial",
  "nad-research-compound",
  "aod-9604-research-blend",
  "tesamorelin-research-vial",
  "semax-research-blend",
  "selank-research-vial",
  "bacteriostatic-water-30ml",
  "insulin-syringes-100ct",
];
const OLD_CATEGORY_SLUGS = ["recovery-repair", "longevity", "metabolic", "cognitive"];

async function main() {
  console.log("Removing legacy peptide-research catalog...");
  const oldProducts = await prisma.product.findMany({
    where: { slug: { in: OLD_PRODUCT_SLUGS } },
    select: { id: true },
  });
  const oldProductIds = oldProducts.map((p) => p.id);
  if (oldProductIds.length) {
    await prisma.review.deleteMany({ where: { productId: { in: oldProductIds } } });
    await prisma.productImage.deleteMany({ where: { productId: { in: oldProductIds } } });
    await prisma.variant.deleteMany({ where: { productId: { in: oldProductIds } } });
    await prisma.product.deleteMany({ where: { id: { in: oldProductIds } } });
  }
  await prisma.category.deleteMany({ where: { slug: { in: OLD_CATEGORY_SLUGS } } });

  console.log("Seeding categories...");
  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, nameAr: c.nameAr, description: c.description, descriptionAr: c.descriptionAr },
      create: c,
    });
  }

  console.log("Seeding products...");
  for (const p of products) {
    const category = await prisma.category.findUnique({ where: { slug: p.categorySlug } });
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        titleAr: p.titleAr,
        description: p.description,
        descriptionAr: p.descriptionAr,
        priceCents: p.priceCents,
        compareAtCents: p.compareAtCents ?? null,
        tags: p.tags,
        isFeatured: p.isFeatured,
        materials: p.materials,
        materialsAr: p.materialsAr,
        shippingReturns: SHIPPING_RETURNS_EN,
        shippingReturnsAr: SHIPPING_RETURNS_AR,
        categoryId: category?.id,
      },
      create: {
        title: p.title,
        titleAr: p.titleAr,
        slug: p.slug,
        description: p.description,
        descriptionAr: p.descriptionAr,
        status: ProductStatus.ACTIVE,
        priceCents: p.priceCents,
        compareAtCents: p.compareAtCents ?? undefined,
        tags: p.tags,
        isFeatured: p.isFeatured,
        materials: p.materials,
        materialsAr: p.materialsAr,
        shippingReturns: SHIPPING_RETURNS_EN,
        shippingReturnsAr: SHIPPING_RETURNS_AR,
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
        update: { priceCents: v.priceCents, stockQuantity: v.stockQuantity },
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
          title: "Great quality, will buy again",
          titleAr: "جودة ممتازة، سأشتري مجددًا",
          body: "Mixes smoothly and I've noticed real results since adding it to my routine. Packaging arrived in perfect condition.",
          bodyAr: "يمتزج بسلاسة ولاحظت نتائج حقيقية منذ أن أضفته إلى روتيني. وصلت العبوة بحالة ممتازة.",
        },
        {
          productId: product.id,
          authorName: "Casey R.",
          rating: 4,
          title: "Solid product, fast shipping",
          titleAr: "منتج ممتاز وشحن سريع",
          body: "Good value for the price and customer service was quick to answer my questions. Will reorder.",
          bodyAr: "قيمة جيدة مقابل السعر وكانت خدمة العملاء سريعة في الرد على أسئلتي. سأطلب مجددًا.",
        },
      ],
    });
  }

  console.log("Seeding coupons...");
  await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: { type: DiscountType.PERCENTAGE, value: 10, usageLimit: 500, isActive: true },
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
    update: { type: DiscountType.FREE_SHIPPING, value: 0, minSubtotalCents: 150000, isActive: true },
    create: {
      code: "FREESHIP",
      type: DiscountType.FREE_SHIPPING,
      value: 0,
      minSubtotalCents: 150000,
      isActive: true,
    },
  });

  console.log("Seeding admin + demo customer...");
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@marwanmohsen.test" },
    update: {},
    create: {
      name: "Store Admin",
      email: "admin@marwanmohsen.test",
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  });

  const ownerAdminPassword = await bcrypt.hash("12345678", 10);
  await prisma.user.upsert({
    where: { email: "admin@marwanmohsen.com" },
    update: { passwordHash: ownerAdminPassword, role: Role.ADMIN },
    create: {
      name: "Marwan Mohsen",
      email: "admin@marwanmohsen.com",
      passwordHash: ownerAdminPassword,
      role: Role.ADMIN,
    },
  });

  const customerPassword = await bcrypt.hash("Customer123!", 10);
  await prisma.user.upsert({
    where: { email: "customer@marwanmohsen.test" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "customer@marwanmohsen.test",
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
