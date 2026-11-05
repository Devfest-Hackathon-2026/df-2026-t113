import { readFileSync } from "node:fs";
import { z } from "zod";
import {
  destinationSchema,
  type Destination,
  type NearbyQuery,
} from "../schemas/destination.js";
const destinations = z
  .array(destinationSchema)
  .parse(
    JSON.parse(
      readFileSync(
        new URL("../../data/destinations.json", import.meta.url),
        "utf8",
      ),
    ),
  );
/** Calculate great-circle distance in meters between geographic coordinates. */
export function distanceMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const radians = (degrees: number) => (degrees * Math.PI) / 180;
  const a =
    Math.sin(radians(lat2 - lat1) / 2) ** 2 +
    Math.cos(radians(lat1)) *
      Math.cos(radians(lat2)) *
      Math.sin(radians(lng2 - lng1) / 2) ** 2;
  return (
    6371000 *
    2 *
    Math.atan2(Math.sqrt(Math.min(1, a)), Math.sqrt(Math.max(0, 1 - a)))
  );
}
/** Return destinations designated for the requested hazard, sorted by distance. */
export function findNearbyDestinations(
  query: NearbyQuery,
): (Destination & { distanceMeters: number })[] {
  return destinations
    .filter(
      (site) =>
        site.kind === "emergencySite" &&
        site.disasters.includes(query.disaster),
    )
    .map((site) => ({
      ...site,
      distanceMeters: Math.round(
        distanceMeters(query.lat, query.lng, site.latitude, site.longitude),
      ),
    }))
    .filter((site) => site.distanceMeters <= query.radiusMeters)
    .sort((a, b) => a.distanceMeters - b.distanceMeters);
}
export function destinationExists(id: string): boolean {
  return destinations.some((site) => site.id === id);
}
