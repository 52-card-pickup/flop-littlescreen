import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import stylesheet from "~/tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

import { RecoilRoot } from "recoil";
import { useGoogleCastScripts } from "./hooks/cast_sender/useGoogleCastScripts";
import { ToasterProvider } from "./contexts/toaster";

declare global {
  var ENV: {
    API_URL: string;
  };
}

export async function loader() {
  return json({
    FLOP_CONFIG: {
      API_URL: process.env.API_URL,
    },
  });
}

function safeEnv(key: string): string {
  try {
    return process.env[key] || "";
  } catch {
    return "";
  }
}

async function purgeCDN() {
  const cloudflareToken = safeEnv("CLOUDFLARE_API_TOKEN");
  if (!cloudflareToken) {
    console.info("Missing CLOUDFLARE_API_TOKEN, skipping CDN purge");
    return;
  }
  const urls = { betaHome: "https://beta.flop.party/" };

  const purgeKeys: (keyof typeof urls)[] = ["betaHome"];

  const zoneId = "b8798b2dc2a7dc45852d3f58242abdbe";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + cloudflareToken,
    },
    body: JSON.stringify({ files: purgeKeys.map((key) => urls[key]) }),
  };

  const success = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/purge_cache`,
    options
  )
    .then((response) => response.json())
    .then((response) => {
      if (!response.success) {
        return Promise.reject(response);
      }

      console.log(
        `Purged Cloudflare cache for paths: ${purgeKeys.join(", ")}`,
        response
      );

      return true;
    })
    .catch((err) => {
      console.error(
        `Failed to purge Cloudflare cache for paths: ${purgeKeys.join(", ")}`,
        err
      );

      return false;
    });

  if (!success) {
    return;
  }

  for (const key of purgeKeys) {
    console.log(`Populating cache for ${key} @ ${urls[key]}`);
    await fetch(urls[key], { method: "PURGE" })
      .then((response) => {
        if (response.ok) {
          console.log(`Purged cache for ${key} @ ${urls[key]}`);
        } else {
          console.error(`Failed to purge cache for ${key} @ ${urls[key]}`);
        }
      })
      .catch((err) => {
        console.error(`Failed to purge cache for ${key} @ ${urls[key]}`, err);
      });
  }
}

purgeCDN();

export default function App() {
  const data = useLoaderData<typeof loader>();
  useGoogleCastScripts();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>flop. poker - the mobile game</title>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Emoji:wght@300..700&family=Sono:wght,MONO@200..800,0..1&display=swap"
          rel="stylesheet"
        />

        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png?v=2"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png?v=2"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png?v=2"
        />
        <link rel="manifest" href="/site.webmanifest?v=2" />
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg?v=2"
          color="#007357"
        />
        <link rel="shortcut icon" href="/favicon.ico?v=2" />
        <meta name="apple-mobile-web-app-title" content="flop." />
        <meta name="application-name" content="flop." />
        <meta name="msapplication-TileColor" content="#007357" />
        <meta name="theme-color" content="#007357" />

        <Meta />
        <Links />
      </head>
      <body className="font-sans antialiased bg-mystic-100">
        <RecoilRoot>
          <ToasterProvider>
            <Outlet />
          </ToasterProvider>
          <script
            dangerouslySetInnerHTML={{
              __html: `globalThis.ENV = ${JSON.stringify(data.FLOP_CONFIG)}`,
            }}
          />
        </RecoilRoot>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
