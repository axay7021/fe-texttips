import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      uid: session.user.id,
      email: session.user.email,
      name: session.user.name,
    });
  } catch (error) {
    console.error("Get User Error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
