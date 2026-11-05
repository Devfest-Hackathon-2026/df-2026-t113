package com.contour.app.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.contour.app.data.model.Destination

@Composable
fun DestinationCard(destination: Destination, onSelect: () -> Unit) {
    Card(modifier = Modifier.fillMaxWidth()) {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text(destination.name, style = MaterialTheme.typography.titleMedium)
            Text("Opening status: ${destination.openingStatus}")
            if (destination.isDemo) Text("Fictional sample — not an evacuation destination")
            Button(onClick = onSelect) { Text("Preview demo route") }
        }
    }
}
