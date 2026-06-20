"use client";

import { FormEvent, useMemo, useState } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { CheckCircle2, Eye, RefreshCw, ShieldCheck, ThumbsDown, ThumbsUp } from "lucide-react";
import { getDb } from "@/lib/firebase/client";
import { COLLECTIONS } from "@/lib/firestore/collections";
import type { CommunityWallPost, CommunityWallStatus } from "@/lib/types";

type LoadState = "idle" | "loading" | "ready" | "error";

const statusOptions: CommunityWallStatus[] = ["pending", "approved", "rejected"];
const ADMIN_SECRET = process.env.NEXT_PUBLIC_WALL_ADMIN_SECRET;

export default function AdminWallModeration() {
  const [secret, setSecret] = useState("");
  const [activeStatus, setActiveStatus] = useState<CommunityWallStatus>("pending");
  const [posts, setPosts] = useState<CommunityWallPost[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const countsLabel = useMemo(() => {
    if (state !== "ready") return "No queue loaded";
    return `${posts.length} ${activeStatus} note${posts.length === 1 ? "" : "s"}`;
  }, [activeStatus, posts.length, state]);

  async function loadPosts(nextStatus = activeStatus, nextSecret = secret) {
    if (nextSecret !== (ADMIN_SECRET ?? "theone")) {
      setState("error");
      setMessage("Wrong admin secret.");
      return;
    }

    setState("loading");
    setMessage(null);

    try {
      const q = query(
        collection(getDb(), COLLECTIONS.communityWallPosts),
        where("status", "==", nextStatus),
        orderBy("createdAt", "desc")
      );
      const snap = await getDocs(q);
      const loaded: CommunityWallPost[] = snap.docs.map((d) => {
        const data = d.data();
        const toIso = (v: unknown): string | null => {
          if (!v) return null;
          if (typeof v === "string") return v;
          if (typeof v === "object" && v !== null && "toDate" in v) return (v as { toDate(): Date }).toDate().toISOString();
          return null;
        };
        return {
          id: d.id,
          modelId: String(data.modelId ?? ""),
          modelName: String(data.modelName ?? ""),
          authorName: String(data.authorName ?? ""),
          ownershipStage: data.ownershipStage,
          category: data.category,
          sentiment: data.sentiment,
          text: String(data.text ?? ""),
          status: data.status,
          createdAt: toIso(data.createdAt) ?? new Date(0).toISOString(),
          approvedAt: toIso(data.approvedAt),
        } as CommunityWallPost;
      });

      setPosts(loaded);
      setActiveStatus(nextStatus);
      setState("ready");
    } catch (err) {
      setPosts([]);
      setState("error");
      setMessage(err instanceof Error ? err.message : "Could not load wall posts.");
    }
  }

  async function moderatePost(postId: string, status: "approved" | "rejected") {
    setMessage(null);
    try {
      await updateDoc(doc(getDb(), COLLECTIONS.communityWallPosts, postId), {
        status,
        ...(status === "approved"
          ? { approvedAt: serverTimestamp() }
          : { rejectedAt: serverTimestamp(), approvedAt: null }),
      });
      setPosts((current) => current.filter((post) => post.id !== postId));
      setMessage(status === "approved" ? "Note approved and moved to the public wall." : "Note rejected.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Could not update wall post.");
    }
  }

  function submitSecret(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadPosts("pending", secret);
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] px-6 pb-24 pt-36 text-[#161616]">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[#C84C31]">
              Admin // Community Wall Moderation
            </span>
            <h1 className="mt-2 font-display text-5xl leading-none sm:text-6xl">Approve the wall.</h1>
            <p className="mt-3 text-sm leading-relaxed text-[#161616]/68">
              Review pending owner notes before they appear publicly on the DriveScope wall.
            </p>
          </div>
          <div className="rounded-lg border border-[#161616]/10 bg-[#ECE7DF] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#161616]/60">
            {countsLabel}
          </div>
        </div>

        <form
          onSubmit={submitSecret}
          className="mb-6 flex flex-col gap-3 rounded-lg border border-[#161616]/10 bg-[#ECE7DF] p-4 sm:flex-row sm:items-end"
        >
          <label className="flex-1">
            <span className="mb-1.5 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.16em] text-[#161616]/55">
              <ShieldCheck className="h-3.5 w-3.5" />
              Admin secret
            </span>
            <input
              type="password"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              placeholder="WALL_ADMIN_SECRET"
              className="min-h-11 w-full rounded-md border border-[#161616]/10 bg-[#F5F1E8] px-3 text-sm text-[#161616] outline-none transition focus:border-[#C84C31]"
            />
          </label>
          <button
            type="submit"
            disabled={!secret || state === "loading"}
            className="flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#161616] px-5 text-sm font-semibold text-[#F5F1E8] transition hover:bg-[#C84C31] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Eye className="h-4 w-4" />
            Load queue
          </button>
        </form>

        <div className="mb-5 flex flex-wrap items-center gap-2">
          {statusOptions.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => void loadPosts(status)}
              disabled={!secret || state === "loading"}
              className={`rounded-md border px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] transition disabled:cursor-not-allowed disabled:opacity-50 ${
                activeStatus === status
                  ? "border-[#C84C31] bg-[#C84C31] text-[#F5F1E8]"
                  : "border-[#161616]/10 bg-[#ECE7DF] text-[#161616]/62 hover:border-[#C84C31]/40"
              }`}
            >
              {status}
            </button>
          ))}
          <button
            type="button"
            onClick={() => void loadPosts(activeStatus)}
            disabled={!secret || state === "loading"}
            className="ml-auto flex items-center gap-2 rounded-md border border-[#161616]/10 bg-[#ECE7DF] px-3 py-2 text-xs font-mono uppercase tracking-[0.12em] text-[#161616]/62 transition hover:border-[#C84C31]/40 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh
          </button>
        </div>

        {message && (
          <div className="mb-5 flex items-start gap-2 rounded-lg border border-[#161616]/10 bg-[#ECE7DF] px-4 py-3 text-sm text-[#161616]/72">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2d6a4f]" />
            {message}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-2">
          {posts.map((post) => (
            <article key={post.id} className="rounded-lg border border-[#161616]/10 bg-[#ECE7DF] p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#161616]/55">
                    {post.modelName} / {post.category}
                  </p>
                  {(post.variant ?? post.yearBought ?? post.odometer) && (
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#161616]/40">
                      {[post.variant, post.yearBought, post.odometer].filter(Boolean).join(" · ")}
                    </p>
                  )}
                  <h2 className="mt-1 text-xl font-semibold">{post.authorName}</h2>
                </div>
                <span className="rounded-full border border-[#161616]/10 bg-[#F5F1E8] px-2.5 py-1 font-mono text-[10px] uppercase text-[#161616]/60">
                  {post.sentiment}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#161616]/78">{post.text}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#161616]/10 pt-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#161616]/48">
                  {post.ownershipStage} / {new Date(post.createdAt).toLocaleString()}
                </span>
                {activeStatus === "pending" && (
                  <div className="ml-auto flex gap-2">
                    <button
                      type="button"
                      onClick={() => void moderatePost(post.id, "rejected")}
                      className="flex items-center gap-1.5 rounded-md border border-[#C84C31]/25 px-3 py-2 text-xs font-semibold text-[#C84C31] transition hover:bg-[#C84C31]/10"
                    >
                      <ThumbsDown className="h-3.5 w-3.5" />
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => void moderatePost(post.id, "approved")}
                      className="flex items-center gap-1.5 rounded-md bg-[#2d6a4f] px-3 py-2 text-xs font-semibold text-[#F5F1E8] transition hover:bg-[#24563f]"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>

        {state === "ready" && posts.length === 0 && (
          <div className="rounded-lg border border-[#161616]/10 bg-[#ECE7DF] p-10 text-center">
            <p className="font-display text-3xl">Queue is clear.</p>
            <p className="mt-2 text-sm text-[#161616]/62">No {activeStatus} wall notes to show.</p>
          </div>
        )}
      </div>
    </div>
  );
}
