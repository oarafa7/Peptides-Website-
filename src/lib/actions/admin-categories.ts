"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { requireAdmin } from "@/lib/actions/guard";

const categorySchema = z.object({
  name: z.string().min(1),
  nameAr: z.string().optional(),
  slug: z.string().optional(),
  description: z.string().optional(),
  descriptionAr: z.string().optional(),
});

function revalidateCategoryPaths() {
  for (const locale of ["en", "ar"]) {
    revalidatePath(`/${locale}/admin/categories`);
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/shop`);
    revalidatePath(`/${locale}/admin/products`);
    revalidatePath(`/${locale}/admin/products/new`);
  }
}

export async function createCategory(formData: FormData) {
  await requireAdmin();

  const parsed = categorySchema.parse({
    name: formData.get("name"),
    nameAr: formData.get("nameAr") || undefined,
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    descriptionAr: formData.get("descriptionAr") || undefined,
  });

  const slugBase = slugify(parsed.slug || parsed.name);
  let slug = slugBase;
  let suffix = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${suffix++}`;
  }

  await prisma.category.create({
    data: {
      name: parsed.name,
      nameAr: parsed.nameAr || null,
      slug,
      description: parsed.description || null,
      descriptionAr: parsed.descriptionAr || null,
    },
  });

  revalidateCategoryPaths();
}

export async function updateCategory(categoryId: string, formData: FormData) {
  await requireAdmin();

  const parsed = categorySchema.parse({
    name: formData.get("name"),
    nameAr: formData.get("nameAr") || undefined,
    slug: formData.get("slug") || undefined,
    description: formData.get("description") || undefined,
    descriptionAr: formData.get("descriptionAr") || undefined,
  });

  const current = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!current) throw new Error("Category not found");

  const slugBase = slugify(parsed.slug || parsed.name);
  let slug = slugBase;
  if (slug !== current.slug) {
    let suffix = 1;
    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${slugBase}-${suffix++}`;
    }
  }

  await prisma.category.update({
    where: { id: categoryId },
    data: {
      name: parsed.name,
      nameAr: parsed.nameAr || null,
      slug,
      description: parsed.description || null,
      descriptionAr: parsed.descriptionAr || null,
    },
  });

  revalidateCategoryPaths();
}

export async function deleteCategory(categoryId: string) {
  await requireAdmin();
  await prisma.category.delete({ where: { id: categoryId } });
  revalidateCategoryPaths();
}
