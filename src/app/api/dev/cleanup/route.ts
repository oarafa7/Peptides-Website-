// TEMPORARY one-shot maintenance endpoint. Delete this file after use.
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SECRET = "YnugQBDpB_nIJNzs85c8AqVI7gjFyBCIVO8ws26GrqM";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  if (url.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const before = await prisma.category.findMany({
    select: { id: true, slug: true, name: true, _count: { select: { products: true } } },
    orderBy: { slug: "asc" },
  });

  // Delete categories with zero products, only if slug matches whitelist
  const targetSlugs = ["cognitive", "accessories"];
  const deleted = [] as { slug: string; id: string; hadProducts: number }[];
  for (const c of before) {
    if (!targetSlugs.includes(c.slug)) continue;
    if (c._count.products !== 0) continue; // never delete if products exist
    await prisma.category.delete({ where: { id: c.id } });
    deleted.push({ slug: c.slug, id: c.id, hadProducts: c._count.products });
  }

  const after = await prisma.category.findMany({
    select: { slug: true, name: true, _count: { select: { products: true } } },
    orderBy: { slug: "asc" },
  });

  return NextResponse.json({ deleted, before, after });
}
