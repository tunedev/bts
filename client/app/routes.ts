import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  layout("layouts/RootLayout.tsx", [
    layout("layouts/WelcomePageFrame.tsx", [index("routes/home.tsx")]),
    layout("layouts/RSVPPageFrame.tsx", [route("/rsvp", "routes/rsvp.tsx")]),
    route("/admin/login", "routes/admin/login.tsx"),
    route("/admin/dashboard", "routes/admin/dashboard.tsx"),
  ]),
] satisfies RouteConfig;
