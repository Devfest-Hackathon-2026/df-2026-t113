# Scaffold walkthrough

1. Start the backend and verify /health.
2. Configure the Android API URL, then build/install the app.
3. Open Evacuation-AR. It searches using a fixed synthetic origin and earthquake filter.
4. Confirm the fictional-data notice and unknown opening status.
5. Tap Preview demo route to view three synthetic instruction strings.
6. Disconnect the backend and retry to verify the visible error/retry state.

This walkthrough does not activate AR, device location, maps, voice, or offline
fallback. Those are follow-up implementation milestones. Do not present the
synthetic coordinates as a field-test route.

Next work: prove ARCore tracking on the intended phone, obtain and verify official
nearby destinations, survey one pedestrian route, implement confidence-aware arrow
rendering and route progression, then add voice and offline-cache integration.
