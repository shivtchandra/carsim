import { MetadataRoute } from "next";
import { models } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticRoutes = [
    "",
    "/explore",
    "/compare",
    "/cost",
    "/race",
    "/simulate",
    "/wall",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  const dynamicRoutes = models.map((model) => ({
    url: `${baseUrl}/cars/${model.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
