import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("routes/app-layout.tsx", [
    index("routes/home.tsx"),
    route("talent-insights", "routes/talent-insights.tsx"),
    route("profile/:employeeId", "routes/profile.tsx"),
  ]),
] satisfies RouteConfig;
