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
import { Toaster } from "react-hot-toast";

export async function loader() {
  return json({
    FLOP_CONFIG: {
      API_URL: process.env.API_URL,
    },
  });
}

export default function App() {
  const data = useLoaderData<typeof loader>();
  useGoogleCastScripts();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>flop - the mobile game</title>

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

        <Meta />
        <Links />
      </head>
      <body className="font-sans antialiased bg-gray-900">
        <Toaster />
        <RecoilRoot>
          <Outlet />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.ENV = ${JSON.stringify(data.FLOP_CONFIG)}`,
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
