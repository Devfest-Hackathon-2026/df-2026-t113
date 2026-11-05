import { z } from "zod";
export const waypointSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  instruction: z.string().min(1),
});
export const navigationRouteSchema = z.object({
  id: z.string(),
  destinationId: z.string(),
  isDemo: z.literal(true),
  verifiedAt: z.string().nullable(),
  maxOriginDistanceMeters: z.number().positive(),
  waypoints: z.array(waypointSchema).min(2),
});
const coordinate = z.string().trim().min(1).pipe(z.coerce.number());
export const directionsQuerySchema = z.object({
  originLat: coordinate.pipe(z.number().min(-90).max(90)),
  originLng: coordinate.pipe(z.number().min(-180).max(180)),
  destinationId: z.string().min(1),
});
export type NavigationRoute = z.infer<typeof navigationRouteSchema>;
export type DirectionsQuery = z.infer<typeof directionsQuerySchema>;
