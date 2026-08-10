"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user;
}

const profileSchema = z.object({
  name: z.string().min(1),
});

export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  const parsed = profileSchema.parse({ name: formData.get("name") });

  await prisma.user.update({ where: { id: user.id }, data: { name: parsed.name } });
  revalidatePath("/account");
}

const addressSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(2).default("US"),
  phone: z.string().optional(),
  isDefault: z.coerce.boolean().optional(),
});

export async function upsertAddress(formData: FormData) {
  const user = await requireUser();
  const parsed = addressSchema.parse({
    id: formData.get("id") || undefined,
    fullName: formData.get("fullName"),
    line1: formData.get("line1"),
    line2: formData.get("line2") || undefined,
    city: formData.get("city"),
    state: formData.get("state"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country") || "US",
    phone: formData.get("phone") || undefined,
    isDefault: formData.get("isDefault") === "on",
  });

  if (parsed.isDefault) {
    await prisma.address.updateMany({ where: { userId: user.id }, data: { isDefault: false } });
  }

  if (parsed.id) {
    await prisma.address.update({
      where: { id: parsed.id },
      data: { ...parsed, userId: user.id },
    });
  } else {
    await prisma.address.create({ data: { ...parsed, userId: user.id } });
  }

  revalidatePath("/account/addresses");
}

export async function deleteAddress(addressId: string) {
  const user = await requireUser();
  await prisma.address.deleteMany({ where: { id: addressId, userId: user.id } });
  revalidatePath("/account/addresses");
}
