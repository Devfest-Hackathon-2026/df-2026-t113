import { readFileSync } from "node:fs";
import { z } from "zod";
import {
  navigationRouteSchema,
  type DirectionsQuery,
  type NavigationRoute,
} from "../schemas/directions.js";
import { distanceMeters } from "./destinationService.js";
const routes = z
  .array(navigationRouteSchema)
  .parse(
    JSON.parse(
      readFileSync(
        new URL("../../data/demo-routes.json", import.meta.url),
        "utf8",
      ),
    ),
  );
/** Return a saved demo route only when the origin is within its supported start area. */
export function findDemoRoute(
  query: DirectionsQuery,
): NavigationRoute | undefined {
  return routes.find((route) => {
    const start = route.waypoints[0];
    return (
      start !== undefined &&
      route.destinationId === query.destinationId &&
      distanceMeters(
        query.originLat,
        query.originLng,
        start.latitude,
        start.longitude,
      ) <= route.maxOriginDistanceMeters
    );
  });
}
