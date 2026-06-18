import { FieldValue } from "firebase-admin/firestore";
import { NextRequest, NextResponse } from "next/server";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { assertWallAdminSecret, getAdminDb } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    assertWallAdminSecret(request.headers.get("x-wall-admin-secret"));

    const { postId } = await context.params;
    const body = (await request.json()) as { status?: string };

    if (body.status !== "approved" && body.status !== "rejected") {
      return NextResponse.json({ error: "Status must be approved or rejected." }, { status: 400 });
    }

    const update =
      body.status === "approved"
        ? { status: "approved", approvedAt: FieldValue.serverTimestamp() }
        : { status: "rejected", approvedAt: null, rejectedAt: FieldValue.serverTimestamp() };

    await getAdminDb().collection(COLLECTIONS.communityWallPosts).doc(postId).update(update);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update wall post.";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
