package com.contour.app.guidance

/** Manual preview progress only; automatic location-based progression is not wired yet. */
class RouteProgress(private val waypointCount: Int) {
    init { require(waypointCount > 0) }
    var index: Int = 0
        private set
    fun advance() { if (index < waypointCount - 1) index++ }
}
