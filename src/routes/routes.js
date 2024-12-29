import { buildRoutePath } from "../utils/build-route-path.js";

import { routes as userRoutes } from "./users.js";
import { routes as taskRoutes } from "./tasks.js";

export const routes = [...userRoutes, ...taskRoutes].map((route) => {
  route.path = buildRoutePath(route.path);

  return route;
});
