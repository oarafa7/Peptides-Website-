// TEMPORARY one-shot maintenance endpoint — reset admin password.
// Path: /api/dev/reset-admin?key=<SECRET>
// POST → resets/creates admin user with fresh credentials.
// Remove this file in a follow-up commit once used.

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { Role } from "@prisma/client";

const SECRET = "s2w75LaWyX-HeqE-DzzzYsfgIEAjAjgJEM04ootyFQI";
const NEW_EMAIL = "omar@mmsupplements.shop";
const NEW_PASSWORD = "MMSup2026!Reset";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  if (url.searchParams.get("key") !== SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // BEFORE snapshot: list current admins so we know the state
  const before = await prisma.user.findMany({
    where: { role: Role.ADMIN },
    select: { id: true, email: true, name: true, createdAt: true },
  });

  const passwordHash = await bcrypt.hash(NEW_PASSWORD, 10);

  // Upsert the target admin — if exists, update password; else create.
  const user = await prisma.user.upsert({
    where: { email: NEW_EMAIL },
    update: {
      passwordHash,
      role: Role.ADMIN,
      name: "Omar Arafa",
    },
    create: {
      email: NEW_EMAIL,
      name: "Omar Arafa",
      passwordHash,
      role: Role.ADMIN,
      emailVerified: new Date(),
    },
    select: { id: true, email: true, role: true, name: true, createdAt: true },
  });

  const after = await prisma.user.findMany({
    where: { role: Role.ADMIN },
    select: { id: true, email: true, name: true },
  });

  return NextResponse.json({
    beforeAdminCount: before.length,
    before,
    user,
    after,
    loginWith: { email: NEW_EMAIL, password: NEW_PASSWORD },
  });
}
