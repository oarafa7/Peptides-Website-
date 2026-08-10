import { NextRequest, NextResponse } from "next/server";

import { getProductsByIds } from "@/lib/data/products";

export async function GET(req: NextRequest) {
  const idsParam = req.nextUrl.searchParams.get("ids");
  const locale = req.nextUrl.searchParams.get("locale") === "ar" ? "ar" : "en";
  if (!idsParam) return NextResponse.json({ products: [] });

  const ids = idsParam.split(",").filter(Boolean);
  const products = await getProductsByIds(ids, locale);

  return NextResponse.json({ products });
}
