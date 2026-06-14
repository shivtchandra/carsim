"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useGsapReveal<T extends HTMLElement>(
  options?: { stagger?: number; y?: number; duration?: number }
) {
  const ref = useRef<T>(null);
  const { stagger = 0.08, y = 48, duration = 0.9 } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const targets = el.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    // Check support
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    // Set initial state
    gsap.set(targets, { opacity: 0, y });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(targets, {
              opacity: 1,
              y: 0,
              duration,
              stagger,
              ease: "power3.out",
            });
            observer.unobserve(el); // Only animate once
          }
        });
      },
      { 
        root: null,
        threshold: 0.01, // Trigger as soon as 1% is visible
        rootMargin: "0px 0px 100px 0px" // Trigger 100px before it enters the viewport
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [stagger, y, duration]);

  return ref;
}
