import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("ids");
  if (!idsParam) return NextResponse.json({ products: [] });

  const ids = idsParam.split(",").filter(Boolean);
  const products = await prisma.product.findMany({
    where: { id: { in: ids } },
    include: { images: { orderBy: { position: "asc" } }, variants: true, category: true },
  });

  return NextResponse.json({ products });
}
