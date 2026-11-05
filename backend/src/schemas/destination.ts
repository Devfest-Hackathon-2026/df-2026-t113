import { z } from "zod";
export const disasterSchema = z.enum([
  "earthquake",
  "tsunami",
  "flood",
  "landslide",
  "stormSurge",
  "fire",
  "inlandFlood",
  "volcano",
]);
export const destinationSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  address: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  disasters: z.array(disasterSchema),
  kind: z.enum(["emergencySite", "shelter"]),
  source: z.string(),
  verifiedAt: z.string().nullable(),
  isDemo: z.boolean(),
  openingStatus: z.literal("unknown"),
});
const coordinate = z.string().trim().min(1).pipe(z.coerce.number());
export const nearbyQuerySchema = z.object({
  lat: coordinate.pipe(z.number().min(-90).max(90)),
  lng: coordinate.pipe(z.number().min(-180).max(180)),
  disaster: disasterSchema,
  radiusMeters: z.coerce.number().positive().max(50000).default(5000),
});
export type Destination = z.infer<typeof destinationSchema>;
export type NearbyQuery = z.infer<typeof nearbyQuerySchema>;
