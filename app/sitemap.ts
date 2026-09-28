import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://owae.ga/",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: "https://owae.ga/Beatmaker_Cues.html",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://owae.ga/Swiss-VJ.html",
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
