import { Links, Meta, Outlet, Scripts, ScrollRestoration, useRouteLoaderData } from "react-router";
import type { LinksFunction, LoaderFunction, MetaFunction } from "react-router";

import "./tailwind.css";
import { ReactNode } from "react";

export const meta: MetaFunction = () => {
  return [
    { title: "Massimo Palmieri" },
    { charSet: "utf-8" },
    { viewport: "width=device-width,initial-scale=1" },
  ];
};
export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
];

export const loader: LoaderFunction = async () => {
  return {
    ENV: {
      RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    },
  };
};

export function Layout({ children }: { children: ReactNode }) {
  const isProduction = process.env.NODE_ENV === "production";
  const isDevelopment = process.env.NODE_ENV === "development";

  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />

        {isProduction && (
          <script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id="e02d5129-e6c6-4b6b-baa0-c66650fd7fa6"
          ></script>
        )}

        {isDevelopment && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                console.log('Analytics disabled in development');
                window.umami = {
                  track: (...args) => console.log('Track event (dev):', ...args)
                };
              `,
            }}
          />
        )}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function useRootLoaderData() {
  return useRouteLoaderData<typeof loader>("root");
}
