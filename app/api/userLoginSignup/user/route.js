import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { usersTable } from "@/utils/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

export async function POST(req) {
  try {
    const { email, name } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // Explicit .select to avoid drizzle/neon issues
    const existing = await db
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        subscriptionId: usersTable.subscriptionId,
      })
      .from(usersTable)
      .where(eq(usersTable.email, email));

    if (existing.length > 0) {
      return NextResponse.json({
        message: "User already exists",
        user: existing[0],
      });
    }

    // Insert new user
    const result = await db
      .insert(usersTable)
      .values({ name, email })
      .returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        subscriptionId: usersTable.subscriptionId,
      });

    return NextResponse.json({
      message: "User created",
      user: result[0],
    });
  } catch (err) {
    console.error("DB Error:", err);
    return NextResponse.json(
      { message: "Something went wrong", error: err.message },
      { status: 500 }
    );
  }
}
