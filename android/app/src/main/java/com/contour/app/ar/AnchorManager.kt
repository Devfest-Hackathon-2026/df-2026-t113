package com.contour.app.ar

import com.google.ar.core.Anchor

/** Release owned ARCore anchors when replacing a route or closing the session. */
class AnchorManager {
    private val anchors = mutableListOf<Anchor>()
    fun add(anchor: Anchor) { anchors.add(anchor) }
    fun clear() { anchors.forEach { it.detach() }; anchors.clear() }
}
