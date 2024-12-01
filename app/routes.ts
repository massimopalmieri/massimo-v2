import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index/route.tsx"),
  route("test", "./routes/test.tsx"),
  route("api/contact", "./routes/api.contact/route.ts"),
  route("api/theme", "./routes/api.theme.ts"),
] satisfies RouteConfig;
