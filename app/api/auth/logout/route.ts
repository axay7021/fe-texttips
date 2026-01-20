import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });

    return NextResponse.json({ status: "logged_out" });
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ status: "logged_out" });
  }
}
