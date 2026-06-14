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
    route("succession", "routes/succession.tsx"),
    route("career-planning", "routes/career-planning.tsx"),
    route("upload", "routes/upload.tsx"),
    route("vacancies", "routes/vacancies.tsx"),
  ]),
] satisfies RouteConfig;
