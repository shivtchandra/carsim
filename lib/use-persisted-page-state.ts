"use client";

import { useCallback, useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";

const STATE_PREFIX = "drivescope:page:";
const SCROLL_PREFIX = "drivescope:scroll:";

function readStoredState<T>(pageKey: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(`${STATE_PREFIX}${pageKey}`);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function writeStoredState<T>(pageKey: string, state: T) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`${STATE_PREFIX}${pageKey}`, JSON.stringify(state));
  } catch {
    // quota or private mode — ignore
  }
}

function readStoredScroll(pageKey: string): number | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(`${SCROLL_PREFIX}${pageKey}`);
  if (!raw) return null;
  const y = Number(raw);
  return Number.isFinite(y) ? y : null;
}

function writeStoredScroll(pageKey: string, y: number) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(`${SCROLL_PREFIX}${pageKey}`, String(Math.round(y)));
  } catch {
    // ignore
  }
}

/** Persist page UI state in sessionStorage (survives car detail → back). */
export function usePersistedPageState<T extends Record<string, unknown>>(
  pageKey: string,
  defaults: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const stored = readStoredState<T>(pageKey);
    return stored ? { ...defaults, ...stored } : defaults;
  });

  useEffect(() => {
    const save = () => writeStoredState(pageKey, state);
    window.addEventListener("pagehide", save);
    return () => {
      save();
      window.removeEventListener("pagehide", save);
    };
  }, [pageKey, state]);

  return [state, setState];
}

/** Restore and continuously save scroll position for a page key. */
export function usePersistedScroll(pageKey: string, enabled = true) {
  const restored = useRef(false);

  useEffect(() => {
    if (!enabled) return undefined;
    if (restored.current) return undefined;
    restored.current = true;

    const y = readStoredScroll(pageKey);
    if (y === null) return undefined;

    const restore = () => window.scrollTo({ top: y, behavior: "auto" });
    requestAnimationFrame(() => requestAnimationFrame(restore));

    return undefined;
  }, [pageKey, enabled]);

  useEffect(() => {
    if (!enabled) return undefined;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        writeStoredScroll(pageKey, window.scrollY);
        ticking = false;
      });
    };

    const saveNow = () => writeStoredScroll(pageKey, window.scrollY);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", saveNow);
    return () => {
      saveNow();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", saveNow);
    };
  }, [pageKey, enabled]);
}

/** Patch helper for a single field in persisted state. */
export function usePersistedField<T extends Record<string, unknown>, K extends keyof T>(
  state: T,
  setState: Dispatch<SetStateAction<T>>,
  key: K,
): [T[K], (value: T[K]) => void] {
  const setter = useCallback(
    (value: T[K]) => setState((prev) => ({ ...prev, [key]: value })),
    [key, setState],
  );
  return [state[key], setter];
}
