import { Router } from "express";
import {
  nearbyQuerySchema,
  destinationSchema,
} from "../schemas/destination.js";
import { z } from "zod";
import { findNearbyDestinations } from "../services/destinationService.js";
export const destinationsRouter = Router();
const responseSchema = z.object({
  destinations: z.array(
    destinationSchema.extend({ distanceMeters: z.number().nonnegative() }),
  ),
});
destinationsRouter.get("/", (req, res) => {
  const parsed = nearbyQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      error: "INVALID_QUERY",
      message: "Provide valid lat, lng, disaster, and optional radiusMeters.",
    });
    return;
  }
  res.json(
    responseSchema.parse({ destinations: findNearbyDestinations(parsed.data) }),
  );
});
