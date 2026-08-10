"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/actions/guard";

const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  option1Name: z.string().optional(),
  option1Value: z.string().optional(),
  priceCents: z.coerce.number().int().nonnegative().optional(),
  stockQuantity: z.coerce.number().int().nonnegative().default(0),
});

const imageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url(),
  altText: z.string().optional(),
});

const productSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  priceCents: z.coerce.number().int().nonnegative(),
  compareAtCents: z.coerce.number().int().nonnegative().optional(),
  categoryId: z.string().optional(),
  tags: z.string().optional(),
  materials: z.string().optional(),
  shippingReturns: z.string().optional(),
  isFeatured: z.coerce.boolean().optional(),
  trackInventory: z.coerce.boolean().optional(),
  stockQuantity: z.coerce.number().int().nonnegative().default(0),
  variants: z.array(variantSchema).default([]),
  images: z.array(imageSchema).default([]),
});

export type ProductFormInput = z.infer<typeof productSchema>;

export async function upsertProduct(productId: string | null, input: ProductFormInput) {
  await requireAdmin();
  const parsed = productSchema.parse(input);

  const slugBase = slugify(parsed.title);
  const tags = parsed.tags
    ? parsed.tags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [];

  const stockQuantity = parsed.variants.length
    ? parsed.variants.reduce((sum, v) => sum + v.stockQuantity, 0)
    : parsed.stockQuantity;

  const data = {
    title: parsed.title,
    description: parsed.description,
    status: parsed.status,
    priceCents: parsed.priceCents,
    compareAtCents: parsed.compareAtCents || null,
    categoryId: parsed.categoryId || null,
    tags,
    materials: parsed.materials || null,
    shippingReturns: parsed.shippingReturns || null,
    isFeatured: !!parsed.isFeatured,
    trackInventory: parsed.trackInventory ?? true,
    stockQuantity,
  };

  let product;
  if (productId) {
    product = await prisma.product.update({ where: { id: productId }, data });

    await prisma.variant.deleteMany({
      where: { productId, id: { notIn: parsed.variants.filter((v) => v.id).map((v) => v.id!) } },
    });
    await prisma.productImage.deleteMany({
      where: { productId, id: { notIn: parsed.images.filter((i) => i.id).map((i) => i.id!) } },
    });
  } else {
    let slug = slugBase;
    let suffix = 1;
    while (await prisma.product.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${suffix++}`;
    }
    product = await prisma.product.create({ data: { ...data, slug } });
  }

  for (const variant of parsed.variants) {
    if (variant.id) {
      await prisma.variant.update({
        where: { id: variant.id },
        data: {
          name: variant.name,
          option1Name: variant.option1Name || null,
          option1Value: variant.option1Value || null,
          priceCents: variant.priceCents ?? null,
          stockQuantity: variant.stockQuantity,
        },
      });
    } else {
      await prisma.variant.create({
        data: {
          productId: product.id,
          name: variant.name,
          option1Name: variant.option1Name || null,
          option1Value: variant.option1Value || null,
          priceCents: variant.priceCents ?? null,
          stockQuantity: variant.stockQuantity,
        },
      });
    }
  }

  for (const [index, image] of parsed.images.entries()) {
    if (image.id) {
      await prisma.productImage.update({
        where: { id: image.id },
        data: { url: image.url, altText: image.altText || null, position: index },
      });
    } else {
      await prisma.productImage.create({
        data: { productId: product.id, url: image.url, altText: image.altText || null, position: index },
      });
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath(`/products/${product.slug}`);

  redirect("/admin/products");
}

export async function deleteProduct(productId: string) {
  await requireAdmin();
  await prisma.product.delete({ where: { id: productId } });
  revalidatePath("/admin/products");
}
