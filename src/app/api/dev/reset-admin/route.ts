// TEMPORARY one-shot maintenance endpoint.
// Resets the admin identity to mm@mmsupplements.shop with password 12345678
// for handover. Delete this file immediately after use.

import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const SECRET = "YF30tMh7WN8oHFXQTDcCN8ADaM_1UcVW58mvHuQ8TTs";
const NEW_EMAIL = "mm@mmsupplements.shop";
const NEW_PASSWORD = "12345678";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  if (url.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Target the live admin user by ID (the omar@ account created on launch day).
  // The other ADMIN (admin@peptidelab.test) is a seed leftover; leaving it untouched.
  const TARGET_USER_ID = "cmswa8sow0000la2jfxf30uo2";

  // BEFORE snapshot — every admin user (for audit trail in response)
  const before = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  const admin = before.find((u) => u.id === TARGET_USER_ID);
  if (!admin) {
    return NextResponse.json(
      { error: `Target admin ${TARGET_USER_ID} not found`, before },
      { status: 404 }
    );
  }
  const passwordHash = await bcrypt.hash(NEW_PASSWORD, 10);

  // If NEW_EMAIL already exists on a DIFFERENT user, refuse (unique constraint would crash otherwise)
  const collision = await prisma.user.findUnique({ where: { email: NEW_EMAIL } });
  if (collision && collision.id !== admin.id) {
    return NextResponse.json(
      { error: `Email ${NEW_EMAIL} already exists on user ${collision.id}`, before },
      { status: 409 }
    );
  }

  const updated = await prisma.user.update({
    where: { id: admin.id },
    data: {
      email: NEW_EMAIL,
      passwordHash,
      name: "MM Supplements Admin",
    },
    select: { id: true, email: true, name: true, role: true, updatedAt: true },
  });

  return NextResponse.json({ before, updated, note: "Delete this endpoint immediately." });
}
