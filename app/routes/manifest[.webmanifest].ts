import type { WebAppManifest } from "@remix-pwa/dev";
import { json } from "@remix-run/node";

export const loader = () => {
  return json(
    {
      name: "CtsMesh PWA",
      short_name: "PWA",
      start_url: "/",
      display: "standalone",
      lang: "en",
      orientation: "portrait",
      scope: "/",
      background_color: "#d3d7dd",
      theme_color: "#c34138",
      icons: [
        {
          src: "/static/icons/icon-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "/static/icons/icon-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    } as WebAppManifest,
    {
      headers: {
        "Cache-Control": "public, max-age=600",
        "Content-Type": "application/manifest+json",
      },
    }
  );
};
