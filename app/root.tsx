import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
} from "@remix-run/react";
import "./tailwind.css";

import { RecoilRoot } from "recoil";
import { useGoogleCastScripts } from "./hooks/cast_sender/useGoogleCastScripts";
import { ToasterProvider } from "./contexts/toaster";
import Index from "./routes/_index";

declare global {
  var ENV: {
    API_URL: string | null;
  };
}

export function HydrateFallback() {
  return (
    <html lang="en">
      <AppHead>
        <Meta />
        <Links />
      </AppHead>
      <AppBody>
        <RecoilRoot>
          <ToasterProvider>
            <Index />
          </ToasterProvider>
        </RecoilRoot>
        <ScrollRestoration />
        <Scripts />
      </AppBody>
    </html>
  );
}

export default function App() {
  const data = {
    FLOP_CONFIG: {
      API_URL: import.meta.env.DEV ? "http://localhost:8080/" : null,
    },
  };
  useGoogleCastScripts();

  return (
    <html lang="en">
      <AppHead>
        <Meta />
        <Links />
      </AppHead>
      <AppBody>
        <RecoilRoot>
          <ToasterProvider>
            <Outlet />
          </ToasterProvider>
        </RecoilRoot>
        <ScrollRestoration />
        <Scripts />
      </AppBody>
    </html>
  );
}

function AppHead(props: React.PropsWithChildren<{}>) {
  return (
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="description"
        content="No chips, no cards, no table? Play poker with your friends and family - we've got the accessories."
      />
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
      <link rel="mask-icon" href="/safari-pinned-tab.svg?v=2" color="#007357" />
      <link rel="shortcut icon" href="/favicon.ico?v=2" />
      <meta name="apple-mobile-web-app-title" content="flop." />
      <meta name="application-name" content="flop." />
      <meta name="msapplication-TileColor" content="#007357" />
      <meta name="theme-color" content="#007357" />

      {props.children}
    </head>
  );
}

function AppBody(
  props: React.PropsWithChildren<{
    config?: typeof globalThis.ENV;
  }>
) {
  return (
    <body className="font-sans antialiased bg-mystic-100">
      {props.config && (
        <script
          dangerouslySetInnerHTML={{
            __html: `globalThis.ENV = ${JSON.stringify(props.config)}`,
          }}
        />
      )}
      {props.children}
    </body>
  );
}
