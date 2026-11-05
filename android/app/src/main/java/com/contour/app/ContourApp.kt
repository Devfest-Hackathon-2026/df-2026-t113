package com.contour.app

import androidx.compose.runtime.*
import com.contour.app.data.model.Destination
import com.contour.app.ui.destinations.DestinationScreen
import com.contour.app.ui.navigation.NavigationScreen

@Composable
fun ContourApp() {
    var selected by remember { mutableStateOf<Destination?>(null) }
    val destination = selected
    if (destination == null) {
        DestinationScreen(onSelect = { selected = it })
    } else {
        NavigationScreen(destination, onBack = { selected = null })
    }
}
