import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/Beatmaker_Cues.html", "/Swiss-VJ.html"],
      disallow: [
        "/Console%20Booth.html",
        "/EchoFrame.html",
        "/FocusDraft.html",
        "/LoopForge8.html",
        "/OwaeConsole.html",
        "/PadStory.html",
        "/StagePlot.html",
        "/SwissArtSampler.html",
        "/TimeCapsule.html",
        "/owae_ga_anime.html",
        "/setlist_architect_single_file_app_v_1.html",
      ],
    },
    sitemap: "https://owae.ga/sitemap.xml",
    host: "https://owae.ga",
  };
}
