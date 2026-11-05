package com.contour.app.guidance

import kotlin.math.*

/** Calculate a destination bearing, not a traversable route. Sensor integration is separate. */
object CompassGuide {
    fun bearing(latitude: Double, longitude: Double, targetLatitude: Double, targetLongitude: Double): Double {
        val lat1 = Math.toRadians(latitude)
        val lat2 = Math.toRadians(targetLatitude)
        val delta = Math.toRadians(targetLongitude - longitude)
        return (Math.toDegrees(atan2(sin(delta) * cos(lat2), cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(delta))) + 360) % 360
    }
}
