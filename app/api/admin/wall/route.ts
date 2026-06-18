import { NextRequest, NextResponse } from "next/server";
import { COLLECTIONS } from "@/lib/firestore/collections";
import { assertWallAdminSecret, getAdminDb } from "@/lib/firebase/admin";
import type {
  CommunityWallCategory,
  CommunityWallOwnershipStage,
  CommunityWallPost,
  CommunityWallSentiment,
  CommunityWallStatus,
} from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedStatuses: CommunityWallStatus[] = ["pending", "approved", "rejected"];

function toIso(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof value.toDate === "function"
  ) {
    return value.toDate().toISOString();
  }
  return null;
}

export async function GET(request: NextRequest) {
  try {
    assertWallAdminSecret(request.headers.get("x-wall-admin-secret"));

    const statusParam = request.nextUrl.searchParams.get("status") ?? "pending";
    const status = allowedStatuses.includes(statusParam as CommunityWallStatus)
      ? (statusParam as CommunityWallStatus)
      : "pending";

    const snapshot = await getAdminDb()
      .collection(COLLECTIONS.communityWallPosts)
      .where("status", "==", status)
      .limit(100)
      .get();

    const posts = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          modelId: String(data.modelId ?? ""),
          modelName: String(data.modelName ?? "Unknown car"),
          authorName: String(data.authorName ?? "Owner"),
          ownershipStage: String(data.ownershipStage ?? "considering") as CommunityWallOwnershipStage,
          category: String(data.category ?? "discussion") as CommunityWallCategory,
          sentiment: String(data.sentiment ?? "mixed") as CommunityWallSentiment,
          text: String(data.text ?? ""),
          status: String(data.status ?? "pending") as CommunityWallStatus,
          createdAt: toIso(data.createdAt) ?? new Date(0).toISOString(),
          approvedAt: toIso(data.approvedAt),
        } satisfies CommunityWallPost;
      })
      .sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));

    return NextResponse.json({ posts });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load wall posts.";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
