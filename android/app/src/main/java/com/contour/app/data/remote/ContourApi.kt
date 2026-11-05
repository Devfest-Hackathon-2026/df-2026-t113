package com.contour.app.data.remote

import com.contour.app.BuildConfig
import com.contour.app.data.model.Destination
import com.contour.app.data.model.NavigationRoute
import com.contour.app.data.model.Waypoint
import java.io.IOException
import java.net.HttpURLConnection
import java.net.URI
import java.net.URLEncoder
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject

class ContourApi(private val baseUrl: String = BuildConfig.API_BASE_URL) {
    private suspend fun get(path: String): JSONObject = withContext(Dispatchers.IO) {
        val connection = URI(baseUrl.trimEnd('/') + "/" + path).toURL().openConnection() as HttpURLConnection
        try {
            connection.connectTimeout = 10000
            connection.readTimeout = 10000
            if (connection.responseCode !in 200..299) throw IOException("API request failed (HTTP ${connection.responseCode})")
            connection.inputStream.bufferedReader().use { JSONObject(it.readText()) }
        } finally { connection.disconnect() }
    }

    suspend fun destinations(latitude: Double, longitude: Double): List<Destination> {
        val rows = get("destinations?lat=$latitude&lng=$longitude&disaster=earthquake").getJSONArray("destinations")
        return List(rows.length()) { index ->
            val row = rows.getJSONObject(index)
            Destination(row.getString("id"), row.getString("name"), row.getDouble("latitude"), row.getDouble("longitude"), row.getBoolean("isDemo"), row.getString("openingStatus"))
        }
    }

    suspend fun directions(id: String, latitude: Double, longitude: Double): NavigationRoute {
        val row = get("directions?originLat=$latitude&originLng=$longitude&destinationId=${URLEncoder.encode(id, "UTF-8")}")
        val points = row.getJSONArray("waypoints")
        return NavigationRoute(row.getString("id"), row.getString("destinationId"), row.getBoolean("isDemo"), List(points.length()) { index ->
            val point = points.getJSONObject(index)
            Waypoint(point.getDouble("latitude"), point.getDouble("longitude"), point.getString("instruction"))
        })
    }
}
