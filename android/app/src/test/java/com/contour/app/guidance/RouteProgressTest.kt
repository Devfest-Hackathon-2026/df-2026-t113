package com.contour.app.guidance

import org.junit.Assert.assertEquals
import org.junit.Test

class RouteProgressTest {
    @Test fun progressStopsAtLastWaypoint() {
        val progress = RouteProgress(2)
        repeat(4) { progress.advance() }
        assertEquals(1, progress.index)
    }
}
