package com.contour.app

import androidx.test.platform.app.InstrumentationRegistry
import org.junit.Assert.assertEquals
import org.junit.Test

class PackageTest {
    @Test fun applicationPackageIsContour() {
        assertEquals("com.contour.app", InstrumentationRegistry.getInstrumentation().targetContext.packageName)
    }
}
