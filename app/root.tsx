import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type {LinksFunction, MetaFunction} from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import "./tailwind.css";
import {ReactNode} from 'react';

export const meta: MetaFunction = () => {
  return [
    {title: 'Massimo Palmieri'},
    {charSet: 'utf-8'},
    {viewport: 'width=device-width,initial-scale=1'},
  ]
}

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
];

export const loader = async () => {
  return { gaTrackingId: process.env.GA_TRACKING_ID };
};

export function Layout({ children }: { children: ReactNode }) {
  const {gaTrackingId} = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
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
