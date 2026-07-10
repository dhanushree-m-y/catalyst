import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://catalyst-self-eight.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  // public, indexable pages only
  const paths: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/git-with-her", priority: 0.9 },
    { path: "/register", priority: 0.8 },
    { path: "/join", priority: 0.7 },
    { path: "/sponsor", priority: 0.7 },
    { path: "/volunteer", priority: 0.6 },
    { path: "/host", priority: 0.6 },
    { path: "/login", priority: 0.4 },
    { path: "/signup", priority: 0.4 },
  ];
  return paths.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: "weekly",
    priority,
  }));
}
