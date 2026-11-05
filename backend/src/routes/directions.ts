import { Router } from "express";
import {
  directionsQuerySchema,
  navigationRouteSchema,
} from "../schemas/directions.js";
import { destinationExists } from "../services/destinationService.js";
import { findDemoRoute } from "../services/directionsService.js";
export const directionsRouter = Router();
directionsRouter.get("/", (req, res) => {
  const parsed = directionsQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({
      error: "INVALID_QUERY",
      message: "Provide originLat, originLng, and destinationId.",
    });
    return;
  }
  if (!destinationExists(parsed.data.destinationId)) {
    res.status(404).json({ error: "DESTINATION_NOT_FOUND" });
    return;
  }
  const route = findDemoRoute(parsed.data);
  if (!route) {
    res.status(422).json({
      error: "UNSUPPORTED_ORIGIN",
      message: "No demo route is available from this origin.",
    });
    return;
  }
  res.json(navigationRouteSchema.parse(route));
});
