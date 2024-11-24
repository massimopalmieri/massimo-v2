// app/routes.ts
import { type RouteConfig } from "@react-router/dev/routes";
import { remixRoutesOptionAdapter } from "@react-router/remix-routes-option-adapter";

export default remixRoutesOptionAdapter((defineRoutes) => {
  return defineRoutes((route) => {
    route("/", "./routes/_index/route.tsx", { index: true });
    route("test", "./routes/test.tsx");
    route("api/contact", "./routes/api.contact/route.ts");
  });
}) satisfies RouteConfig;
