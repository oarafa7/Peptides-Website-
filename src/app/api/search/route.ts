import { NextRequest, NextResponse } from "next/server";
import Fuse from "fuse.js";

import { prisma } from "@/lib/prisma";
import { ProductStatus } from "@prisma/client";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (!q) {
    return NextResponse.json({ results: [] });
  }

  const products = await prisma.product.findMany({
    where: { status: ProductStatus.ACTIVE },
    select: {
      id: true,
      title: true,
      slug: true,
      priceCents: true,
      tags: true,
      images: { take: 1, orderBy: { position: "asc" }, select: { url: true } },
    },
    take: 500,
  });

  const fuse = new Fuse(products, {
    keys: ["title", "tags"],
    threshold: 0.35,
  });

  const results = fuse
    .search(q)
    .slice(0, 8)
    .map((r) => r.item);

  return NextResponse.json({ results });
}
