import { NextRequest, NextResponse } from "next/server";
import Fuse from "fuse.js";

import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";
  const locale = req.nextUrl.searchParams.get("locale") === "ar" ? "ar" : "en";

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const products = await prisma.product.findMany({
    where: { status: ProductStatus.ACTIVE },
    select: {
      id: true,
      title: true,
      titleAr: true,
      slug: true,
      priceCents: true,
      tags: true,
      images: { take: 1, orderBy: { position: "asc" }, select: { url: true } },
    },
    take: 500,
  });

  const localized = products.map((p) => ({
    id: p.id,
    title: locale === "ar" && p.titleAr ? p.titleAr : p.title,
    slug: p.slug,
    priceCents: p.priceCents,
    tags: p.tags,
    images: p.images,
  }));

  const fuse = new Fuse(localized, {
    keys: ["title", "tags"],
    threshold: 0.35,
  });

  const results = fuse
    .search(q)
    .slice(0, 8)
    .map((r) => r.item);

  return NextResponse.json({ results });
}
